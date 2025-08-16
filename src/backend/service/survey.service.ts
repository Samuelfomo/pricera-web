import api from '../tools/api';

export class SurveyService {
  static async getAll(): Promise<any[] | null> {
    try {
      console.log('Appel API externe vers /survey');

      const response = await api.get('/survey');
      console.log('Réponse API:', response.status, response.data);

      return response.data.data.surveys.items

    } catch (error: any) {
      console.error('Erreur dans SurveyService.getAll():', error.message);
      console.error('Status code:', error.response?.status);
    }
    return null;
  }

}