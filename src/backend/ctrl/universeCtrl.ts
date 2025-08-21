import { Request, Response, Router } from 'express';
import R from '../tools/response';
import HttpStatus from '../tools/https-status';
import G from '../tools/glossary';
import { UniverseService } from '../service/universe.service';
import Universe from '../class/Universe';
import Sector from '../class/Sector';
const router = Router();

// region ROUTES D'EXPORT

/**
 * GET / - Exporter tous les pays
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const universes = await Universe._list();
    if (!universes || universes.length === 0) {

      const result = await UniverseService.getAll();
      if (!result || result.length === 0) {
        return R.handleError(res, HttpStatus.NOT_FOUND, {
          code: 'no_universe_found',
          message: 'No universe found'
        });
      }

      console.log('result.length');

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
          .setDescription(entry.description)
        if (Array.isArray(entry.sectors.items)) {
          let sectorIds: any[] = [];
          await Promise.all(entry.sectors.items.map(async (sect: number) => {
            const sectorData = await Sector._load(sect, true);
            if (sectorData) {
             sectorIds.push(sectorData.getId());
            }
          }))
          instance.setSector(sectorIds);
        }

        // .setUpdated(entry.updatedAt)
        await instance.save();
        return instance;
      }))
      console.log("saved", saved);
      return R.handleSuccess(res, await Promise.all(saved.map(async entry => await entry.toJSON())));
    }
    return R.handleSuccess(res, {
      count: universes.length,
      universes: await Promise.all(universes.map(async (l) => await l.toJSON()))
    });
  } catch (error: any) {
    console.log(error.message);
    return R.handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, G.internalError);
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, sector } = req.body;
    if (!name) {
      return R.handleError(res, HttpStatus.BAD_REQUEST, {
        code: 'name_required',
        message: 'Universe name is required',
      });
    }
    if (!sector) {
      return R.handleError(res, HttpStatus.BAD_REQUEST, {
        code: 'sectors_required',
        message: 'Universe sectors is required',
      });
    }
    const data = { name, description, sector };
    console.log(data);
    // if (!description) {
    //   return R.handleError(res, HttpStatus.BAD_REQUEST, {
    //     code: 'description_required',
    //     message: 'Universe description is required',
    //   });
    // }
    const result = await UniverseService.save(data);

// Vérifier que l'API a répondu correctement
    if (result.status !== HttpStatus.CREATED) {
      console.log(result);
      return R.handleError(res, HttpStatus.BAD_REQUEST, {
        code: 'universe_creation_failed',
        message: 'Failed to create universe',
      });
    }

    const response = result.data.data;

    console.log(response);

    const universe = new Universe()
      .setName(response.name)
      .setDescription(response.description)
      .setSector(response.sector)
      .setGuid(response.guid);

    await universe.save();

    console.log(`univers cree: ${universe.getName()} - ${universe.getDescription()} (GUID: ${universe.getGuid()})`);

    R.handleSuccess(res, universe.toJSON());

  } catch (error: any) {
    console.log('Erreur lors de la creation de univers', error.message);
    if (error.message.includes('already exists')) {
      R.handleError(res, HttpStatus.CONFLICT, {
        code: 'univers_already_exists',
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


export default router;