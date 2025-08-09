import LexiconModel from '../model/LexiconModel';

export default class Lexicon extends LexiconModel {
  constructor() {
    super();
  }

  // ============ SETTERS ============

  setGuid(guid: number): Lexicon {
    this.guid = guid;
    return this;
  }

  setTranslation(translation: object): Lexicon {
    this.translation = translation;
    return this;
  }

  setReference(reference: string): Lexicon {
    this.reference = reference;
    return this;
  }

  setPortable(portable: boolean): Lexicon {
    this.portable = portable;
    return this;
  }

  setUpdated(updated: Date): Lexicon {
    this.updated = updated;
    return this;
  }

  // ============ GETTERS ============

  getId(): number | undefined {
    return this.id;
  }

  getGuid(): number | undefined {
    return this.guid;
  }

  getTranslation(): object | undefined {
    return this.translation;
  }

  getReference(): string | undefined {
    return this.reference;
  }

  getPortable(): boolean | undefined {
    return this.portable;
  }

  getUpdated(): Date | undefined {
    return this.updated;
  }

  // ============ AFFICHAGE ============


  toString(): string {
    return `Lexique {id: ${this.id}, guid: ${this.guid}, translation: ${this.translation}, reference: ${this.reference}, portable: ${this.portable}}`;
  }

  // ============ HYDRATATION ============

  private hydrate(data: any): Lexicon {
    this.id = data.id;
    this.guid = data.guid;
    this.translation = data.translation;
    this.reference = data.reference;
    this.portable = data.portable;
    this.updated = data.updated;
    return this;
  }

  // ============ LOGIQUE MÉTIER ============

  isNew(): boolean {
    return this.id === undefined;
  }

  async save(): Promise<void> {
    try {
      if (this.isNew()) {
        await this.create();
      } else {
        await this.update();
      }
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde du lexique:', error.message);
      throw new Error(error.message);
    }
  }

  async delete(): Promise<void> {
    if (this.id !== undefined) {
      await this.trash(this.id);
    }
  }

  async load(identifier: any, byGuid: boolean = false): Promise<Lexicon | null> {
    let data;

    if (byGuid) {
      data = await this.findByGuid(identifier);
    } else {
      data = await this.find(Number(identifier));
    }

    if (!data) return null;
    return new Lexicon().hydrate(data);
  }

  async list(conditions: Record<string, any> = {}): Promise<Lexicon[] | null> {
    const dataset = await this.listAll(conditions);
    if (!dataset) return null;
    return dataset.map((data) => new Lexicon().hydrate(data));
  }

  toJSON(): object {
    return {
      guid: this.guid,
      translation: this.translation,
      reference: this.reference,
      portable: this.portable,
    };
  }

  // ============ MÉTHODES STATIQUES ============

  static _load(identifier: any, byGuid: boolean = false): Promise<Lexicon | null> {
    return new Lexicon().load(identifier, byGuid);
  }

  static _list(conditions: Record<string, any> = {}): Promise<Lexicon[] | null> {
    return new Lexicon().list(conditions);
  }

  static _toObject(data: any): Lexicon {
    return new Lexicon().hydrate(data);
  }

  static async _deleteAll(): Promise<boolean> {
    return await new Lexicon().trashAll()
  }
}
