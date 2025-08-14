import CountryModel from '../model/CountryModel';

export default class Country extends CountryModel {
  constructor() {
    super();
  }
  setGuid(guid: number) :Country{
    this.guid = guid;
    return this;
  }
  setCode(code: number): Country {
    this.code = code;
    return this;
  }

  setIso(iso: string): Country {
    this.iso = iso;
    return this;
  }
  setName(name: string): Country {
    this.name = name;
    return this;
  }
  setTimezone(timezone: string): Country {
    this.timezone = timezone;
    return this;
  }
  setMobileRegex(mobileRegex: string): Country {
    this.mobileRegex = mobileRegex;
    return this;
  }
  setFlag(flag: string): Country {
    this.flag = flag;
    return this;
  }
  // setUpdated(updated: Date): SectorEntry {
  //   this.updated = updated;
  //   return this;
  // }


  getId(): number | undefined {
    return this.id;
  }
  getGuid(): number | undefined {
    return this.guid;
  }
  getCode(): number | undefined {
    return this.code;
  }
  getIso(): string | undefined {
    return this.iso;
  }
  getName(): string | undefined {
    return this.name;
  }
  getTimezone():string | undefined {
    return this.timezone;
}
  getMobileRegex():string | undefined {
    return this.mobileRegex;
  }
  getFlag(): string | undefined {
    return this.flag;
  }

  /**
   * Obtient le nom complet avec l'émoji du drapeau
   */
  getDisplayName(): string {
    const name = this.name || 'Unknown SectorEntry';
    const flag = this.flag ? ` ${this.flag}` : '';
    return `${name}${flag}`;
  }

  /**
   * Obtient l'identifiant sous forme de chaîne (ISO ou code)
   */
  getIdentifier(): string {
    return this.iso || this.code?.toString() || 'Unknown';
  }

  // region Méthodes privées

  /**
   * Hydrate l'instance avec les données
   */
  private hydrate(data: any): Country {
    this.id = data.id;
    this.guid = data.guid;
    this.code = data.code;
    this.iso = data.iso;
    this.name = data.name;
    this.timezone = data.timezone;
    this.mobileRegex = data.mobileRegex;
    this.flag = data.flag;
    return this;
  }

  /**
   * Asynchronously retrieves the revision string based on the last modification time.
   * If the last modification time is unavailable, a default revision value of '202501010000' is returned.
   *
   * @return {Promise<string>} The revision string in the format 'YYYYMMDDHHmm'.
   */
  private async getRevision(): Promise<string> {
    const lastModified = await this.getLastModification();
    if (!lastModified) return '202501010000';

    const year = lastModified.getFullYear();
    const month = String(lastModified.getMonth() + 1).padStart(2, '0');
    const day = String(lastModified.getDate()).padStart(2, '0');
    const hours = String(lastModified.getHours()).padStart(2, '0');
    const minutes = String(lastModified.getMinutes()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}`;
  }


  // endregion

  /**
   * Sauvegarde le pays (création ou mise à jour)
   */
  async save(): Promise<void> {
    try {
      if (this.isNew()) {
        await this.create();
      } else {
        await this.update();
      }
    } catch (error: any) {
      console.error('❌ Erreur sauvegarde pays:', error.message);
      throw new Error(error);
    }
  }

  // /**
  //  * Supprime le pays
  //  */
  // async delete(): Promise<boolean> {
  //   if (this.guid !== undefined) {
  //     await W.isOccur(!this.guid, `${G.identifierMissing.code}: SectorEntry Delete`);
  //     return await this.trash(this.guid);
  //   }
  //   return false;
  // }

  /**
   * Loads a SectorEntry object based on the provided identifier and search method.
   *
   * @param {any} identifier - The identifier used to find the SectorEntry object.
   *                           Can be a GUID, a code, an ISO, or an ID number.
   * @param {boolean} [byGuid=false] - Specifies if the lookup should be performed by GUID.
   * @param {boolean} [byCode=false] - Specifies if the lookup should be performed by code.
   * @param {boolean} [byIso=false] - Specifies if the lookup should be performed by ISO.
   * @return {Promise<Country | null>} A promise that resolves to the located SectorEntry object, or null if not found.
   */
  async load(
    identifier: any,
    byGuid: boolean = false,
    byCode: boolean = false,
    byIso: boolean = false
  ): Promise<Country | null> {
    const data = byGuid
      ? await this.findByGuid(identifier)
      : byCode
        ? await this.findByCode(identifier)
        : byIso
          ? await this.findByIso(identifier)
          : await this.find(Number(identifier));

    if (!data) return null;
    return this.hydrate(data);
  }

  /**
   * Liste les pays selon les conditions
   */
  async list(conditions: Record<string, any> = {}): Promise<Country[] | null> {
    const dataset = await this.listAll(conditions);
    if (!dataset) return null;
    return dataset.map((data) => new Country().hydrate(data));
  }

  /**
   * Liste les pays par fuseau horaire
   */
  async listByTimezone(timezone: string): Promise<Country[] | null> {
    const dataset = await this.listAllByTimezone(timezone);
    if (!dataset) return null;
    return dataset.map((data) => new Country().hydrate(data));
  }

  async trashAll(): Promise<boolean> {
    const all = await this.listAll();
    if (all.length === 0) return true;
    return await this.deleteAll(this.db.tableName);
  }


  /**
   * Exports country data with revision information.
   *
   * @return {Promise<{revision: string, data: Record<string, any>, exported_at: string}>} A promise resolving to an object containing the revision identifier, the exported data, and the timestamp of the export.
   */
  static async exportable(): Promise<{
    revision: string;
    data: Record<string, any>;
    exported_at: string;
  }>
  {
    const instance = new Country();
    const revision = await instance.getRevision();
    const data: Record<string, any> = {};

    const allCountries = await this._list();
    if (allCountries) {
      allCountries.forEach((country) => {
        if (country.getIso()) {
          data[country.getIso()!] = {
            code: country.getCode(),
            name: country.getName(),
            timezone: country.getTimezone(),
            mobileRegex: country.getMobileRegex(),
            flag: country.getFlag(),
          };
        }
      });
    }

    return {
      revision,
      data,
      exported_at: new Date().toISOString(),
    };
  }

  /**
   * Vérifie si le pays est nouveau
   */
  isNew(): boolean {
    return this.id === undefined;
  }

  /**
   * Conversion JSON pour API
   */
  toJSON(): object {
    return {
      guid: this.guid,
      code: this.code,
      iso: this.iso,
      name: this.name,
      timezone: this.timezone,
      mobileRegex: this.mobileRegex,
      flag: this.flag,
    };
  }

  /**
   * Représentation string
   */
  toString(): string {
    return `Country { id: ${this.id}, guid: ${this.guid}, iso: "${this.iso}", name: "${this.name}", code: ${this.code} }`;
  }

  // === MÉTHODES STATIQUES ===

  /**
   * Loads a country based on the provided identifier.
   *
   * @param {any} identifier - The identifier used to load the country.
   * @param {boolean} [byGuid=false] - Specifies whether to load by GUID.
   * @param {boolean} [byCode=false] - Specifies whether to load by code.
   * @param {boolean} [byIso=false] - Specifies whether to load by ISO.
   * @return {Promise<Country | null>} A promise that resolves to the loaded SectorEntry instance or null.
   */
  static _load(
    identifier: any,
    byGuid: boolean = false,
    byCode: boolean = false,
    byIso: boolean = false
  ): Promise<Country | null> {
    return new Country().load(identifier, byGuid, byCode, byIso);
  }

  /**
   * Liste les pays selon les conditions
   */
  static _list(conditions: Record<string, any> = {}): Promise<Country[] | null> {
    return new Country().list(conditions);
  }

  static async _deleteAll(): Promise<boolean> {
    return await new Country().trashAll()
  }
  /**
   * Liste les pays par fuseau horaire
   */
  static _listByTimezone(timezone: string): Promise<Country[] | null> {
    return new Country().listByTimezone(timezone);
  }

  /**
   * Convertit des données en objet SectorEntry
   */
  static _toObject(data: any): Country {
    return new Country().hydrate(data);
  }

}