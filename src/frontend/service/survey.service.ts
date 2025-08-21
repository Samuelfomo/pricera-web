export default class SurveyService {
  static async getAll() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/survey/list`,
        { method: "GET" }
      );

      const data = await response.json();

      if (data.status && data.response?.surveys) {
        return data.response.surveys; // <-- le tableau de 130 surveys
      } else {
        console.error("Structure inattendue:", data);
        return [];
      }
    } catch (error) {
      console.error("Erreur dans SurveyService.getAll:", error);
      throw error;
    }
  }
}
