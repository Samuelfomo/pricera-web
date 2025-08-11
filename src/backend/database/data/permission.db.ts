import { DataTypes, ModelOptions } from 'sequelize';
import G from '../../tools/glossary';

export const PermissionDbStructure = {
  tableName: `${G.confTable}permission`,
  attributes: {
    id: {
      type: DataTypes.SMALLINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment:"Permission",
    },
    guid: {
      type: DataTypes.MEDIUMINT.UNSIGNED,
      allowNull: false,
      unique: {name: "unique_permission_guid", msg: 'Permission GUID is required'},
      comment:"automatically generated",
    },
    code: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique:{ name: "unique_permission_code", msg: 'Permission code'},
      comment:"Unique code for a permission",
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: { name: "unique_permission_name", msg: 'Permission name' },
      comment:"Permission name",
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment:"Permission description",
    },
    module: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      references: {
        model: `${G.confTable}module`,
        key: 'id',
      },
      comment:"Module",
    },
    profile: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      references: {
        model: `${G.confTable}profile`,
        key: 'id',
      },
      comment:"Profile",
    }
  },

  options: {
    tableName: `${G.confTable}permission`,
    timestamps: true,
    comment: 'Permission table',
    indexes: [
      {
        unique:true,
        fields: ['guid'],
        name: 'idx_permission_guid',
      },
      {
        unique:true,
        fields: ['code'],
        name: 'idx_permission_code',
      },
      {
        fields: ['module'],
        name: 'idx_permission_module',
      },
      {
        fields: ['profile'],
        name: 'idx_permission_profile',
      },
      {
        fields: ['module', 'profile'],
        name: 'idx_permission_module_profile',
      }
    ]
  } as ModelOptions,

  // validation method

  }