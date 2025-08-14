// import { Router, Request, Response } from 'express';
//
// import Sector from '../class/Sector';
// import R from '../tools/response';
// import HttpStatus from '../tools/https-status';
// import G from '../tools/glossary';
// import { CountryService } from '../service/Country.service';
// const router = Router();
//
// // region ROUTES D'EXPORT
//
// /**
//  * GET / - Exporter tous les pays
//  */
// router.get('/', async (_req: Request, res: Response) => {
//   try {
//     const countries = await Sector._list();
//     if (!countries || countries.length === 0) {
//
//       const result = await CountryService.getAll();
//       if (!result || result.length === 0) {
//         console.log('entry');
//         return R.handleError(res, HttpStatus.NOT_FOUND, {
//           code: 'no_country_found',
//           message: 'No country found'
//         });
//       }
//
//       const drop = await Sector._deleteAll();
//       if (!drop) {
//         return R.handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, {
//           code: 'delete_failed',
//           message: 'Failed to delete country'
//         });
//       }
//       // return R.handleSuccess(res, ['deleted successfully', 'saved successfully']);
//       const saved = await Promise.all(result.map(async (entry) => {
//         const instance = new Sector()
//           .setGuid(entry.code)
//           .setCode(entry.code)
//           .setIso(entry.key)
//           .setName(entry.name)
//           .setFlag(entry.flag)
//           .setTimezone(entry.timezone)
//           .setMobileRegex(entry.mobileRegex)
//         // .setUpdated(entry.updatedAt)
//         await instance.save();
//         return instance;
//       }))
//       return R.handleSuccess(res, await Promise.all(saved.map(entry => entry.toJSON())));
//     }
//
//     return R.handleSuccess(res, {
//       count: countries.length,
//       countries: countries.map((l) => l.toJSON())
//     });
//   } catch (error: any) {
//     console.log(error.message);
//     return R.handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, G.internalError);
//   }
// });
//
// export default router;