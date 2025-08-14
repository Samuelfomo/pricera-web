  import Country from '../service/country.service';

export const fetchCountriesData = async (): Promise<any[]> => {
  try {
    const result = await Country.getAll();
    const countryEntries = result;
    // ... transformation des données
    console.log(countryEntries);
    return countryEntries.map((entry: any) => ({
      id: entry.guid,
      name: entry.name,
      code: entry.code,
      flag: entry.flag,
      iso: entry.iso,
      timezone: entry.timezone,
      mobileRegex: entry.mobileRegex,
    }));
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    throw error;
  }
};