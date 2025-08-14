import api from '../tools/api';

export class CountryService {

  static async getAll(): Promise<any[] | null> {
    try {
      const response = await api.get('/country/list');
      if (response.status !== 200) {
        return null;
      }
      return response.data.data.countries.items;
    } catch (error : any){
      throw new Error(error.message);
    }
  }

  static async save(data: any): Promise<any> {
    try {
      return await api.post('/country', {
        name: data.name,
        code: data.code,
        iso: data.iso,
        timezone: data.timezone,
        // mobileRegex: data.mobileRegex,
        flag: data.flag,
      });

    } catch (error: any) {
      if (error.response) {
        // Rejeter avec les infos complètes de l'erreur
        return {
          status: error.response.status,
          error: error.response.data.error,
        };
      }
      // Si l'erreur ne vient pas d'Axios ou pas de réponse
      return {
        status: 500,
        error: { error: error.message },
      };
    }
  }

}