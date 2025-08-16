import { Router } from 'express';
import type { Request, Response } from 'express';
import { SurveyService } from '../service/survey.service';
import R from '../tools/response';
import HttpStatus from '../tools/https-status';
import G from '../tools/glossary';

const router = Router();

router.get('/list', async (_req: Request, res: Response) => {
  try {
    console.log('Début de la route GET /list (API directe, pas de DB)');

    // Appel direct de l’API externe
    const result = await SurveyService.getAll();
    console.log('Résultat API externe:', result?.length || 0);

    if (!result || result.length === 0) {
      console.log("Aucun résultat de l'API externe - possible erreur d'authentification");
      return R.handleError(res, HttpStatus.SERVICE_UNAVAILABLE, {
        code: 'external_api_unavailable',
        message: 'External API unavailable or authentication failed',
      });
    }

    // Retour direct du résultat de l’API
    return R.handleSuccess(res, {
      count: result.length,
      surveys: result,
    });
  } catch (error: any) {
    console.error('Erreur dans la route:', error.message);
    console.error('Stack trace complète:', error.stack);
    return R.handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, G.internalError);
  }
});

export default router;
