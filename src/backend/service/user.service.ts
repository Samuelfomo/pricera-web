import api from '../tools/api';

export default class UserService {
  static async sendEmail(email: string): Promise<any> {
    try {
      return await api.post('/user/login', {
        email: email,
      });
    } catch (error: any) {
      if (error.response) {
        // Rejeter avec les infos complètes de l'erreur
        return {
          status: error.response.status,
          data: error.response.data,
        };
      }
      // Si l'erreur ne vient pas d'Axios ou pas de réponse
      return {
        status: 500,
        data: { error: error.message },
      };
    }
  }

  static async sendOtp(otp: number): Promise<any> {
    try {
      return await api.patch('/user/verify-otp', {
        otp: otp,
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}