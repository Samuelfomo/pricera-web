import PermissionModel from '../model/PermissionModel';


export default class Permission extends PermissionModel {
  constructor() {
    super();
  }

                    //   SETTERS
  setCode(code: number): Permission {
    this.code = code;
    return this;
  }

  setName(name: string): Permission {
    this.name = name;
    return this;
  }

  setDescription(description: string): Permission {
    this.description = description;
    return this;
  }

  setModule(module: number): Permission {
    this.module = module;
    return this;
  }

  setProfile(profile: number): Permission {
    this.profile = profile;
    return this;
  }

                    //   GETTERS
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

  getCode(): number | undefined {
    return this.code;
  }




  getModule(): number | undefined {
    return this.module;
  }

  getProfile(): number | undefined {
    return this.profile;
  }

          //   hydrate l'instance avec les donnees
  private hydrate(data: any): Permission {
    this.id = data.id;
    this.guid = data.guid;
    this.code = data.code;
    this.description = data.description;
    this.name = data.name;
    this.module = data.module;
    this.profile = data.profile;
    return this;
  }

            // obtenir le nom complet de la permission

  getDisplayName(): string {
    const name = this.name || 'Unknown Permission';
    return `${name}`;
  }

                // obtenir l'identifiant sous forme de chaine
  getIdentifier(): string {
    return this.code?.toString() || 'Unknown';
  }


          //  verifie si c'est un nouveau module
  isNew(): boolean {
    return this.id === undefined;
  }

              // conversion JSON pour API

  toJSON(): object {
    return {
      guid: this.guid,
      code: this.code,
      name: this.name,
      description: this.description,
      module: this.module,
      profile: this.profile,
    };
  }

          // representation string
  toString(): string {
    return `Permission { id: ${this.id}, guid: ${this.guid}, code: ${this.code}, name: "${this.name}" }`;
  }

            //  sauvegarde la permission (creation ou mise a jour)

  async save(): Promise<void> {
    try {
      if (this.isNew()) {
        await this.create();
      } else {
        await this.update();
      }
    } catch (error: any) {
      console.error('❌ Erreur sauvegarde permission:', error.message);
      throw new Error(error);
    }
  }

                        // supprime une permission
  async delete(): Promise<boolean> {
    if (this.id !== undefined) {
      return await this.trash(this.id);
    }
    return false;
  }

  async load(identifier: any, byGuid: boolean = false): Promise<Permission | null> {
    const data = byGuid
      ? await this.findByGuid(identifier)
      : await this.find(Number(identifier));

    if (!data) return null;
    return this.hydrate(data);
  }

              // liste les permissions selon les conditions
  async list(conditions: Record<string, any> = {}): Promise<Permission[] | null> {
    const dataset = await this.listAll(conditions);
    if (!dataset) return null;
    return dataset.map((data) => new Permission().hydrate(data));
  }

  // === STATIC HELPERS ===


  static _load(identifier: any, byGuid: boolean = false): Promise<Permission | null> {
    return new Permission().load(identifier, byGuid);
  }


                          // list les pays selon les conditions
  static _list(conditions: Record<string, any> = {}): Promise<Permission[] | null> {
    return new Permission().list(conditions);
  }


                        // convertit les donnees en object
  static _toObject(data: any): Permission {
    return new Permission().hydrate(data);
  }

}