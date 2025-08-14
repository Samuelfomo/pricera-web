import Lexicon from "../service/lexicon.service.ts"

export const fetchData = async (): Promise<any[]> => {
  try {
    const lexiconEntries = await Lexicon.getAll();

    if (!lexiconEntries || lexiconEntries.length === 0) {
      console.log('Aucune entrée trouvée');
      return [];
    }

    // 🎉 Plus besoin de transformation complexe, les données sont déjà prêtes !
    return lexiconEntries.map((entry: any) => ({
      id: entry.guid,
      reference: entry.reference,
      translation: entry.translation || [],
      portable: entry.portable,
    }));

  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    throw error;
  }
};