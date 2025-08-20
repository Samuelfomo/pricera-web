import api from '../tools/api';

export class ProductService {
  static async getAll(): Promise<any[] | null> {
    try {
      console.log('Appel API externe vers /product');

      const response = await api.get('/product');
      console.log('Réponse API:', response.status, response.data);

      return response.data.data.products.items

    } catch (error: any) {
      console.error('Erreur dans ProductService.getAll():', error.message);
      console.error('Status code:', error.response?.status);
    }
    return null;
  }

}