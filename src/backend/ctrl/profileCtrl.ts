import { Router } from 'express';
import Profile from '../class/Profile';
import HttpStatus from '../tools/https-status';
import R from '../tools/response';
import G from '../tools/glossary';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const {email} = req.body;
    if (!email) {
      return R.handleError(res, HttpStatus.BAD_REQUEST, G.missingRequired);
    }
    const result = await Profile._load(100001, true);
    if(!result) {
      return R.handleError(res, HttpStatus.BAD_REQUEST, {code: 'entry_are_empty', message: 'not entry found'})
    }
    return R.handleSuccess(res, result);
  } catch (error: any) {
    console.log(error.message);
    return R.handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, G.missingRequired);
  }
});





export default router;