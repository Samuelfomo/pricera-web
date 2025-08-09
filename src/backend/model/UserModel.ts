import BaseModel from '../database/db.base';
import G from '../tools/glossary';
import { UserDbStructure } from '../database/data/user.db';

export default class UserModel extends BaseModel {
  public readonly db = {
    tableName: `${G.appTable}user`,
    id: 'id',
    guid: 'guid',
    email: 'email',
    token: 'token',
    account: 'account',
    profile: 'profile',
    createdBy: 'createdBy',
  } as const;

  protected id?: number;
  protected guid?: number;
  protected email?: string;
  protected token?: string;
  protected account?: number;
  protected profile?: number;
  protected createdBy?: number;

  protected constructor() {
    super();
  }

             // Rechercher un utilisateur par ID

  protected async find(id: number): Promise<any> {
    return await this.findOne(this.db.tableName, { [this.db.id]: id });
  }


             // Rechercher un utilisateur par email

  protected async findByEmail(email: string): Promise<any> {
    return await this.findOne(this.db.tableName, { [this.db.email]: email.toLowerCase() });
  }


               // Rechercher un utilisateur par token

  protected async findByToken(token: string): Promise<any> {
    return await this.findOne(this.db.tableName, { [this.db.token]: token });
  }

                     // Rechercher un utilisateur par guid

  protected async findByGuid(guid: number): Promise<any> {
    return await this.findOne(this.db.tableName, { [this.db.guid]: guid });
  }

                // Lister les utilisateurs

  protected async listAll(conditions: Record<string, any> = {}): Promise<any[]> {
    return await this.findAll(this.db.tableName, conditions);
  }

       // Créer un utilisateur

  protected async create(): Promise<void> {
    await this.validate();

    const existing = await this.findByEmail(this.email!);
    if (existing) throw new Error(`L'email '${this.email}' est déjà utilisé`);

    const lastID = await this.insertOne(this.db.tableName, {
      [this.db.guid]: this.guid,
      [this.db.email]: this.email?.toLowerCase(),
      [this.db.token]: this.token,
      [this.db.account]: this.account,
      [this.db.profile]: this.profile,
      [this.db.createdBy]: this.createdBy ?? null,
    });

    if (!lastID) throw new Error('Échec de la création de l’utilisateur');
    this.id = lastID;

    console.log('✅ Utilisateur créé avec ID:', this.id);
  }

             // Mettre à jour un utilisateur

  protected async update(): Promise<void> {
    await this.validate();

    if (!this.id) throw new Error('L’ID utilisateur est requis pour la mise à jour');

    const updateData: Record<string, any> = {};
    if (this.email !== undefined) updateData[this.db.email] = this.email.toLowerCase();
    if (this.token !== undefined) updateData[this.db.token] = this.token;
    if (this.account !== undefined) updateData[this.db.account] = this.account;
    if (this.profile !== undefined) updateData[this.db.profile] = this.profile;
    if (this.createdBy !== undefined) updateData[this.db.createdBy] = this.createdBy;

    const affected = await this.updateOne(this.db.tableName, updateData, { [this.db.id]: this.id });
    if (!affected) throw new Error('Échec de la mise à jour de l’utilisateur');
  }

                // Supprimer un utilisateur

  protected async trash(id: number): Promise<boolean> {
    return await this.deleteOne(this.db.tableName, { [this.db.id]: id });
  }


                       // Obtenir la dernière modification

  protected async getLastModification(): Promise<Date | null> {
    try {
      return await this.findLastModification(this.db.tableName);
    } catch (error: any) {
      console.error('Échec lors de la récupération de la dernière modification :', error.message);
      return null;
    }
  }

               // Valider les données utilisateur

  private async validate(): Promise<void> {
    const v = UserDbStructure.validation;

    if (!this.email || !v.validationEmail(this.email)) {
      throw new Error("Email invalide ou manquant");
    }

    if (!this.token || !v.validateToken(this.token)) {
      throw new Error("Token invalide ou manquant (min 10 caractères)");
    }

    if (!this.profile || this.profile <= 0) {
      throw new Error("Profil utilisateur invalide");
    }

    this.email = this.email.trim().toLowerCase();
    this.token = this.token.trim();
  }
}
