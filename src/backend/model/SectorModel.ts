import BaseModel from '../database/db.base';
import G from '../tools/glossary';
// import { SectorDbStructure } from '../database/data/sector.db';

export default class SectorModel extends BaseModel {
  public readonly db = {
    tableName: `${G.confTable}sector`,
    id: 'id',
    guid: 'guid',
    name: 'name',
    active: 'active',
    description: 'description',
    updated: 'updated',
  } as const;

  protected id?: number;
  protected guid?: number;
  protected name?: string;
  protected active?: boolean;
  protected description?: string;
  protected updated?: Date;

  protected constructor() {
    super();
  }

  /**
   * Trouve un enregistrement par son ID
   */
  protected async find(id: number): Promise<any> {
    return await this.findOne(this.db.tableName, { [this.db.id]: id });
  }

  /**
   * Trouve un enregistrement par son GUID
   */
  protected async findByGuid(guid: number): Promise<any> {
    return await this.findOne(this.db.tableName, { [this.db.guid]: guid });
  }

  /**
   * Trouve un enregistrement par son name
   */
  protected async findByName(name: string): Promise<any> {
    return await this.findOne(this.db.tableName, { [this.db.name]: name });
  }

  /**
   * Liste tous les enregistrements selon les conditions
   */
  protected async listAll(
    conditions: Record<string, any> = {},
  ): Promise<any[]> {
    return await this.findAll(this.db.tableName, conditions);
  }

  /**
   * Crée un nouveau secteur
   */
  protected async create(): Promise<void> {
    this.active = true;

    const existingName = await this.findByName(this.name!);
    if (existingName) throw new Error(`Sector name '${this.name}' already exists in database`);

    const lastID = await this.insertOne(this.db.tableName, {
      [this.db.guid]: this.guid,
      [this.db.name]: this.name,
      [this.db.active]: this.active,
      [this.db.description]: this.description,
      [this.db.updated]: this.updated,
    });

    console.log(`🌍 Secteur créé - Name: ${this.name} | GUID: ${this.guid}`);

    if (!lastID) {
      throw new Error('Failed to create sector entry');
    }
    this.id = lastID.id;
    console.log('✅ Secteur créé avec ID:', this.id);
  }

  /**
   * Met à jour un secteur existant
   */
  protected async update(): Promise<void> {
    if (!this.id) {
      throw new Error('Sector ID is required for update');
    }

    const updateData: Record<string, any> = {};
    if (this.name !== undefined) updateData[this.db.name] = this.name;
    if (this.active !== undefined) updateData[this.db.active] = this.active;
    if (this.description !== undefined) updateData[this.db.description] = this.description;
    if (this.updated !== undefined) updateData[this.db.updated] = this.updated;

    const affected = await this.updateOne(this.db.tableName, updateData, { [this.db.id]: this.id });
    if (!affected) {
      throw new Error('Failed to update sector entry');
    }
  }

  /**
   * Supprime un secteur
   */
  protected async trash(id: number): Promise<boolean> {
    return await this.deleteOne(this.db.tableName, { [this.db.id]: id });
  }

  /**
   * Obtient la dernière modification
   */
  protected async getLastModification(): Promise<Date | null> {
    try {
      return await this.findLastModification(this.db.tableName);
    } catch (error: any) {
      console.log(`Failed to get last modification time: ${error.message}`);
      return null;
    }
  }

  // private async validate(): Promise<void> {
  //   // Valider le nom
  //   if (this.name === undefined || !SectorDbStructure.validation.validateName(this.name)) {
  //     throw new Error('Sector name must be between 2 and 128 characters');
  //   }
  //
  //   // Valider la description
  //   if (!SectorDbStructure.validation.validateDescription(this.description)) {
  //     throw new Error('Sector description must be between 2 and 128 characters');
  //   }
  //   if (this.active === undefined) {
  //     throw new Error('active sector attribute must be Boolean');
  //   }
  // }
}