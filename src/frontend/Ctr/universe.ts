import Universe from '@/frontend/service/universe.service.ts';

export const fetchUniverseData = async ()  => {
    try {
      const result = await Universe.getAll();
      const universeEntries = result;
      // ... transformation des données
      console.log(universeEntries);
      return universeEntries.map((entry: any) => ({
        id: entry.guid,
        name: entry.name,
        description: entry.description,
        sector: entry.sector,
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      throw error;
    }

};

