import { Router, Request, Response } from 'express';
import R from '../tools/response';
import HttpStatus from '../tools/https-status';
import G from '../tools/glossary';
import UserService from '../service/user.service';
// import User from '../class/User';
// import Profile from '../class/Profile';

const router = Router();

router.post('/email', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return R.handleError(res, HttpStatus.BAD_REQUEST, G.missingRequired);
    }

    const result: any = await UserService.sendEmail(email);
    // console.log("result.data," ,result.data.error, "result", result.data);
    if (result.status !==HttpStatus.NO_CONTENT) {
      // console.log("result", result.status, result.data.error);
    return R.handleError(res, result.status, result.data.error);
    }
    return R.handleSuccess(res, {message: 'Mail sent successfully'});
  } catch (error: any) {
    console.error(error);
    return R.handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, { message: error.message, error: error.code });
  }
});

// router.patch('/otp', async (req: Request, res: Response) => {
//   try {
//     const { otp} = req.body;
//     if (!otp) {
//       return R.handleError(res, HttpStatus.BAD_REQUEST, G.missingRequired);
//     }
//     const result = await UserService.sendOtp(otp);
//     if (result.status !==HttpStatus.SUCCESS) {
//       return R.handleError(res, result.status, result.data.error);
//     }
//     const data = result.data.response;
//     // return R.handleSuccess(res, result.data.response);
//     const verify = await User._load(data.guid, true);
//     if (!verify) {
//       let account = null;
//       if (data.account) {
//         account = await Account._load(data.account.guid, true);
//       }
//       const profile = await Profile._load(data.profile.guid, true);
//       if (!profile) {
//         return R.handleError(res, HttpStatus.NOT_FOUND, result.data.error);
//       }
//       const user = new User().setGuid(data.guid).setEmail(data.email).setProfile(profile.getId()!).setToken(data.token);
//       if (account) user.setAccount(account.getId());
//       if (data.createdBy) {
//         const createdBy = await User._load(data.createdBy, true);
//         if (createdBy) user.setCreateBy(createdBy.getId()!);
//       }
//       await user.save();
//       return R.handleSuccess(res, user.toJSON());
//     }
//     return R.handleSuccess(res, verify.toJSON());
//   } catch (error: any) {
//     return R.handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, {
//       message: error.message
//     });
//   }
// })


export default router;