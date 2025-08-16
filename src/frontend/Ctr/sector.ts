import Sector from '@/frontend/service/sector.service.ts';

export const fetchSectorsData = async ()=> {
  try {
    // if (!result || result.length === 0) {
    //   console.error("No sectors found.");
    //   return [];
    // }
    const sectorEntries = await Sector.getAll();
    // ... transformation des données
    console.log(sectorEntries);
    return sectorEntries?.map((entry: any) => ({
      id: entry.guid,
      name: entry.name,
      active: entry.active,
      description: entry.description,
    }));
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    throw error;
  }
};