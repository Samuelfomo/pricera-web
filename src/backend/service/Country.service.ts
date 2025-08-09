import api from '../tools/api.ts';

export class CountryService {

  static async getAll(): Promise<any[] | null> {
    try {
      const response = await api.get('country');
      if (response.status !== 200) {
        return null;
      }
      return response.data.response.entries;
    } catch (error : any){
      throw new Error(error.message);
    }
  }
}