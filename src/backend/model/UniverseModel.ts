import { Op } from 'sequelize';

import BaseModel from '../database/db.base';
import G from '../tools/glossary';
import { UniverseDbStructure } from '../database/data/universe.db';

export default class UniverseModel extends BaseModel {
  public readonly db = {
    tableName: `${G.confTable}universe`,
    id: 'id',
    guid: 'guid',
    name: 'name',
    sector: 'sector',
    description: 'description',
  } as const;

  protected id?: number;
  protected guid?: number;
  protected name?: string;
  protected sector?: any[];
  protected description?: string;

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
   * Trouve tous les univers contenant un secteur spécifique
   */
  protected async findBySector(sectorId: number): Promise<any[]> {
    // Utilisation de l'opérateur JSONB @> pour vérifier si le tableau contient l'élément
    return await this.findAll(this.db.tableName, {
      [this.db.sector]: { [Op.contains]: [sectorId] },
    });
  }

  /**
   * Liste tous les enregistrements selon les conditions
   */
  protected async listAll(conditions: Record<string, any> = {}): Promise<any[]> {
    return await this.findAll(this.db.tableName, conditions);
  }

  /**
   * Crée un nouvel univers
   */
  protected async create(): Promise<void> {
    await this.validate();

    // Générer le GUID automatiquement

    const existingName = await this.findByName(this.name!);
    if (existingName) throw new Error(`Univers name '${this.name}' already exists in database`);

    const lastID = await this.insertOne(this.db.tableName, {
      [this.db.guid]: this.guid,
      [this.db.name]: this.name,
      [this.db.sector]: this.sector,
      [this.db.description]: this.description,
    });



    if (!lastID) {
      throw new Error('Failed to create univers entry');
    }
    this.id = lastID;
    console.log('✅ Univers créé avec ID:', this.id);
  }

  /**
   * Met à jour un univers existant
   */
  protected async update(): Promise<void> {
    await this.validate();

    if (!this.id) {
      throw new Error('Univers ID is required for update');
    }

    const updateData: Record<string, any> = {};
    if (this.name !== undefined) updateData[this.db.name] = this.name;
    if (this.sector !== undefined) updateData[this.db.sector] = this.sector;
    if (this.description !== undefined) updateData[this.db.description] = this.description;

    const affected = await this.updateOne(this.db.tableName, updateData, { [this.db.id]: this.id });
    if (!affected) {
      throw new Error('Failed to update univers entry');
    }
  }

  /**
   * Supprime un univers
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

  /**
   * Ajoute un secteur à l'univers
   */
  protected async addSector(sectorId: JSON): Promise<void> {
    if (!this.sector) {
      this.sector = [];
    }

    if (!this.sector.includes(sectorId)) {
      this.sector.push(sectorId);
      await this.update();
    }
  }

  /**
   * Supprime un secteur de l'univers
   */
  protected async removeSector(sectorId: JSON): Promise<void> {
    if (!this.sector) return;

    const index = this.sector.indexOf(sectorId);
    if (index > -1) {
      this.sector.splice(index, 1);
      await this.update();
    }
  }

  /**
   * Vérifie si l'univers contient un secteur
   */
  protected hasSector(sectorId: JSON): boolean {
    return this.sector ? this.sector.includes(sectorId) : false;
  }

  private async validate(): Promise<void> {
    // Valider le nom
    if (this.name === undefined || !UniverseDbStructure.validation.validateName(this.name)) {
      throw new Error('Univers name must be between 1 and 100 characters');
    }

    // // Valider les secteurs
    // if (this.sector === undefined || !UniverseDbStructure.validation.validateSectors(this.sector)) {
    //   throw new Error('Univers must have at least one valid sector (positive integer array)');
    // }

    // Valider la description
    if (!UniverseDbStructure.validation.validateDescription(this.description)) {
      throw new Error('Univers description must be less than 255 characters');
    }
  }
}