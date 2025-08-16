import { Request, Response, Router } from 'express';
import R from '../tools/response';
import HttpStatus from '../tools/https-status';
import G from '../tools/glossary';
import { UniverseService } from '../service/universe.service';
import Universe from '../class/universe';
const router = Router();

// region ROUTES D'EXPORT

/**
 * GET / - Exporter tous les pays
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const universes = await Universe._list();
    console.log(universes);
    if (!universes || universes.length === 0) {

      const result = await UniverseService.getAll();
      if (!result || result.length === 0) {
        return R.handleError(res, HttpStatus.NOT_FOUND, {
          code: 'no_universe_found',
          message: 'No universe found'
        });
      }

      const drop = await Universe._deleteAll();
      if (!drop) {
        return R.handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, {
          code: 'delete_failed',
          message: 'Failed to delete universe'
        });
      }
      // return R.handleSuccess(res, ['deleted successfully', 'saved successfully']);
      const saved = await Promise.all(result.map(async (entry) => {
        const instance = new Universe()
          .setGuid(entry.guid)
          .setName(entry.name)
          // .setSector(entry.sector)
          .setDescription(entry.description)

        // .setUpdated(entry.updatedAt)
        await instance.save();
        return instance;
      }))
      return R.handleSuccess(res, await Promise.all(saved.map(entry => entry.toJSON())));
    }

    return R.handleSuccess(res, {
      count: universes.length,
      universes: universes.map((l) => l.toJSON())
    });
  } catch (error: any) {
    console.log(error.message);
    return R.handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, G.internalError);
  }
});

export default router;