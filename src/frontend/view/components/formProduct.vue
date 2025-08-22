<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">
          <span v-if="mode === 'create'">Ajouter un produit</span>
          <span v-else-if="mode === 'edit'">Modifier le produit</span>
          <span v-else>Supprimer le produit</span>
        </h2>
        <button class="close-btn" @click="closeModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <!-- Formulaire de suppression -->
        <div v-if="mode === 'delete'" class="delete-confirmation">
          <div class="warning-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
            </svg>
          </div>
          <h3>Êtes-vous sûr de vouloir supprimer ce produit ?</h3>
          <p class="product-name">{{ formData.name || 'Produit sans nom' }}</p>
          <p class="warning-text">Cette action est irréversible.</p>
        </div>

        <!-- Formulaire de création/modification -->
        <form v-else @submit.prevent="submitForm" class="product-form">
          <div class="form-grid">
            <!-- Nom commercial -->
            <div class="form-group full-width">
              <label class="form-label" for="commercialName">
                Nom commercial
                <span class="optional">(optionnel)</span>
              </label>
              <input
                id="commercialName"
                v-model="formData.commercialName"
                type="text"
                class="form-input"
                placeholder="Entrez le nom commercial du produit"
              />
            </div>

            <!-- Code-barres -->
            <div class="form-group">
              <label class="form-label" for="barcode">
                Code-barres
                <span class="optional">(optionnel)</span>
              </label>
              <input
                id="barcode"
                v-model="formData.barcode"
                type="text"
                class="form-input"
                placeholder="Ex: 1234567890123"
              />
            </div>

            <!-- Image URL -->
            <div class="form-group">
              <label class="form-label" for="image">
                URL de l'image
                <span class="optional">(optionnel)</span>
              </label>
              <input
                id="image"
                v-model="formData.image"
                type="url"
                class="form-input"
                placeholder="https://exemple.com/image.jpg"
              />
            </div>

            <!-- Nomenclatures -->
            <div class="form-group full-width">
              <label class="form-label">
                Nomenclatures
                <span class="required">*</span>
              </label>
              <div class="nomenclature-container">
                <div
                  v-for="(nomenclature, index) in formData.nomenclatures"
                  :key="index"
                  class="nomenclature-item"
                >
                  <input
                    v-model="formData.nomenclatures[index]"
                    type="text"
                    class="form-input"
                    :placeholder="`Nomenclature ${index + 1}`"
                    required
                  />
                  <button
                    type="button"
                    @click="removeNomenclature(index)"
                    class="remove-btn"
                    :disabled="formData.nomenclatures.length === 1"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </button>
                </div>
                <button
                  type="button"
                  @click="addNomenclature"
                  class="add-btn"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14m-7-7h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Ajouter une nomenclature
                </button>
              </div>
            </div>

            <!-- Univers -->
            <div class="form-group full-width">
              <label class="form-label">
                Univers
                <span class="required">*</span>
              </label>
              <div class="universes-container">
                <div
                  v-for="(universe, index) in formData.universes"
                  :key="index"
                  class="universe-item"
                >
                  <div class="universe-header">
                    <input
                      v-model="universe.nom"
                      type="text"
                      class="form-input"
                      :placeholder="`Nom de l'univers ${index + 1}`"
                      required
                    />
                    <button
                      type="button"
                      @click="removeUniverse(index)"
                      class="remove-btn"
                      :disabled="formData.universes.length === 1"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                    </button>
                  </div>

                  <!-- Secteurs de l'univers -->
                  <div class="sectors-container">
                    <label class="sector-label">Secteurs de cet univers:</label>
                    <div
                      v-for="(sector, sectorIndex) in universe.sectors"
                      :key="sectorIndex"
                      class="sector-item"
                    >
                      <input
                        v-model="sector.nom"
                        type="text"
                        class="form-input sector-input"
                        :placeholder="`Nom du secteur ${sectorIndex + 1}`"
                        required
                      />
                      <textarea
                        v-model="sector.description"
                        class="form-textarea"
                        :placeholder=" `Nom du secteur ${sectorIndex + 1}`"
                        rows="2">
                      </textarea>
                      <button
                        type="button"
                        @click="removeSector(index, sectorIndex)"
                        class="remove-btn small"
                        :disabled="universe.sectors.length === 1"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                      </button>
                    </div>
                    <button
                      type="button"
                      @click="addSector(index)"
                      class="add-btn small"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14m-7-7h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      Ajouter un secteur
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  @click="addUniverse"
                  class="add-btn"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14m-7-7h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Ajouter un univers
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button class="btn-secondary" @click="closeModal">
          Annuler
        </button>

        <button
          v-if="mode === 'delete'"
          @click="confirmDelete"
          class="btn-danger"
          :disabled="loading"
        >
          <svg v-if="loading" width="16" height="16" viewBox="0 0 24 24" fill="none" class="loading-icon">
            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span v-else>Supprimer</span>
        </button>

        <button
          v-else
          @click="submitForm"
          class="btn-primary"
          :disabled="loading || !isFormValid"
        >
          <svg v-if="loading" width="16" height="16" viewBox="0 0 24 24" fill="none" class="loading-icon">
            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span v-else>
            {{ mode === 'create' ? 'Créer' : 'Sauvegarder' }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCrudModal',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String, // 'create', 'edit', 'delete'
      required: true,
      validator: value => ['create', 'edit', 'delete'].includes(value)
    },
    product: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'submit', 'delete'],
  data() {
    return {
      loading: false,
      formData: {
        commercialName: '',
        barcode: '',
        image: '',
        nomenclatures: [''],
        universes: [{
          nom: '',
          sectors: [{
            nom: '',
            description: ''
          }]
        }]
      }
    }
  },
  computed: {
    isFormValid() {
      if (this.mode === 'delete') return true;

      // Vérifier qu'au moins une nomenclature est remplie
      const hasNomenclature = this.formData.nomenclatures.some(n => n.trim() !== '');

      // Vérifier qu'au moins un univers avec secteur est rempli
      const hasUniverse = this.formData.universes.some(u =>
        u.nom.trim() !== '' && u.sectors.some(s => s.nom.trim() !== '')
      );

      return hasNomenclature && hasUniverse;
    }
  },
  watch: {
    isVisible(newVal) {
      if (newVal) {
        this.initializeForm();
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    }
  },
  methods: {
    initializeForm() {
      if (this.mode === 'edit' && this.product) {
        // Pré-remplir le formulaire avec les données du produit
        this.formData = {
          commercialName: this.product.commercialName || '',
          barcode: this.product.barecode || '',
          image: this.product.image || '',
          nomenclatures: this.product.nomenclature ?
            this.product.nomenclature.split(', ').filter(n => n.trim() !== '') :
            [''],
          universes: this.product.universes?.length > 0 ?
            this.product.universes.map(u => ({
              nom: u.nom,
              sectors: u.secteur ? [{
                nom: u.secteur.nom,
                description: u.secteur.description || ''
              }] : [{
                nom: '',
                description: ''
              }]
            })) :
            [{
              nom: '',
              sectors: [{
                nom: '',
                description: ''
              }]
            }]
        };
      } else if (this.mode === 'delete' && this.product) {
        this.formData = {
          name: this.product.nom,
          id: this.product.id
        };
      } else {
        // Réinitialiser pour création
        this.formData = {
          commercialName: '',
          barcode: '',
          image: '',
          nomenclatures: [''],
          universes: [{
            nom: '',
            sectors: [{
              nom: '',
              description: ''
            }]
          }]
        };
      }
    },

    closeModal() {
      this.$emit('close');
    },

    async submitForm() {
      if (!this.isFormValid) return;

      this.loading = true;

      try {
        // Nettoyer les données avant envoi
        const cleanData = {
          commercialName: this.formData.commercialName?.trim() || null,
          barcode: this.formData.barcode?.trim() || null,
          image: this.formData.image?.trim() || null,
          nomenclatures: {
            items: this.formData.nomenclatures
              .filter(n => n.trim() !== '')
              .map(n => n.trim())
          },
          universes: {
            items: this.formData.universes
              .filter(u => u.nom.trim() !== '')
              .map(u => ({
                name: u.nom.trim(),
                sectors: {
                  items: u.sectors
                    .filter(s => s.nom.trim() !== '')
                    .map(s => ({
                      name: s.nom.trim(),
                      description: s.description?.trim() || null
                    }))
                }
              }))
          }
        };

        this.$emit('submit', {
          mode: this.mode,
          data: cleanData,
          productId: this.mode === 'edit' ? this.product?.id : null
        });

      } catch (error) {
        console.error('Erreur lors de la soumission:', error);
      } finally {
        this.loading = false;
      }
    },

    async confirmDelete() {
      this.loading = true;

      try {
        this.$emit('delete', {
          id: this.product?.id,
          name: this.product?.nom
        });
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      } finally {
        this.loading = false;
      }
    },

    // Méthodes pour gérer les nomenclatures
    addNomenclature() {
      this.formData.nomenclatures.push('');
    },

    removeNomenclature(index) {
      if (this.formData.nomenclatures.length > 1) {
        this.formData.nomenclatures.splice(index, 1);
      }
    },

    // Méthodes pour gérer les univers
    addUniverse() {
      this.formData.universes.push({
        nom: '',
        sectors: [{
          nom: '',
          description: ''
        }]
      });
    },

    removeUniverse(index) {
      if (this.formData.universes.length > 1) {
        this.formData.universes.splice(index, 1);
      }
    },

    // Méthodes pour gérer les secteurs
    addSector(universeIndex) {
      this.formData.universes[universeIndex].sectors.push({
        nom: '',
        description: ''
      });
    },

    removeSector(universeIndex, sectorIndex) {
      if (this.formData.universes[universeIndex].sectors.length > 1) {
        this.formData.universes[universeIndex].sectors.splice(sectorIndex, 1);
      }
    }
  },

  beforeUnmount() {
    document.body.style.overflow = 'auto';
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f1f5f9;
  color: #334155;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  max-height: calc(90vh - 160px);
}

/* Confirmation de suppression */
.delete-confirmation {
  text-align: center;
  padding: 32px 16px;
}

.warning-icon {
  color: #ef4444;
  margin-bottom: 24px;
}

.delete-confirmation h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.delete-confirmation .product-name {
  font-size: 18px;
  font-weight: 700;
  color: #ef4444;
  margin: 0 0 16px 0;
  padding: 12px;
  background: #fef2f2;
  border-radius: 8px;
  border: 1px solid #fecaca;
}

.warning-text {
  color: #64748b;
  font-style: italic;
}

/* Formulaire */
.product-form {
  width: 100%;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.required {
  color: #ef4444;
}

.optional {
  color: #9ca3af;
  font-weight: 400;
  font-size: 12px;
}

.form-input, .form-textarea {
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  background: white;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input:invalid {
  border-color: #ef4444;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* Nomenclatures */
.nomenclature-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nomenclature-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.nomenclature-item .form-input {
  flex: 1;
}

/* Univers */
.universes-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.universe-item {
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
}

.universe-header {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 16px;
}

.universe-header .form-input {
  flex: 1;
}

.sectors-container {
  margin-left: 16px;
  padding-left: 16px;
  border-left: 2px solid #cbd5e1;
}

.sector-label {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 12px;
  display: block;
}

.sector-item {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  margin-bottom: 12px;
  align-items: start;
}

.sector-input {
  grid-column: 1;
}

.form-textarea {
  grid-column: 1;
}

.sector-item .remove-btn {
  grid-column: 2;
  grid-row: 1;
}

/* Boutons */
.remove-btn, .add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-btn {
  background: #fef2f2;
  color: #dc2626;
  padding: 8px;
}

.remove-btn:hover:not(:disabled) {
  background: #fecaca;
}

.remove-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.remove-btn.small {
  padding: 6px;
}

.add-btn {
  background: #eff6ff;
  color: #2563eb;
}

.add-btn:hover {
  background: #dbeafe;
}

.add-btn.small {
  font-size: 12px;
  padding: 6px 10px;
}

/* Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #f1f5f9;
  background: #f8fafc;
}

.btn-secondary, .btn-primary, .btn-danger {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  font-size: 14px;
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-1px);
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-1px);
}

.btn-primary:disabled, .btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .modal-container {
    margin: 10px;
    max-height: 95vh;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    flex-direction: column;
  }

  .btn-secondary, .btn-primary, .btn-danger {
    justify-content: center;
  }

  .sector-item {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .sector-item .remove-btn {
    grid-column: 1;
    grid-row: 3;
    justify-self: end;
    width: fit-content;
  }
}
</style>
