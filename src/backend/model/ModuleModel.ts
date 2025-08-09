import BaseModel from '../database/db.base';
import G from '../tools/glossary';
import { ModuleDbStructure } from '../database/data/module.db';

export default class ModuleModel extends BaseModel {
  public readonly db = {
    tableName: `${G.confTable}module`,
    id: 'id',
    guid: 'guid',
    name: 'name',
    code: 'code',
    active: 'active',
    description: 'description',
  } as const;

  protected id?: number;
  protected guid?: number;
  protected name?: string;
  protected code?: number;
  protected active?: boolean;
  protected description?: string;

  protected constructor() {
    super();
  }


            // Rechercher un module par ID

  protected async find(id: number): Promise<any> {
    return await this.findOne(this.db.tableName, { [this.db.id]: id });
  }


              // Rechercher un module par guid

  protected async findByGuid(guid: number): Promise<any> {
    return await this.findOne(this.db.tableName, { [this.db.guid]: guid });
  }


             // Rechercher un module par nom

  protected async findByName(name: string): Promise<any> {
    return await this.findOne(this.db.tableName, { [this.db.name]: name.trim() });
  }


           // Rechercher un module par code

  protected async findByCode(code: number): Promise<any> {
    return await this.findOne(this.db.tableName, { [this.db.code]: code });
  }

             // Lister tous les modules

  protected async listAll(conditions: Record<string, any> = {}): Promise<any[]> {
    return await this.findAll(this.db.tableName, conditions);
  }

                 // Créer un module

  protected async create(): Promise<void> {
    await this.validate();

    const guid = await this.guidGenerator(this.db.tableName, 6);
    if (!guid) throw new Error('Échec de la génération du GUID');

    const lastID = await this.insertOne(this.db.tableName, {
      [this.db.guid]: guid,
      [this.db.name]: this.name,
      [this.db.code]: this.code,
      [this.db.active]: this.active ?? true,
      [this.db.description]: this.description ?? null,
    });

    if (!lastID) throw new Error("Échec de la création du module");

    this.id = lastID;
    this.guid = guid;
    console.log("✅ Module créé avec ID :", this.id);
  }

                 // Mettre à jour un module

  protected async update(): Promise<void> {
    await this.validate();

    if (!this.id) throw new Error('L’ID du module est requis pour la mise à jour');

    const updateData: Record<string, any> = {};
    if (this.name !== undefined) updateData[this.db.name] = this.name;
    if (this.code !== undefined) updateData[this.db.code] = this.code;
    if (this.active !== undefined) updateData[this.db.active] = this.active;
    if (this.description !== undefined) updateData[this.db.description] = this.description;

    const affected = await this.updateOne(this.db.tableName, updateData, { [this.db.id]: this.id });
    if (!affected) throw new Error("Échec de la mise à jour du module");
  }

                   // Supprimer un module

  protected async trash(id: number): Promise<boolean> {
    return await this.deleteOne(this.db.tableName, { [this.db.id]: id });
  }

                  // Dernière modification

  protected async getLastModification(): Promise<Date | null> {
    try {
      return await this.findLastModification(this.db.tableName);
    } catch (error: any) {
      console.error('Erreur récupération dernière modification module:', error.message);
      return null;
    }
  }
                      // Validation des données

  private async validate(): Promise<void> {
    const v = ModuleDbStructure;

    if (!this.name || !v.validateName(this.name)) {
      throw new Error('Nom du module invalide ou manquant');
    }

    if (this.description && !v.validateDescription(this.description)) {
      throw new Error('Description du module invalide');
    }

    if (this.code === undefined || isNaN(this.code)) {
      throw new Error('Code du module invalide ou manquant');
    }

      // Nettoyage éventuel
    v.cleanData(this);
  }
}
