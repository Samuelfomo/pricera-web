import Universe from '@/frontend/service/universe.service.ts';

export const fetchUniverseData = async ()  => {
    try {
      const universeEntries = await Universe.getAll();
      // ... transformation des données
      console.log(universeEntries);
      return universeEntries.map((entry: any) => ({
        id: entry.guid,
        name: entry.name,
        description: entry.description,
        sector: entry.sector.map((entry: any) => entry.name),
        // sector: entry.sector,
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      throw error;
    }

};

