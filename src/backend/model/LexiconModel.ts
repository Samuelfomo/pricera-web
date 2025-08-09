import BaseModel from '../database/db.base';
import G from '../tools/glossary';

export default class LexiconModel extends BaseModel {
  public readonly db = {
    tableName: `${G.confTable}lexicon`,
    id: 'id',
    guid: 'guid',
    translation: 'translation',
    reference:'reference',
    portable: 'portable',
    updated: 'updated',
  } as const;

  protected id?: number;
  protected guid?: number;
  protected translation?: object;
  protected reference?: string;
  protected portable?: boolean;
  protected updated?: Date;

  protected constructor() {
    super();
  }

                                    // trouve un enregistrement par son ID
  protected async find(id: number) {
    return await this.findOne(this.db.tableName, { [this.db.id]: id });
  }

                        //   trouver un enregistrement par guid
  protected async findByGuid(guid: number) {
    return await this.findOne(this.db.tableName, { [this.db.guid]: guid });
  }

                      //   liste tous les enregistrements selon les conditions
  protected async listAll(conditions: Record<string, any> = {}) {
    return await this.findAll(this.db.tableName, conditions);
  }

  // Créer un nouveau lexique
  protected async create(): Promise<void> {

    const lastID = await this.insertOne(this.db.tableName, {
      [this.db.guid]: this.guid,
      [this.db.translation]: this.translation,
      [this.db.reference]: this.reference,
      [this.db.portable]: this.portable ?? false,
      [this.db.updated]: this.updated,
    });

    if (!lastID) throw new Error("Échec de la création du lexique");

    this.id = lastID.id;
    console.log("✅ Lexicon créé avec ID :", this.id);
  }

  // Mettre à jour un lexique
  protected async update(): Promise<void> {

    if (!this.id) throw new Error('L’ID du lexique est requis pour la mise à jour');

    const updateData: Record<string, any> = {};
    if (this.translation !== undefined) updateData[this.db.translation] = this.translation;
    if (this.reference !== undefined) updateData[this.db.reference] = this.reference;
    if (this.portable !== undefined) updateData[this.db.portable] = this.portable;

    const affected = await this.updateOne(this.db.tableName, updateData, { [this.db.id]: this.id });
    if (!affected) throw new Error("Échec de la mise à jour du lexique");
  }

  //  Supprimer un lexique
  protected async trash(id: number): Promise<boolean> {
    return await this.deleteOne(this.db.tableName, { [this.db.id]: id });
  }

  // Supprimer tous
  protected async trashAll(): Promise<boolean> {
    const all = await this.listAll();
    if (all.length === 0) return true;
    return await this.deleteAll(this.db.tableName);
  }

  // Dernière modification
  protected async getLastModification(): Promise<Date | null> {
    try {
      return await this.findLastModification(this.db.tableName);
    } catch (error: any) {
      console.error('Erreur récupération dernière modification lexique :', error.message);
      return null;
    }
  }
}