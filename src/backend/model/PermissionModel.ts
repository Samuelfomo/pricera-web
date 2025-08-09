import BaseModel from '../database/db.base';
import G from '../tools/glossary';

export default class PermissionModel extends BaseModel {
  public readonly db = {
    tableName: `${G.confTable}permission`,
    id: 'id',
    guid: 'guid',
    code: 'code',
    name: 'name',
    description: 'description',
    module: 'module',
    profile: 'profile',
  } as const;

  protected id?: number;
  protected guid?: number;
  protected code?: number;
  protected name?: string;
  protected description?: string;
  protected module?: number;
  protected profile?: number;

  protected constructor() {
    super();
  }

                 // Trouver une permission par ID

  protected async find(id: number): Promise<any> {
    return await this.findOne(this.db.tableName, { [this.db.id]: id });
  }

               // Trouver une permission par code

  protected async findByCode(code: number): Promise<any> {
    return await this.findOne(this.db.tableName, { [this.db.code]: code });
  }

               // Trouver une permission par GUID

  protected async findByGuid(guid: number): Promise<any> {
    return await this.findOne(this.db.tableName, { [this.db.guid]: guid });
  }

                // Trouver une permission par nom

  protected async findByName(name: string): Promise<any> {
    return await this.findOne(this.db.tableName, { [this.db.name]: name });
  }


             // Lister toutes les permissions avec des conditions

  protected async listAll(conditions: Record<string, any> = {}): Promise<any[]> {
    return await this.findAll(this.db.tableName, conditions);
  }

         // Créer une nouvelle permission

  protected async create(): Promise<void> {
    await this.validate();

    const guid = await this.guidGenerator(this.db.tableName, 6);
    if (!guid) throw new Error('Failed to generate GUID for permission');

    const existing = await this.findByCode(this.code!);
    if (existing) throw new Error(`Permission code '${this.code}' already exists`);

    const lastID = await this.insertOne(this.db.tableName, {
      [this.db.guid]: guid,
      [this.db.code]: this.code,
      [this.db.name]: this.name,
      [this.db.description]: this.description,
      [this.db.module]: this.module,
      [this.db.profile]: this.profile,
    });

    if (!lastID) throw new Error('Failed to create permission');
    this.id = lastID;
    this.guid = guid;

    console.log('✅ Permission créée avec ID:', this.id);
  }

               // Mettre à jour une permission

  protected async update(): Promise<void> {
    await this.validate();

    if (!this.id) throw new Error('Permission ID is required for update');

    const updateData: Record<string, any> = {};
    if (this.code !== undefined) updateData[this.db.code] = this.code;
    if (this.name !== undefined) updateData[this.db.name] = this.name;
    if (this.description !== undefined) updateData[this.db.description] = this.description;
    if (this.module !== undefined) updateData[this.db.module] = this.module;
    if (this.profile !== undefined) updateData[this.db.profile] = this.profile;

    const affected = await this.updateOne(this.db.tableName, updateData, { [this.db.id]: this.id });
    if (!affected) throw new Error('Failed to update permission');
  }

           // Supprimer une permission

  protected async trash(id: number): Promise<boolean> {
    return await this.deleteOne(this.db.tableName, { [this.db.id]: id });
  }


            // Obtenir la dernière date de modification

  protected async getLastModification(): Promise<Date | null> {
    try {
      return await this.findLastModification(this.db.tableName);
    } catch (error: any) {
      console.error('Échec lors de la récupération de la dernière modification :', error.message);
      return null;
    }
  }

                  // Valider les données de la permission

  private async validate(): Promise<void> {
    if (!this.code || this.code <= 0 || !Number.isInteger(this.code)) {
      throw new Error('Permission code must be a positive integer');
    }

    if (!this.name || typeof this.name !== 'string' || this.name.trim().length === 0 || this.name.length > 30) {
      throw new Error('Permission name must be a non-empty string with max 30 characters');
    }

    if (!this.description || typeof this.description !== 'string' || this.description.trim().length === 0) {
      throw new Error('Permission description is required');
    }

    if (!this.module || this.module <= 0) {
      throw new Error('Valid module ID is required');
    }

    if (!this.profile || this.profile <= 0) {
      throw new Error('Valid profile ID is required');
    }

    this.name = this.name.trim();
    this.description = this.description.trim();
  }
}
