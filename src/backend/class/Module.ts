import ModuleModel from '../model/ModuleModel';

export default class Module extends ModuleModel {
  constructor() {
    super();
  }

                            //   SETTERS
  setName(name: string): Module {
    this.name = name;
    return this;
  }

  setCode(code: number): Module {
    this.code = code;
    return this;
  }

  setDescription(description: string): Module {
    this.description = description
    return this;
  }

  setActive(active: boolean): Module {
    this.active = active
    return this;
  }

                              // GETTERS
  getId(): number | undefined {
    return this.id;
  }

  getGuid(): number | undefined {
    return this.guid;
  }

  getCode(): number | undefined {
    return this.code;
  }

  getName(): string | undefined {
    return this.name;
  }

  getDescription(): string | undefined {
    return this.description;
  }

  getActive(): boolean | undefined {
    return this.active;
  }

                  // obtenir le nom complet
  getDisplayName(): string {
    const name = this.name || 'Unknown Module';
    return `${name}`;
  }

                  // obtenir l'identifiant sous forme de chaine
  getIdentifier(): string {
    return this.code?.toString() || 'Unknown';
  }

                  //hydrate l'instance avec les donnees

  private hydrate(data: any): Module {
    this.id = data.id;
    this.guid = data.guid;
    this.code = data.code;
    this.name = data.name;
    this.description = data.description;
    this.active = data.active;
    return this;
  }

                    // verifier si c'est un nouveau module

  isNew(): boolean {
    return this.id === undefined;
  }

                  // sauvegarde un pays (create ou update)

  async save(): Promise<void> {
    try {
      if (this.isNew()) {
        await this.create();
      } else {
        await this.create();
      }
    } catch (error: any) {
      console.error('Erreur sauvegarde module:', error.message);
      throw new Error(error);
    }
  }

                   //   suppression du module
  async delete(): Promise<boolean> {
    if (this.id !== undefined) {
      return await this.trash(this.id);
    }
    return false;
  }

                         //   chargement d'un module
  async load(identifier: any, byGuid: boolean, _byCode: boolean): Promise<Module | null> {
    const data = byGuid
      ? await this.findByGuid(identifier)
      : await this.find(Number(identifier));

    if (!data) return null;
    return this.findByGuid(data);
  }

                      //   liste des modules
  async list(conditions: Record<string, any>): Promise<Module[] | null> {
    const dataset = await this.listAll(conditions);
    if (!dataset) return null;
    return dataset.map((data) => new Module().hydrate(data));
  }


                    //   conversion JSON pour API
  toJSON(): object {
    return {
      guid: this.guid,
      code: this.code,
      name: this.name,
      description: this.description,
      active: this.active,
    }
  }

                      //representation string
  toString(): string {
    return `Module {id: ${this.id}, guid: ${this.guid}, code: ${this.code}, name: ${this.name}, description: ${this.description}}`;
  }

                //   methodes statiques pour usage global
  static _load(
    identifier: any,
    byGuid: boolean = false,
    byCode: boolean = false,
  ): Promise<Module | null> {
    return new Module().load(identifier, byGuid, byCode);
  }


                  // liste les modules selon les conditions
  static _list(conditions: Record<string, any> = {}): Promise<Module[] | null> {
    return new Module().list(conditions);
  }

                    // convertit les donnees en object Module
  static _toObject(data: any): Module {
    return new Module().hydrate(data);
  }

}