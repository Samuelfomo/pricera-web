import api from '../tools/api';

export class SectorService {

  static async getAll(): Promise<any[] | null> {
    try {
      console.log('Appel API externe vers /sector/list');

      const response = await api.get('/sector/list');
      console.log('Réponse API:', response.status, response.data);

      return response.data.data.sectors.items;
    } catch (error: any) {
      throw new Error(error.message);

    }

      // return null;
  }

  static async save(data: any): Promise<any> {
    try {
      return await api.post('/sector', {
        name: data.name,
        description: data.description,
        active: data.active,
      });
    } catch (error: any) {
      if (error.response) {
        return {
          status: error.response.status,
          message: error.response.message,
        };
      }
    }
  }

}


