import { DataTypes, ModelAttributes, ModelOptions } from 'sequelize';
import G from '../../tools/glossary';

export const UserDbStructure = {
  tableName: `${G.appTable}user`,
  attributes: {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      comment: 'User',
    },
    guid: {
      type: DataTypes.MEDIUMINT.UNSIGNED,
      allowNull: false,
      unique: {name: "unique_user_guid", msg: 'The user guid must be unique'},
      comment: 'user guid generate automatically',
    },
    email: {
      type: DataTypes.STRING(70),
      allowNull: false,
      unique: {name: "unique_user_email", msg: 'The user email must be unique'},
      comment: 'user email',
    },
    token: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: {name: "unique_token", msg: 'The user token is unique'},
      comment: 'user token',
    },
    account: {
      type: DataTypes.MEDIUMINT.UNSIGNED,
      allowNull: true,
      references: {
        model: `${G.appTable}account`,
        key: 'id',
      },
      comment: 'Account',
    },
    profile: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      references: {
        model: `${G.confTable}profile`,
        key: 'id',
      },
      comment: 'Profile',
    },
    createdBy: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: `${G.appTable}user`,
        key: 'id',
      },
      comment: 'User who created this account',
    },
  } as ModelAttributes,

  options: {
    tableName: `${G.appTable}user`,
    timestamps: true,
    comment: 'User accounts table',
    indexes: [
      {
        fields: ['guid'],
        name: 'idx_user_guid',
      },
      {
        fields: ['email'],
        name: 'idx_user_email',
      },
      {
        fields: ["token"],
        name: 'idx_user_token'
      },
      {
        fields: ['profile'],
        name: 'idx_user_profile',
      },
      {
        fields: ['account'],
        name: 'idx_user_account',
      },
      {
        fields: ['createdBy'],
        name: 'idx_user_created_by',
      }
    ]
  } as ModelOptions,

  // méthodes de validation
  validation: {
    validationEmail(email: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const trimmed = email.trim().toLowerCase();
      // Correction: longueur max 70 au lieu de 5
      return trimmed.length >= 5 && trimmed.length <= 70 && emailRegex.test(trimmed);
    },
    validateToken(token: string): boolean {
      const trimmed = token.trim();
      return trimmed.length >= 10 && trimmed.length <= 100;
    }
  }
}