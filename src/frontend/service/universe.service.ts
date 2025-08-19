export default class UniverseService {

  static async getAll() {
    console.log(`URL appelée : ${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}`);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/universe`, {
        method: "GET"
      });

      // Vérifie que la réponse est bien JSON
      if (!response.ok) {
        throw new Error(`Erreur API : ${response.status}`);
      }

      const data = await response.json();
      console.log('Données de l\'API :', data.response.universes);

      return data.response.universes;
    } catch (error) {
      console.log('Erreur dans UniverseEntry.getAll:', error);
      throw error;
    }
  }

  static async save(universe: any) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/universe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: universe.name, description: universe.description, sector: universe.sector
        })
      })
      console.log(response)
      return {
        status: response.status,
        response: await response.json(),
      };
    } catch (error: any){
      console.log("Erreur lors de l'enregistrement du univers :", error);
      return {
        response: error.message,
        status: 500,
      };
    }
  }

}