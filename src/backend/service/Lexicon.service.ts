import api from '../tools/api.ts';
export default class LexiconService {
  static async getAll(): Promise<any[] | null> {
    try {
      const response = await api.get('lexicon/list');
      if (response.status !== 200) {
        return null;
      }
      return response.data.data.lexicons.items;
    } catch (error : any){
      throw new Error(error.message);
    }
  }
  static async save(data: any): Promise<any> {
    try {
      return await api.post('lexicon', {
        reference: data.reference,
        translation: data.translation,
        portable: data.portable,
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
  static async saveTranslation(data: any): Promise<any> {
    try {
      return await api.patch(`lexicon/${data.guid}/translations`, data.translation)
    }
    catch (error : any){
      if (error.response) {
        return {
          status: error.response.status || 500,
          error: error.response.data.error || error.message,
        };
      }
  }
  }
  static async update(guid: number, data: any): Promise<any | null> {
    try {
      const response = await api.put(`lexicon/${guid}`,{
        reference: data.reference,
        translation: data.translation,
        portable: data.portable,
      });
      if (response.status !== 200) {
        return null;
      }
      return response.data.data;
    } catch (error : any){
      throw new Error(error.message);
    }
  }

  static async delete(guid: number): Promise<any | null> {
    try {
      return await api.delete(`lexicon/${guid}`);
    } catch (error : any){
      return {
        status: error.response.status || 500,
        error: error.response.data.error || error.message,
      };
    }
  }

}
