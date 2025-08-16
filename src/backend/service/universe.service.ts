import api from '../tools/api';

export class UniverseService {
  static async getAll(): Promise<any[] | null> {
    try {
      const response = await api.get('/universe');

      return response.data.data.universes.items;
    } catch (error : any){
      throw new Error(error.message);
    }
  }

  static async save(data: any): Promise<any> {
    try {
      return await api.post('/universe', {
        name: data.name,
        description: data.description,
        sector: data.sector,

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