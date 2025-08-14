import { DataTypes, ModelAttributes, ModelOptions } from 'sequelize';

import G from '../../tools/glossary';

export const SectorDbStructure = {
  tableName: `${G.confTable}sector`,

  attributes: {
    id: {
      type: DataTypes.MEDIUMINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Sector',
    },
    guid: {
      type: DataTypes.MEDIUMINT.UNSIGNED,
      allowNull: false,
      unique: { name: 'unique_sector_guid', msg: 'The sector GUID must be unique' },
      comment: 'Unique, automatically generated digital GUID',
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: { name: 'unique_sector_name', msg: 'The sector NAME must be unique' },
      comment: 'Full name',
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Active status for soft deletion and cache invalidation',
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
    tableName: `${G.confTable}sector`,
    timestamps: true,
    comment: 'Table of sectors',

    indexes: [
      {
        unique: true,
        fields: ['guid'],
        name: 'idx_sector_guid',
      },
      {
        unique: true,
        fields: ['name'],
        name: 'idx_sector_name',
      },
      {
        fields: ['active', 'updated'],
        name: 'idx_sector_cache_invalidation',
      },
    ],
  } as ModelOptions,

  // Méthodes de validation et utilitaires
  validation: {
    /**
     * Valide le nom du secteur
     */
    validateName: (name: string): boolean => {
      const trimmed = name.trim();
      return trimmed.length > 0 && trimmed.length <= 255;
    },

    // validateSectors: async (sectorIdsCsv: string): Promise<boolean> => {
    //   const ids = sectorIdsCsv.split(',').map(id => parseInt(id.trim(), 10));
    //   const validSectors = await Sector.findAll({ where: { id: ids } });
    //   return validSectors.length === ids.length;
    // };

    /**
     * Valide la description
     */
    validateDescription: (description: string | null | undefined): boolean => {
      if (description == null) return true; // Accepte null ou undefined (valeur par défaut)
      return description.trim().length <= 255;
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
      console.log('Data after cleaning:', data);
    },
  },
};