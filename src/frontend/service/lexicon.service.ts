export default class Lexicon {

  static async getAll(): Promise<any[]> {
    console.log(`Aucune : ${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}`);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/lexicon`, {
        method: "GET"
      });

      if (!response.ok) {
        throw new Error('Not Found');
      }

      const apiData = await response.json();
      console.log('Données brutes de l\'API:', apiData);

      // 🔧 CORRECTION: Transformer les données ici pour qu'elles soient prêtes à l'emploi
      let lexiconEntries;

      // Extraire les données selon la structure de l'API
      if (apiData.status && apiData.response && apiData.response.lexicons) {
        lexiconEntries = apiData.response.lexicons;
      } else if (Array.isArray(apiData)) {
        lexiconEntries = apiData;
      } else {
        console.warn('Structure de données API inattendue:', apiData);
        return [];
      }

      // Transformer chaque entrée au format attendu par l'application
      const transformedData = lexiconEntries.map((entry: any) => {
        let parsedTranslations: Array<{langue: string, texte: string}> = [];

        // Parser le JSON string des traductions
        if (entry.translation && typeof entry.translation === 'string') {
          try {
            const translationObj = JSON.parse(entry.translation);
            // Convertir {fr: "texte", en: "text"} en [{langue: "fr", texte: "texte"}, ...]
            parsedTranslations = Object.entries(translationObj).map(([langue, texte]) => ({
              langue,
              texte: texte as string
            }));
          } catch (parseError) {
            console.error('Erreur parsing translation JSON pour:', entry.reference, parseError);
            parsedTranslations = [];
          }
        } else if (Array.isArray(entry.translation)) {
          // Si c'est déjà un tableau (cas de développement local)
          parsedTranslations = entry.translation;
        }

        return {
          guid: entry.guid,
          reference: entry.reference,
          translation: parsedTranslations,
          portable: entry.portable
        };
      });

      console.log('Données transformées dans Lexicon.getAll():', transformedData);
      return transformedData;

    } catch (error) {
      console.log('Erreur dans Lexicon.getAll:', error);
      throw error;
    }
  };
  static async save(lexicon: any) {
    console.log({
      translation: lexicon.translation, reference: lexicon.reference, portable: lexicon.portable
    })
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/lexicon`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          translation: lexicon.translation, reference: lexicon.reference, portable: lexicon.portable
        })
      })
      console.log(response)
      return {
        status: response.status,
        response: await response.json(),
      };
    } catch (error: any){
      console.log("Erreur lors de l'enregistrement du lexique :", error);
      return {
        response: error.message,
        status: 500,
      };
    }
  }

  static async update(lexicon: any) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/lexicon/${lexicon.guid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          translation: lexicon.translation, reference: lexicon.reference, portable: lexicon.portable
        })
      })
      return {
        status: response.status,
        response: await response.json()
      };
    } catch (error: any){
      console.log("Erreur lors de l'enregistrement du lexique :", error);
      return {
        response: error.message || error,
        status: 500
      };
    }
  }

  static async saveTranslation(lexicon: any) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/lexicon/${lexicon.guid}/translations`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          translation: lexicon.translation
        })
      })
      return {
        status: response.status,
        response: await response.json()
      };
    } catch (error: any){
      return {
        error: error.message || error,
        status: 500
      };
    }
  }
  static async delete(guid: number) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/lexicon/${guid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
      })
      return {
        status: response.status,
        response: await response.json()
      };
    } catch (error: any){
      console.log("Erreur lors de la suppression du lexique :", error);
      return {
        error: error.message || error,
        status: 500
      };
    }
  }
  static async load(guid: number) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/lexicon/${guid}`, {
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
};