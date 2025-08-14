import { DataTypes, ModelAttributes, ModelOptions } from 'sequelize';

import G from '../../tools/glossary';

export const UniverseDbStructure = {
  tableName: `${G.confTable}universe`,

  attributes: {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: `Universe`,
    },
    guid: {
      type: DataTypes.MEDIUMINT.UNSIGNED,
      allowNull: false,
      unique: { name: 'unique_univers_guid', msg: 'The univers GUID must be unique' },
      comment: 'Unique, automatically generated digital GUID',
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: { name: 'unique_univers_name', msg: 'The univers name must be unique' },
      comment: 'Full name',
    },
    // ✅ Changement : sectors en JSONB pour stocker un array d'IDs de secteurs
    sector: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      comment: 'Array of sector IDs associated',
      validate: {
        isValidSectorsArray(value: any) {
          if (!Array.isArray(value)) {
            throw new Error('Sectors must be an array');
          }
          if (value.some((id) => !Number.isInteger(id) || id <= 0)) {
            throw new Error('All sector IDs must be positive integers');
          }
        },
      },
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Detailed description',
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
      comment: 'Updated',
    }
  } as ModelAttributes,

  options: {
    tableName: `${G.confTable}universe`,
    timestamps: true,
    comment: 'Table of universe',

    indexes: [
      {
        unique: true,
        fields: ['guid'],
        name: 'idx_univers_guid',
      },
      {
        unique: true,
        fields: ['name'],
        name: 'idx_univers_name',
      },
      {
        fields: ['sector'],
        name: 'idx_univers_sectors_gin',
      },
      {
        fields: ['updated'],
        name: 'idx_univers_cache_invalidation',
      },
    ],
  } as ModelOptions,

  // Méthodes de validation et utilitaires
  validation: {
    /**
     * Valide le nom de l'univers
     */
    validateName: (name: string): boolean => {
      const trimmed = name.trim();
      return trimmed.length > 0 && trimmed.length <= 100;
    },

    /**
     * Valide la description
     */
    validateDescription: (description: string | null | undefined): boolean => {
      if (description == null) return true;
      return description.trim().length <= 255;
    },

    /**
     * Valide le tableau des secteurs
     */
    validateSectors: (sectors: number[]): boolean => {
      if (!Array.isArray(sectors)) return false;
      if (sectors.length === 0) return false; // Au moins un secteur requis
      return sectors.every((id) => Number.isInteger(id) && id > 0);
    },

    /**
     * Nettoie les données avant insertion/update
     */
    cleanData: (data: any): void => {
      if (data.name && typeof data.name === 'string') {
        data.name = data.name.trim();
      }
      if (data.description && typeof data.description === 'string') {
        data.description = data.description.trim();
      }
      if (data.sectors && Array.isArray(data.sectors)) {
        // Supprimer les doublons et s'assurer que ce sont des entiers
        data.sectors = [...new Set(data.sectors.map((id: any) => parseInt(id, 10)))].filter(
          (id: any) => !isNaN(id)
        );
      }
      console.log('Data after cleaning:', data);
    },
  },
};