export default class SectorService {

  static async getAll(){
    try {
      // const response = await fetch('sector/list/')
      const response = await fetch(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/sector/list/`, {
        method: "GET"
      });

      const data = await response.json();
      return data.response.sectors;
    } catch (error){
      throw error;
    }
  }

  static async save(sector: any) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/sector`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: sector.name, description: sector.description, active: sector.active
        })
      })
      console.log(response)
      return {
        status: response.status,
        response: await response.json(),
      };
    } catch (error: any){
      console.log("Erreur lors de l'enregistrement du secteur :", error);
      return {
        response: error.message,
        status: 500,
      };
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