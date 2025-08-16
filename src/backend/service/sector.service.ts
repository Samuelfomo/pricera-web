import api from '../tools/api';

export class SectorService {

  static async getAll(): Promise<any[] | null> {
    try {
      console.log('Appel API externe vers /sector/list');

      const response = await api.get('/sector/list');
      console.log('Réponse API:', response.status, response.data);

      return response.data.data.sectors.items;
    } catch (error: any) {
      console.error('Erreur dans SectorService.getAll():', error.message);
      console.error('Status code:', error.response?.status);

      // // Si l'API externe échoue (401, etc.), retourner des données de test
      // if (error.response?.status === 401) {
      //   console.log('Erreur 401 - Retour de données de test');
      //   return [
      //     {
      //       code: 1,
      //       name: "Technologie",
      //       description: "Secteur technologique",
      //       active: true
      //     },
      //     {
      //       code: 2,
      //       name: "Santé",
      //       description: "Secteur de la santé",
      //       active: true
      //     },
      //     {
      //       code: 3,
      //       name: "Finance",
      //       description: "Secteur financier",
      //       active: true
      //     }
      //   ];
      }

      return null;
    }
  }
