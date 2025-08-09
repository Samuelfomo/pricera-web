import UserModel from '../model/UserModel';

export default class User extends UserModel {
  constructor() {
    super();
  }

  // === SETTERS ===
  setGuid(guid: number): User{
    this.guid = guid;
    return this;
  }
  setEmail(email: string): User {
    this.email = email;
    return this;
  }

  setToken(token: string): User {
    this.token = token;
    return this;
  }

  setAccount(account: number): User {
    this.account = account;
    return this;
  }

  setProfile(profile: number): User {
    this.profile = profile;
    return this;
  }

  setCreateBy(createBy: number): User {
    this.createdBy = createBy;
    return this;
  }

  // === GETTERS ===
  getId(): number | undefined {
    return this.id;
  }

  getGuid(): number | undefined {
    return this.guid;
  }

  getEmail(): string | undefined {
    return this.email;
  }

  getToken(): string | undefined {
    return this.token;
  }

  getAccount(): number | undefined {
    return this.account;
  }

  getProfile(): number | undefined {
    return this.profile;
  }

  getCreateBy(): number | undefined {
    return this.createdBy;
  }

  // === UTILS ===
  getDisplayEmail(): string {
    const email = this.email || 'Unknown Email';
    return `${email}`;
  }

  getIdentifier(): string {
    return this.guid?.toString() || this.id?.toString() || 'Unknown';
  }

  isNew(): boolean {
    return this.id === undefined;
  }

  // === SERIALIZATION ===
  toJSON(): object {
    return {
      guid: this.guid,
      email: this.email,
      token: this.token,
      account: this.account,
      profile: this.profile,
      createdBy: this.createdBy,
    };
  }

  toString(): string {
    return `User { id: ${this.id}, guid: ${this.guid}, email: "${this.email}", profile: ${this.profile} }`;
  }

  // === HYDRATION ===
  private hydrate(data: any): User {
    this.id = data.id;
    this.guid = data.guid;
    this.email = data.email;
    this.token = data.token;
    this.account = data.account;
    this.profile = data.profile;
    this.createdBy = data.createdBy;
    return this;
  }

  // === PERSISTENCE ===
  async save(): Promise<void> {
    try {
      if (this.isNew()) {
        await this.create();
      } else {
        await this.update();
      }
    } catch (error: any) {
      console.error('❌ Erreur sauvegarde utilisateur:', error.message);
      throw new Error(error);
    }
  }

  async delete(): Promise<boolean> {
    if (this.id !== undefined) {
      return await this.trash(this.id);
    }
    return false;
  }

  async load(identifier: any, byGuid: boolean = false): Promise<User | null> {
    const data = byGuid
      ? await this.findByGuid(identifier)
      : await this.find(Number(identifier));

    if (!data) return null;
    return this.hydrate(data);
  }

  async list(conditions: Record<string, any> = {}): Promise<User[] | null> {
    const dataset = await this.listAll(conditions);
    if (!dataset) return null;
    return dataset.map((data) => new User().hydrate(data));
  }

  // === STATIC HELPERS ===
  static _load(identifier: any, byGuid: boolean = false): Promise<User | null> {
    return new User().load(identifier, byGuid);
  }

  static _list(conditions: Record<string, any> = {}): Promise<User[] | null> {
    return new User().list(conditions);
  }

  static _toObject(data: any): User {
    return new User().hydrate(data);
  }
}
