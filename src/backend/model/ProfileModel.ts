import BaseModel from '../database/db.base';
import G from '../tools/glossary';
import { ProfileDbStructure } from '../database/data/profile.db';

export default class ProfileModel extends BaseModel {
  public readonly db = {
    tableName: `${G.confTable}profile`,
    id: 'id',
    guid: 'guid',
    name: 'name',
    image: 'image',
    root: 'root',
    level: 'level',
  } as const;

  protected id?: number;
  protected guid?: number;
  protected name?: string;
  protected image?: string;
  protected root?: boolean;
  protected level?: number;

  protected constructor() {
    super();
  }


                 // Trouve un profil par ID
  protected async find(id: number): Promise<any> {
    return await this.findOne(this.db.tableName, { [this.db.id]: id });
  }

                    // Trouve un profil par GUID
  protected async findByGuid(guid: number): Promise<any> {
    return await this.findOne(this.db.tableName, { [this.db.guid]: guid });
  }

                  // Trouve un profil par nom
  protected async findByName(name: string): Promise<any> {
    return await this.findOne(this.db.tableName, { [this.db.name]: name });
  }

                         // Liste tous les profils
  protected async listAll(conditions: Record<string, any> = {}): Promise<any[]> {
    return await this.findAll(this.db.tableName, conditions);
  }

                        // Crée un nouveau profil
  protected async create(): Promise<void> {
    await this.validate();

    const guid = await this.guidGenerator(this.db.tableName, 6);
    if (!guid) throw new Error('Failed to generate GUID for profile');

    const existing = await this.findByName(this.name!);
    if (existing) throw new Error(`Profile name '${this.name}' already exists`);

    const lastID = await this.insertOne(this.db.tableName, {
      [this.db.guid]: guid,
      [this.db.name]: this.name,
      [this.db.image]: this.image,
      [this.db.root]: this.root ?? false,
      [this.db.level]: this.level,
    });

    if (!lastID) throw new Error('Failed to create profile');
    this.id = lastID;
    this.guid = guid;

    console.log('✅ Profil créé avec ID:', this.id);
  }

              // Met à jour un profil existant
  protected async update(): Promise<void> {
    await this.validate();

    if (!this.id) throw new Error('Profile ID is required for update');

    const updateData: Record<string, any> = {};
    if (this.name !== undefined) updateData[this.db.name] = this.name;
    if (this.image !== undefined) updateData[this.db.image] = this.image;
    if (this.root !== undefined) updateData[this.db.root] = this.root;
    if (this.level !== undefined) updateData[this.db.level] = this.level;

    const affected = await this.updateOne(this.db.tableName, updateData, { [this.db.id]: this.id });
    if (!affected) throw new Error('Failed to update profile');
  }

                      // Supprime un profil
  protected async trash(id: number): Promise<boolean> {
    return await this.deleteOne(this.db.tableName, { [this.db.id]: id });
  }


                  // Récupère la date de dernière modification
  protected async getLastModification(): Promise<Date | null> {
    try {
      return await this.findLastModification(this.db.tableName);
    } catch (error: any) {
      console.log(`Failed to get last modifications: ${error.message}`);
      return null;
    }
  }

                // Valide les données avant création/mise à jour
  private async validate(): Promise<void> {
    const v = ProfileDbStructure.validation;


                        // valider le nom
    if (!this.name || !v.validateName(this.name))
      throw new Error('Profile name must be between 2 and 200 characters');

                  // valider le niveau de profil
    if (this.level === undefined || !v.validateLevel(this.level))
      throw new Error('Profile level  must be defined');


                              // Nettoyage de donnee
    this.name = this.name?.trim();
    this.image = this.image?.trim();
  }
}
