
export default class Country {

  static async getAll() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/country`, {
        method: "GET"
      });

      const data = await response.json();


      return data.response.countries;
    } catch (error) {
      console.log('Erreur dans CountryEntry.getAll:', error);
      throw error;
    }
  }

  static async save(country: any) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/country`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: country.name, code: country.code, iso: country.iso, timezone: country.timezone, mobileRegex: country.mobileRegex, flag: country.flag
        })
      })
      console.log(response)
      return {
        status: response.status,
        response: await response.json(),
      };
    } catch (error: any){
      console.log("Erreur lors de l'enregistrement du pays :", error);
      return {
        response: error.message,
        status: 500,
      };
    }
  }

  static async load(guid: number) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/country/list/${guid}`, {
        method: "GET",
      })
      return {
        status: response.status,
        response: await response.json()
      };
    }
    catch (error: any){
      return {
        response: error.message || error,
        status: 500
      };
    }
  }

}