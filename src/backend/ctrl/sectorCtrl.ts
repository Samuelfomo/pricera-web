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
    console.log('Début de la route GET /list');

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

export default router;