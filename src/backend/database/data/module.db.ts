import { DataTypes, ModelAttributes, ModelOptions } from 'sequelize';
import G from '../../tools/glossary';

export const ModuleDbStructure = {

          // creation des tables avec attributs
  tableName: `${G.confTable}module`,
  attributes: {
    id: {
      type: DataTypes.SMALLINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Module',
    },
    guid: {
      type: DataTypes.MEDIUMINT.UNSIGNED,
      allowNull: false,
      unique: {name:"unique_module_guid", msg:"The module guid must be unique"},
      comment: 'Guid',
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {name:"module_name", msg:"Module name"},
      comment: 'Name',
    },
    code: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      unique: {name:"module_code", msg:"Module code"},
      comment: 'Code',
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Active',
    },
    description: {
      type: DataTypes.STRING(300),
      allowNull: true,
      comment: 'Description',
    },
  } as ModelAttributes,

        // configuration pour les recherches  facile avec indexe
  options: {
    tableName: `${G.confTable}module`,
    timestamps: true,
    comment: 'Module',
    indexes: [
      {
        unique: true,
        fields: ['guid'],
        name: 'idx_module_guid',
      },
      {
        unique: true,
        fields: ['name'],
        name: 'idx_module_name',
      },
      {
        unique: true,
        fields: ['code'],
        name: 'idx_module_code',
      },
    ],
  } as ModelOptions,

          // methodes de validation

  validateName(name: string): boolean  {
    const trimmed = name.trim();
    return trimmed.length >= 2 && trimmed.length <= 128;
  },

  validateDescription(description: string) :boolean  {
    const trimmed = description.trim();
    return trimmed.length >= 2 && trimmed.length <= 300;
  },

  // nettoyage des donees

  cleanData: (data: any): void => {
    if (data.name) {
      data.name = data.name.trim();
    }

  }

}



export default ModuleDbStructure;