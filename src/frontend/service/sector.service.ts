export default class SectorService {
  static async getAll(): Promise<any[] | null> {
    try {
      // const response = await fetch('sector/list/')
      const response = await fetch(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/sector/list/`, {
        method: "GET"
      });
      if (response.status !== 200) {
        return null;
      }
      return response.json();
    } catch (error : any){
      throw new Error(error.message);
    }
  }
  // static async save(data: any): Promise<any> {
  //   try {
  //     return await api.post('lexicon', {
  //       reference: data.reference,
  //       translation: data.translation,
  //       portable: data.portable,
  //     });
  //
  //   } catch (error: any) {
  //     if (error.response) {
  //       // Rejeter avec les infos complètes de l'erreur
  //       return {
  //         status: error.response.status,
  //         error: error.response.data.error,
  //       };
  //     }
  //     // Si l'erreur ne vient pas d'Axios ou pas de réponse
  //     return {
  //       status: 500,
  //       error: { error: error.message },
  //     };
  //   }
  // }
}