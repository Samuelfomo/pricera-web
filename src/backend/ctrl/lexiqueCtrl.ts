import { Router, Request, Response} from 'express';
import Lexicon from '../class/Lexicon';
import HttpStatus from '../tools/https-status';
import R from '../tools/response';
import G from '../tools/glossary';
import LexiconService from '../service/Lexicon.service';
import Revision from '../tools/revision';

const router = Router();

// GET / - Liste des lexiques
router.get('/', async (req: Request, res: Response) => {
  try {
    const lexicons = await Lexicon._list(req.query || {});
    if (!lexicons || lexicons.length === 0) {
      const result = await LexiconService.getAll();
      if (!result || result.length === 0) {
        return R.handleError(res, HttpStatus.NOT_FOUND, {
          code: 'no_lexicon_found',
          message: 'No lexicon found'
        });
      }
      console.log(result);
      const drop = await Lexicon._deleteAll();
      if (!drop) {
        return R.handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, {
          code: 'delete_failed',
          message: 'Failed to delete lexicon'
        });
      }
      // return R.handleSuccess(res, ['deleted successfully', 'saved successfully']);
      console.log('deleted successfully');
      const saved = await Promise.all(result.map(async (entry) => {
        const instance = new Lexicon()
          .setGuid(entry.guid)
          .setTranslation(entry.translation)
          .setReference(entry.reference)
          .setPortable(entry.portable)
          .setUpdated(entry.updatedAt)
        await instance.save();
        return instance;
      }))
      return R.handleSuccess(res, await Promise.all(saved.map(entry => entry.toJSON())));
    }
    return R.handleSuccess(res, {
      count: lexicons.length,
      lexicons: lexicons.map((l) => l.toJSON())
    });
  } catch (error: any) {
    console.log(error.message);
    return R.handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, G.internalError);
  }
});

router.get('/revision', async (_req: Request, res: Response) => {
  try {
    const revision = await Revision.getRevision(`${G.confTable}lexicon`); // Accès à la méthode private

    R.handleSuccess(res, {
      revision,
      checked_at: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('❌ Erreur récupération révision:', error);
    R.handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, {
      code: 'revision_check_failed',
      message: 'Failed to get current revision',
    });
  }
});

// POST / - Créer un lexique
router.post('/', async (req: Request, res: Response) => {
  try {
    const { translation, reference, portable} = req.body;

    if ((!translation && typeof translation !== 'object') || !reference || typeof portable !== 'boolean') {
      return R.handleError(res, HttpStatus.BAD_REQUEST, G.missingRequired);
    }

    const data = req.body;
    const result = await LexiconService.save(data);
    if (result.status !== HttpStatus.CREATED) {
      return R.handleError(res, result.status, result.error);
    }
    const response = result.data.data;

    const lexicon = new Lexicon()
      .setGuid(response.guid)
      .setTranslation(translation)
      .setReference(reference)
      .setPortable(portable)
      .setUpdated(response.updateAt);

    await lexicon.save();

    return R.handleCreated(res, lexicon.toJSON());
  } catch (error: any) {
    console.log(error.message);
    return R.handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, G.internalError);
  }
});

// PATCH /-Créer une traduction
router.patch('/:guid/translations', async (req: Request, res: Response) => {
  try {
    const { translation } = req.body;
    if (!translation || typeof translation !== 'object' || req.params.guid.toString().length < 6) {
      return R.handleError(res, HttpStatus.BAD_REQUEST, G.missingRequired)
    }
    const guid = parseInt(req.params.guid, 10);

    const lexiconData =  await Lexicon._load(guid, true);
    if (!lexiconData) {
      return R.handleError(res, HttpStatus.NOT_FOUND, {
        code: 'entry_not_found',
        message: 'Lexicon not found with provided GUID'
      })
    }
    const data = { guid, translation }
    const result = await LexiconService.saveTranslation(data);
    if (result.status !== HttpStatus.SUCCESS) {
      return R.handleError(res, result.status, result.error);
    }
    const response = result.data.data;
    const lexicon = lexiconData.setTranslation(response.translation).setUpdated(response.updateAt);
    await lexicon.save();

    return R.handleSuccess(res, lexiconData.toJSON());
  } catch (error : any){
    console.log(error.message);
    return R.handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, G.internalError)
  }
})

// PUT /:guid - Mise à jour d'un lexique existant
router.put('/:guid', async (req: Request, res: Response) => {
  try {

    const { translation, reference, portable } = req.body;

    const data = { translation, reference, portable };
    if (translation !== undefined) {
      data.translation = translation;
    }
    if (reference !== undefined) {
      data.reference = reference;
    }
    if (portable !== undefined && typeof portable === 'boolean') {
      data.portable = portable;
    }

    // Vérification des champs
    if (req.params.guid.toString().length < 6) {
      return R.handleError(res, HttpStatus.BAD_REQUEST, G.missingRequired);
    }
    const guid = parseInt(req.params.guid, 10);
    const response = await Lexicon._load(guid, true);
    if (!response) {
      return R.handleError(res, HttpStatus.NOT_FOUND, {
        code: 'lexicon_not_found',
        message: 'Lexicon not found with provided GUID',
      });
    }
    console.log("data", data);
    const lexicon = await LexiconService.update(guid, data);
    if (!lexicon) {
      return R.handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, G.internalError);
    }
    response.setTranslation(lexicon.translation).setReference(lexicon.reference).setPortable(lexicon.portable).setUpdated(lexicon.updateAt);

    await response.save();
    return R.handleSuccess(res, response.toJSON());
  } catch (error: any) {
    console.log(error.message);
    return R.handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, G.internalError);
  }
});

// DELETE /:guid - Supprimer un lexique
router.delete('/:guid', async (req: Request, res: Response) => {
  try {
    if (req.params.guid.toString().length < 6) {
      return R.handleError(res, HttpStatus.BAD_REQUEST, {
        code: 'missing_required_guid',
        message: 'Valid GUID parameter is required'
      });
    }
    const guid = parseInt(req.params.guid, 10);
    const existing = await Lexicon._load(guid, true);
    if (!existing) {
      return R.handleError(res, HttpStatus.NOT_FOUND, {
        code: 'lexicon_not_found',
        message: 'Lexicon not found with provided GUID'
      });
    }
    const result = await LexiconService.delete(guid);

    if (result.status !== HttpStatus.SUCCESS) {
      return R.handleError(res, result.status, result.error);
    }
     await existing.delete();
    const response = result.data.data;
    return R.handleSuccess(res, response);
  } catch (error: any) {
    console.log(error.message);
    return R.handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, G.internalError);
  }
});

// GET /:guid - Récupérer un lexique par GUID
router.get('/:guid', async (req: Request, res: Response) => {
  try {
    const guid = req.params.guid;

    if (!guid) {
      return R.handleError(res, HttpStatus.BAD_REQUEST, {
        code: 'missing_guid',
        message: 'GUID parameter is required'
      });
    }

    const lexicon = await Lexicon._load(guid, true);
    if (!lexicon) {
      return R.handleError(res, HttpStatus.NOT_FOUND, {
        code: 'lexicon_not_found',
        message: 'Lexicon not found with provided GUID'
      });
    }

    return R.handleSuccess(res, lexicon.toJSON());
  } catch (error: any) {
    console.log(error.message);
    return R.handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, G.internalError);
  }
});

// PATCH /:guid - Mise à jour partielle d'un lexique
router.patch('/:guid', async (req: Request, res: Response) => {
  try {
    const guid = req.params.guid;
    const updates = req.body;

    if (!guid) {
      return R.handleError(res, HttpStatus.BAD_REQUEST, {
        code: 'missing_guid',
        message: 'GUID parameter is required'
      });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return R.handleError(res, HttpStatus.BAD_REQUEST, {
        code: 'no_updates_provided',
        message: 'At least one field to update is required'
      });
    }

    // Récupération de l'existant
    const existing = await Lexicon._load(guid, true);
    if (!existing) {
      return R.handleError(res, HttpStatus.NOT_FOUND, {
        code: 'lexicon_not_found',
        message: 'Lexicon not found with provided GUID'
      });
    }

    // Mise à jour sélective des champs
    if (updates.translation !== undefined) {
      if (!updates.translation && typeof updates.translation !== 'object') {
        return R.handleError(res, HttpStatus.BAD_REQUEST, {
          code: 'invalid_translation',
          message: 'Translation must be a valid object'
        });
      }
      existing.setTranslation(updates.translation);
    }

    if (updates.reference !== undefined) {
      if (!updates.reference) {
        return R.handleError(res, HttpStatus.BAD_REQUEST, {
          code: 'invalid_reference',
          message: 'Reference cannot be empty'
        });
      }
      existing.setReference(updates.reference);
    }

    if (updates.portable !== undefined) {
      if (typeof updates.portable !== 'boolean') {
        return R.handleError(res, HttpStatus.BAD_REQUEST, {
          code: 'invalid_portable',
          message: 'Portable must be a boolean value'
        });
      }
      existing.setPortable(updates.portable);
    }

    existing.setUpdated(new Date());
    await existing.save();

    return R.handleSuccess(res, existing.toJSON());
  } catch (error: any) {
    console.log(error.message);
    return R.handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, G.internalError);
  }
});




// // GET /:id - Récupérer un lexique par ID
// router.get('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id || isNaN(Number(id))) {
//       return R.handleError(res, HttpStatus.BAD_REQUEST, G.invalidId);
//     }
//
//     const lexique = await Lexicon._load(Number(id));
//     if (!lexique) {
//       return R.handleError(res, HttpStatus.NOT_FOUND, {
//         code: 'lexique_not_found',
//         message: 'Lexicon not found'
//       });
//     }
//
//     return R.handleSuccess(res, lexique.toJSON());
//   } catch (error: any) {
//     console.log(error.message);
//     return R.handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, G.internalError);
//   }
// });
//
// // GET /guid/:guid - Récupérer un lexique par GUID
// router.get('/guid/:guid', async (req, res) => {
//   try {
//     const { guid } = req.params;
//     if (!guid || isNaN(Number(guid))) {
//       return R.handleError(res, HttpStatus.BAD_REQUEST, G.invalidGuid);
//     }
//
//     const lexique = await Lexicon._load(Number(guid), true);
//     if (!lexique) {
//       return R.handleError(res, HttpStatus.NOT_FOUND, {
//         code: 'lexique_not_found',
//         message: 'Lexicon not found'
//       });
//     }
//
//     return R.handleSuccess(res, lexique.toJSON());
//   } catch (error: any) {
//     console.log(error.message);
//     return R.handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, G.internalError);
//   }
// });
//
// // GET /code/:code - Récupérer un lexique par code
// router.get('/code/:code', async (req, res) => {
//   try {
//     const { code } = req.params;
//     if (!code || code.trim() === '') {
//       return R.handleError(res, HttpStatus.BAD_REQUEST, G.invalidCode);
//     }
//
//     const lexique = await Lexicon._load(code, false, true);
//     if (!lexique) {
//       return R.handleError(res, HttpStatus.NOT_FOUND, {
//         code: 'lexique_not_found',
//         message: 'Lexicon not found'
//       });
//     }
//
//     return R.handleSuccess(res, lexique.toJSON());
//   } catch (error: any) {
//     console.log(error.message);
//     return R.handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, G.internalError);
//   }
// });

// // PUT /:id - Modifier un lexique
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id || isNaN(Number(id))) {
//       return R.handleError(res, HttpStatus.BAD_REQUEST, G.invalidId);
//     }
//
//     const lexique = await Lexicon._load(Number(id));
//     if (!lexique) {
//       return R.handleError(res, HttpStatus.NOT_FOUND, {
//         code: 'lexique_not_found',
//         message: 'Lexicon not found'
//       });
//     }
//
//     const { code, name, reference, portable, flag } = req.body;
//
//     if (code !== undefined) lexique.setCode(code);
//     if (name !== undefined) lexique.setName(name);
//     if (reference !== undefined) lexique.setReference(reference);
//     if (portable !== undefined) lexique.setPortable(portable);
//     if (flag !== undefined) lexique.setFlag(flag);
//
//     await lexique.save();
//
//     return R.handleSuccess(res, lexique.toJSON());
//   } catch (error: any) {
//     console.log(error.message);
//     return R.handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, G.internalError);
//   }
// });
//
// // DELETE /:id - Supprimer un lexique
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id || isNaN(Number(id))) {
//       return R.handleError(res, HttpStatus.BAD_REQUEST, G.invalidId);
//     }
//
//     const lexique = await Lexicon._load(Number(id));
//     if (!lexique) {
//       return R.handleError(res, HttpStatus.NOT_FOUND, {
//         code: 'lexique_not_found',
//         message: 'Lexicon not found'
//       });
//     }
//
//     const deleted = await lexique.delete();
//     if (!deleted) {
//       return R.handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, {
//         code: 'delete_failed',
//         message: 'Failed to delete lexique'
//       });
//     }
//
//     return R.handleSuccess(res, {
//       message: 'Lexicon deleted successfully',
//       id: lexique.getId(),
//       name: lexique.getName()
//     });
//   } catch (error: any) {
//     console.log(error.message);
//     return R.handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, G.internalError);
//   }
// });
//
// // GET /search - Recherche avancée
// router.get('/search', async (req, res) => {
//   try {
//     const { q, portable, flag, reference } = req.query;
//     const conditions: Record<string, any> = {};
//
//     if (q && typeof q === 'string') {
//       conditions.name = q;
//     }
//
//     if (portable !== undefined) {
//       conditions.portable = portable === 'true';
//     }
//
//     if (flag && typeof flag === 'string') {
//       conditions.flag = flag;
//     }
//
//     if (reference && typeof reference === 'string') {
//       conditions.reference = reference;
//     }
//
//     const lexiques = await Lexicon._list(conditions);
//     if (!lexiques) {
//       return R.handleError(res, HttpStatus.NOT_FOUND, {
//         code: 'no_results',
//         message: 'No lexiques found matching criteria'
//       });
//     }
//
//     return R.handleSuccess(res, {
//       count: lexiques.length,
//       lexiques: lexiques.map((l) => l.toJSON()),
//       query: req.query
//     });
//   } catch (error: any) {
//     console.log(error.message);
//     return R.handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, G.internalError);
//   }
// });
//
// // GET /portable - Récupérer tous les lexiques portables
// router.get('/portable', async (req, res) => {
//   try {
//     const lexiques = await Lexicon._list({ portable: true });
//     if (!lexiques || lexiques.length === 0) {
//       return R.handleError(res, HttpStatus.NOT_FOUND, {
//         code: 'no_portable_lexiques',
//         message: 'No portable lexiques found'
//       });
//     }
//
//     return R.handleSuccess(res, {
//       count: lexiques.length,
//       lexiques: lexiques.map((l) => l.toJSON())
//     });
//   } catch (error: any) {
//     console.log(error.message);
//     return R.handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, G.internalError);
//   }
// });
//
// // GET /reference/:reference - Recherche par référence
// router.get('/reference/:reference', async (req, res) => {
//   try {
//     const { reference } = req.params;
//     if (!reference || reference.trim() === '') {
//       return R.handleError(res, HttpStatus.BAD_REQUEST, {
//         code: 'invalid_reference',
//         message: 'Reference cannot be empty'
//       });
//     }
//
//     const lexiques = await Lexicon._list({ reference });
//     if (!lexiques || lexiques.length === 0) {
//       return R.handleError(res, HttpStatus.NOT_FOUND, {
//         code: 'no_lexiques_found',
//         message: 'No lexiques found with this reference'
//       });
//     }
//
//     return R.handleSuccess(res, {
//       count: lexiques.length,
//       lexiques: lexiques.map((l) => l.toJSON())
//     });
//   } catch (error: any) {
//     console.log(error.message);
//     return R.handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, G.internalError);
//   }
// });
//
// // GET /flag/:flag - Recherche par flag
// router.get('/flag/:flag', async (req, res) => {
//   try {
//     const { flag } = req.params;
//     if (!flag || flag.trim() === '') {
//       return R.handleError(res, HttpStatus.BAD_REQUEST, {
//         code: 'invalid_flag',
//         message: 'Flag cannot be empty'
//       });
//     }
//
//     const lexiques = await Lexicon._list({ flag });
//     if (!lexiques || lexiques.length === 0) {
//       return R.handleError(res, HttpStatus.NOT_FOUND, {
//         code: 'no_lexiques_found',
//         message: 'No lexiques found with this flag'
//       });
//     }
//
//     return R.handleSuccess(res, {
//       count: lexiques.length,
//       lexiques: lexiques.map((l) => l.toJSON())
//     });
//   } catch (error: any) {
//     console.log(error.message);
//     return R.handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, G.internalError);
//   }
// });

export default router;