import { DataTypes, ModelAttributes, ModelOptions } from 'sequelize';
import G from '../../tools/glossary';


export const ProfileDbStructure = {
  tableName: `${G.confTable}profile`,
  attributes: {
    id: {
      type: DataTypes.SMALLINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Profile',
    },
    guid: {
      type: DataTypes.MEDIUMINT.UNSIGNED,
      allowNull: false,
      unique: { name: "unique_profile_guid", msg: 'The profile GUID must be unique' },
      comment: 'Profile GUID automatically generated',
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: { name: "unique_profile_name", msg: 'The profile name must be unique' },
      comment: 'Profile name',
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Profile image URL',
    },
    root: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      comment: 'Root indicator',
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: { name: "unique_profile_level", msg: 'The level profile must be unique' },
      comment: 'hierarchical profile level',
    },

  } as ModelAttributes,

  options: {
    tableName: `${G.confTable}profile`,
    timestamps: true,
    comment: "profile",
    indexes: [
      {
        unique: true,
        fields: ['guid'],
        name: 'idx_profile_guid',
      },

      {
        unique: true,
        fields: ['name'],
        name: 'idx_profile_name',
      },


      {
        unique: true,
        fields: ['level'],
        name: 'idx_profile_level',
      },
      {
        unique: true,
        fields: ['root'],
        name: 'idx_profile_root',
      }
    ],
  } as ModelOptions,



                       // Validation method

  validateGuid(guid: string): boolean {
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return guidRegex.test(guid);
  },

  validation: {
    validateName(name: string): boolean {
      const trimmed = name.trim();
      return trimmed.length >= 2 &&
        trimmed.length <= 100 &&
        /^[a-zA-ZÀ-ÿ0-9\s\-_]+$/.test(trimmed);
    },
    validateLevel(level: number): boolean {
      return Number.isInteger(level) && level >= 0 && level <= 100;
    },

  },
}
