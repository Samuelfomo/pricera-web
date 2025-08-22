import { Router, Request, Response } from 'express';

import Sector from '../class/Sector';
import R from '../tools/response';
import HttpStatus from '../tools/https-status';
import G from '../tools/glossary';
import { SectorService } from '../service/sector.service';
const router = Router();

// region ROUTES D'EXPORT

/**
 * GET /list - Exporter tous les secteurs
 */
router.get('/list', async (_req: Request, res: Response) => {
  try {

    const sectors = await Sector._list();
    console.log('Secteurs trouvés en DB:', sectors?.length || 0);

    if (!sectors || sectors.length === 0) {
      console.log('Aucun secteur en DB, appel API externe');

      const result = await SectorService.getAll();
      console.log('Résultat API externe:', result?.length || 0);

      if (!result || result.length === 0) {
        console.log('Aucun résultat de l\'API externe - possible erreur d\'authentification');
        return R.handleError(res, HttpStatus.SERVICE_UNAVAILABLE, {
          code: 'external_api_unavailable',
          message: 'External API unavailable or authentication failed'
        });
      }

      console.log('Suppression des secteurs existants');
      const drop = await Sector._deleteAll();
      if (!drop) {
        console.log('Échec de la suppression');
        return R.handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, {
          code: 'delete_failed',
          message: 'Failed to delete sectors'
        });
      }

      console.log('Sauvegarde des nouveaux secteurs');
      const saved = await Promise.all(result.map(async (entry) => {
        const instance = new Sector()
          .setGuid(entry.guid)
          .setName(entry.name)
          .setDescription(entry.description)
          .setActive(true);
        await instance.save();
        return instance;
      }));

      console.log('Secteurs sauvegardés:', saved.length);
      return R.handleSuccess(res, await Promise.all(saved.map(entry => entry.toJSON())));
    }

    console.log('Retour des secteurs existants');
    return R.handleSuccess(res, {
      count: sectors.length,
      sectors: sectors.map((l) => l.toJSON())
    });

  } catch (error: any) {
    console.error('Erreur dans la route:', error.message);
    console.error('Stack trace complète:', error.stack);
    return R.handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, G.internalError);
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, actif } = req.body;
    if (!name) {
      return R.handleError(res, HttpStatus.BAD_REQUEST, {
        code: 'name_required',
        message: 'Sector name is required',
      });
    }
    if (!description) {
      return R.handleError(res, HttpStatus.BAD_REQUEST, {
        code: 'description_required',
        message: 'Sector description is required',
      });
    }
    const result = await SectorService.save(req.body);
    if (!result) {
      return R.handleError(res, HttpStatus.BAD_REQUEST, {})
    }
    const response = result.data.data;
    const sector = new Sector().setName(name).setDescription(description).setActive(true).setGuid(response.guid);

    if (name) sector.setName(name);
    if (description) sector.setDescription(description);
    if (actif) sector.setActive(actif);

    await sector.save();
    console.log(`Secteur cree: ${name} - ${description} (GUID: ${sector.getGuid()}`);
    R.handleSuccess(res, sector.toJSON());
  } catch (error: any) {
    console.log('Erreur lors de la creation de sector', error.message);
    if (error.message.includes('already exists')) {
      R.handleError(res, HttpStatus.CONFLICT, {
        code: 'sector_already_exists',
        message: error.message,
      });
    } else if (error.message.includes('name')) {
      R.handleError(res, HttpStatus.BAD_REQUEST, {
        code: 'invalid_name',
        message: error.message,
      });

    }
  }
})

router.put('/:guid', async (req: Request, res: Response) => {
  try {
    // ✅ Validation manuelle du GUID
    if (!/^\d+$/.test(req.params.guid)) {
      return R.handleError(res, HttpStatus.BAD_REQUEST, {
        code: 'invalid_guid',
        message: 'GUID must be a positive integer',
      });
    }
    const guid = parseInt(req.params.guid);

    const sector = await Sector._load(guid, true);
    if (!sector) {
      return R.handleError(res, HttpStatus.NOT_FOUND, {
        code: 'sector_not_exists',
        message: 'Sector does not exist',
      })
    }
    const {name, description} = req.body;

    if (name !== undefined) sector.setName(name);
    if (description !== undefined) sector.setDescription(description);
    // if (active !== undefined) sector.setActive(active)

    await sector.save();
    console.log(`pays modifier: GUID ${guid} `);
    R.handleSuccess(res, sector.toJSON());
  } catch (error: any) {
    console.error('Erreur lors de modification de sector', error);

    if (error.message.includes('already exists')) {
      R.handleError(res, HttpStatus.CONFLICT, {
        code: 'sector_already_exists',
        message: error.message,
      });
    } else if (error.message.includes('name')) {
      R.handleError(res, HttpStatus.BAD_REQUEST, {
        code: 'invalid_name',
        message: error.message,
      })
    } else {
      R.handleError(res, HttpStatus.BAD_REQUEST, {
        code: 'update_failed',
        message: error.message,
      })
    }
  }
})

export default router;