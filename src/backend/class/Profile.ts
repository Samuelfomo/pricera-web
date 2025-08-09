import ProfileModel from '../model/ProfileModel';


export default class Profile extends ProfileModel {
  constructor() {
    super();
  }

                // SETTERS FLUENT
  setName(name: string): Profile {
    this.name = name;
    return this;
  }

  setImage(image: string): Profile {
    this.image = image;
    return this;
  }

  setRoot(root: boolean): Profile {
    this.root = root;
    return this;
  }

  setLevel(level:number): Profile {
    this.level = level;
    return this;
  }

                // GETTERS
  getId(): number | undefined {
    return this.id;
  }

  getGuid(): number | undefined {
    return this.guid;
  }

  getName(): string | undefined {
    return this.name;
  }

  getImage(): string | undefined {
    return this.image;
  }

  getlevel(): number | undefined {
    return this.level;
  }

  getRoot(): boolean  | undefined {
    return this.root;
  }

                //   obtient le nom complet
  getDisplayName(): string {
    const name= this.name || 'Unknown Profile';
    return `${name}`;
  }

                // Hydrate l instance avec les donnees
  private hydrate(data: any): Profile {
    this.id = data.id;
    this.guid = data.guid;
    this.name = data.name;
    this.image = data.image;
    this.level = data.level;
    this.root = data.root;
    return this;
  }

  getIdentifier(): string {
    return this.guid?.toString() || 'Unknown';
  }
// === SERIALIZATION ===

  toJSON(): object {
    return {
      guid: this.guid,
      name: this.name,
      image: this.image,
      root: this.root,
      level: this.level,
    };
  }

  toString(): string {
    return `Profile { id: ${this.id}, guid: ${this.guid}, name: "${this.name}", level: ${this.level}, root: ${this.root} }`;
  }
  isNew(): boolean {
    return this.id === undefined;
  }

  // === PERSISTENCE METHODS ===

  async save(): Promise<void> {
    try {
      if (this.isNew()) {
        await this.create();
      } else {
        await this.update();
      }
    } catch (error: any) {
      console.error('❌ Erreur sauvegarde profil:', error.message);
      throw new Error(error);
    }
  }

  async delete(): Promise<boolean> {
    if (this.id !== undefined) {
      return await this.trash(this.id);
    }
    return false;
  }

  async load(identifier: any, byGuid: boolean = false): Promise<Profile | null> {
    const data = byGuid
      ? await this.findByGuid(identifier)
      : await this.find(Number(identifier));

    if (!data) return null;
    return this.hydrate(data);
  }

  async list(conditions: Record<string, any> = {}): Promise<Profile[] | null> {
    const dataset = await this.listAll(conditions);
    if (!dataset) return null;
    return dataset.map((data) => new Profile().hydrate(data));
  }

  // === STATIC HELPERS ===

  static _load(identifier: any, byGuid: boolean = false): Promise<Profile | null> {
    return new Profile().load(identifier, byGuid);
  }

  static _list(conditions: Record<string, any> = {}): Promise<Profile[] | null> {
    return new Profile().list(conditions);
  }

  static _toObject(data: any): Profile {
    return new Profile().hydrate(data);
  }
}

