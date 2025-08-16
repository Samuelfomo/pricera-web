import UniverseModel from '../model/UniverseModel';

export default class Universe extends UniverseModel {
  constructor() {
    super();
  }

  setGuid(guid: number): Universe {
    this.guid = guid;
    return this;
  }

  setName(name: string): Universe {
    this.name = name;
    return this;
  }

  setDescription(description: string): Universe {
    this.description = description;
    return this;
  }

  setSector(sector: object[]): Universe {
    this.sector = sector;
    return this;
  }


  getId(): number | undefined {
    return this.id;
  }

  getGuid(): number | undefined {
    return this.guid;
  }

  getName(): string | undefined {
    return this.name;
  }

  getDescription(): string | undefined {
    return this.description;
  }

  getSector(): any[] | undefined  {
    return this.sector;
  }


  /**
   * Populates the instance properties with the provided items and returns the instance.
   *
   * @param {any} data - The items object containing properties to hydrate the instance.
   * @return {Sector} The updated instance of the Sector class.
   */
  private hydrate(data: any): Universe {
    this.id = data.id;
    this.guid = data.guid;
    this.name = data.name;
    this.sector = data.sector;
    this.description = data.description;
    return this;
  }

  /**
   * Persists the current state of the instance.
   * Depending on whether the instance is new or existing,
   * it either creates a new record or updates the existing one.
   *
   * @throws {Error} If an error occurs during the save operation.
   * @return {Promise<void>} A promise that resolves when the save operation completes successfully.
   */
  async save(): Promise<void> {
    try {
      if (this.isNew()) {
        await this.create();
      } else {
        await this.update();
      }
    } catch (error: any) {
      console.error('❌ Erreur sauvegarde:', error.message);
      throw new Error(error);
    }
  }

  /**
   * Deletes the resource associated with the current instance identifier.
   * Ensures that the identifier exists before proceeding with the deletion process.
   *
   * @return {Promise<boolean>} Returns a promise that resolves to a boolean value indicating whether the delete operation was successful.
   */
  async delete(): Promise<boolean> {
    if (this.id !== undefined) {
      return await this.trash(this.id);
    }
    return false;
  }

  async trashAll(): Promise<boolean> {
    const all = await this.listAll();
    if (all.length === 0) return true;
    return await this.deleteAll(this.db.tableName);
  }


  /**
   * Updates the status of the current object by toggling its active state.
   * Verifies the existence of an identifier prior to performing the update.
   * Saves the updated state to persist the changes.
   *
   * @return {Promise<void>} A promise that resolves when the status update and save operations are completed.
   */
  // async patchStatus(): Promise<void> {
  //   this.active = !this.active;
  //   await this.save();
  // }

  /**
   * Loads a sector by a given identifier or guid.
   *
   * @param {any} identifier - The identifier to locate the sector, can be an ID or guid.
   * @param {boolean} [byGuid=false] - A flag indicating if the lookup should be by Guid (true) or by numeric identifier (false).
   * @return {Promise<Sector|null>} A promise resolving to the found sector object if successful, or null if not found.
   */
  async load(identifier: any, byGuid: boolean = false): Promise<Universe | null> {
    const data = byGuid ? await this.findByGuid(identifier) : await this.find(Number(identifier));
    if (!data) return null;
    return this.hydrate(data);
  }

  /**
   * Retrieves a list of sectors based on the specified conditions.
   *
   * @param {Record<string, any>} [conditions={}] - An optional set of conditions to filter the sectors.
   * @return {Promise<Sector[] | null>} A promise that resolves to an array of hydrated Sector instances or null if no sectors are found.
   */
  async list(
    conditions: Record<string, any> = {},
  ): Promise<Universe[] | null> {
    const dataset = await this.listAll(conditions);
    if (!dataset) return null;
    return dataset.map((data) => new Universe().hydrate(data));
  }

  /**
   * Checks whether the current instance is in a 'new' state.
   *
   * @return {boolean} True if the instance has no defined ID, indicating it is new; otherwise, false.
   */
  isNew(): boolean {
    return this.id === undefined;
  }

  /**
   * Converts the instance properties to a JSON object representation.
   * @return {object} A JSON object containing the `name` and `token` properties of the instance.
   */
  toJSON(): object {
    return {
      guid: this.guid,
      name: this.name,
      sector: this.sector,
      description: this.description,
    };
  }

  /**
   * Returns a string representation of the Sector object.
   * @return {string} A string containing the guid, name, and active status of the Sector.
   */
  toString(): string {
    return `Universe { guid: ${this.guid}, name: "${this.name}", description: "${this.description}", sector: ${this.sector} }`;
  }

  /**
   * Loads a sector using the provided identifier and an optional guid flag.
   *
   * @param {any} identifier - The unique identifier used to load the sector.
   * @param {boolean} [byGuid=false] - A flag indicating whether to load the sector by guid.
   * @return {Promise<Sector | null>} A promise that resolves to the loaded sector instance or null if not found.
   */
  static _load(identifier: any, byGuid: boolean = false): Promise<Universe | null> {
    return new Universe().load(identifier, byGuid);
  }

  /**
   * Retrieves a list of sectors based on the specified conditions.
   *
   * @param {Record<string, any>} [conditions={}] - A set of key-value pairs representing the conditions for filtering the sectors.
   * @return {Promise<Sector[] | null>} A promise that resolves to an array of sectors matching the conditions, or null if no sectors are found.
   */
  static _list(
    conditions: Record<string, any> = {},
  ): Promise<Universe[] | null> {
    return new Universe().list(conditions);
  }

  static async _deleteAll(): Promise<boolean> {
    return await new Universe().trashAll()
  }


}