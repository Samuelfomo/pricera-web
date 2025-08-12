import { Sequelize, ModelStatic, Model } from 'sequelize';
import {ModuleDbStructure} from './data/module.db';
import { ProfileDbStructure } from './data/profile.db';
import { PermissionDbStructure } from './data/permission.db';
// import { UserDbStructure } from './data/user.db';
import { LexiconDbStructure } from './data/lexicon.db';
import CountryDbStructure from './data/country.db';
/**
 * Gestionnaire STATIQUE d'initialisation des tables
 * Responsabilité unique : Initialiser et donner accès aux modèles
 */
export class TableInitializer {
  private static sequelize: Sequelize;
  private static models: Map<string, ModelStatic<Model>> = new Map();
  private static initialized = false;

  /**
   * Initialise toutes les tables (appelé au démarrage de l'app)
   */
  static async initialize(sequelize: Sequelize): Promise<void> {
    if (this.initialized) {
      console.log('⚠️ Tables déjà initialisées');
      return;
    }

    try {
      console.log('🗄️ Début initialisation des tables...');
      this.sequelize = sequelize;

      // 1. Définir tous les modèles
      this.defineAllModels();

      // 2. Synchroniser avec la base de données
      await this.syncAllModels();

      this.initialized = true;
      console.log('✅ Toutes les tables initialisées avec succès');
      console.log(`📊 ${this.models.size} table(s) créée(s)`);
    } catch (error) {
      console.error("❌ Erreur lors de l'initialisation des tables:", error);
      throw error;
    }
  }

  /**
   * Définit tous les modèles à partir des structures
   */
  private static defineAllModels(): void {
    console.log('🏗️ Définition des modèles...');

    // appelle a la def
    this.defineModuleModel();
    this.defineProfileModel();
    this.definePermissionModel();
    // this.defineUserModel();
    this.defineLexiqueModel();
    this.defineCountryModel();
    console.log(`✅ ${this.models.size} modèle(s) défini(s)`);
  }
  // definition method of model module
  private static defineModuleModel(): void {
    const model = this.sequelize.define(
      ModuleDbStructure.tableName,
      ModuleDbStructure.attributes,
      ModuleDbStructure.options
    );

    this.models.set(ModuleDbStructure.tableName, model);
  }

  // definition method of model profile
  private static defineProfileModel(): void {
    const model= this.sequelize.define(
      ProfileDbStructure.tableName,
      ProfileDbStructure.attributes,
      ProfileDbStructure.options,
    );
    this.models.set(ProfileDbStructure.tableName, model);
  }

  // definition method of model permission
  private static definePermissionModel(): void {
    const model = this.sequelize.define(
      PermissionDbStructure.tableName,
      PermissionDbStructure.attributes,
      PermissionDbStructure.options,
    );
    this.models.set(PermissionDbStructure.tableName, model);
  }
  //
  // // definition method of model permission
  // private static defineUserModel(): void {
  //   const model = this.sequelize.define(
  //     UserDbStructure.tableName,
  //     UserDbStructure.attributes,
  //     UserDbStructure.options,
  //   );
  //   this.models.set(UserDbStructure.tableName, model);
  // }

  // definition method of model lexicon
  private static defineLexiqueModel(): void {
    const model = this.sequelize.define(
      LexiconDbStructure.tableName,
      LexiconDbStructure.attributes,
      LexiconDbStructure.options,
    );
    this.models.set(LexiconDbStructure.tableName, model);
  }

  // definition method of model country
  private static defineCountryModel(): void {
    const model =this.sequelize.define(
      CountryDbStructure.tableName,
      CountryDbStructure.attributes,
      CountryDbStructure.options,
    );
    this.models.set(CountryDbStructure.tableName, model);
  }

  /**
   * Synchronise tous les modèles avec la base de données
   */
  private static async syncAllModels(): Promise<void> {
    console.log('🔄 Synchronisation avec la base de données...');

    const isDevelopment = process.env.NODE_ENV !== 'production';
    const syncOptions = isDevelopment ? { alter: true } : {};

    console.error(`🆘 Current Mode: ${process.env.NODE_ENV}`);
    try {
      for (const [tableName, model] of this.models) {
        await model.sync(syncOptions);
        console.log(`✅ Table synchronisée: ${tableName}`);
      }

      console.log('✅ Synchronisation terminée');
    } catch (error) {
      console.error('❌ Erreur lors de la synchronisation:', error);
      throw error;
    }
  }

  // === MÉTHODES D'ACCÈS PUBLIQUES ===

  /**
   * Retourne un modèle spécifique
   */
  static getModel(tableName: string): ModelStatic<Model> {
    if (!this.initialized) {
      throw new Error("TableInitializer non initialisé. Appelez initialize() d'abord.");
    }

    const model = this.models.get(tableName);
    if (!model) {
      const available = Array.from(this.models.keys()).join(', ');
      throw new Error(`Modèle '${tableName}' non trouvé. Disponibles: ${available}`);
    }
    return model;
  }

  /**
   * Retourne tous les modèles
   */
  static getAllModels(): Map<string, ModelStatic<Model>> {
    return new Map(this.models);
  }

  /**
   * Vérifie si les tables sont initialisées
   */
  static isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Statistiques
   */
  static getStats(): {
    initialized: boolean;
    tableCount: number;
    tableNames: string[];
  } {
    return {
      initialized: this.initialized,
      tableCount: this.models.size,
      tableNames: Array.from(this.models.keys()),
    };
  }

  /**
   * Nettoyage des ressources
   */
  static cleanup(): void {
    this.models.clear();
    this.initialized = false;
    console.log('🧹 TableInitializer nettoyé');
  }
}