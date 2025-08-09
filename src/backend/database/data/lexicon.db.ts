import G from '../../tools/glossary';
import { DataTypes, ModelAttributes, ModelOptions } from 'sequelize';


export const LexiconDbStructure = {
  tableName: `${G.confTable}lexicon`,

  attributes: {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Lexicon',
    },
    guid: {
      type: DataTypes.MEDIUMINT.UNSIGNED,
      allowNull: false,
      unique: { name: 'unique_lexicon_guid', msg: 'The lexicon GUID must be unique' },
      comment: 'GUID',
    },
    translation: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: 'Translation',
    },
    reference: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: { name: 'unique_lexicon_reference', msg: 'The lexicon reference must be unique' },
      comment: 'Reference must be in another language',
    },
    portable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Active',
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
      comment: 'Updated',
    }

  } as ModelAttributes,

  options: {
    tableName: `${G.confTable}lexicon`,
    timestamps: false,
    comment: 'Table lexicon',
    indexes: [
      {
        fields: ['guid'],
        name: 'idx_country_guid',
      },
      {
        fields: ['translation'],
        name: 'idx_lexicon_translation',
      },
      {
        fields: ['reference'],
        name: 'idx_lexicon_reference',
      }
    ],
  } as ModelOptions,
};