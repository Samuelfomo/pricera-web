<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">Détails du produit</h2>
        <button class="close-btn" @click="closeModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="product-header">
          <div class="product-image-large">
            <img
              v-if="product.image"
              :src="product.image"
              :alt="product.nom"
              class="detail-image"
            />
            <div v-else class="no-image-large">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17l2.5-3.21L14 17H9z"/>
              </svg>
              <span>Aucune image</span>
            </div>
          </div>

          <div class="product-main-info">
            <h1 class="product-title">{{ product.nom }}</h1>

            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">ID:</span>
                <span class="info-value">#{{ product.id }}</span>
              </div>

              <div class="info-item" v-if="product.barecode">
                <span class="info-label">Code-barres:</span>
                <span class="info-value">{{ product.barecode }}</span>
              </div>

              <div class="info-item full-width" v-if="product.nomenclature">
                <span class="info-label">Nomenclatures:</span>
                <span class="info-value">{{ product.nomenclature }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Univers et Secteurs -->
        <div v-if="product.universes && product.universes.length > 0" class="universes-section">
          <h3 class="section-title">Univers et Secteurs</h3>
          <div class="universes-grid">
            <div
              v-for="(universe, index) in product.universes"
              :key="index"
              class="universe-card"
            >
              <div class="universe-header">
                <h4 class="universe-title">{{ universe.nom }}</h4>
              </div>

              <div v-if="universe.secteur" class="secteurs-list">
                <div class="secteur-item">
                  <div class="secteur-name">{{ universe.secteur.nom }}</div>
                  <div v-if="universe.secteur.description" class="secteur-description">
                    {{ universe.secteur.description }}
                  </div>
                </div>
              </div>

              <div v-else class="no-secteurs">
                <span>Aucun secteur défini</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-secondary" @click="closeModal">Fermer</button>
        <button class="btn-primary" @click="editProduct">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Modifier
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductDetailModal',
  props: {
    product: {
      type: Object,
      required: true
    },
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'edit'],
  methods: {
    closeModal() {
      this.$emit('close');
    },
    editProduct() {
      this.$emit('edit', this.product);
    }
  },
  mounted() {
    // Empêcher le scroll du body quand la modal est ouverte
    if (this.isVisible) {
      document.body.style.overflow = 'hidden';
    }
  },
  beforeUnmount() {
    // Restaurer le scroll du body
    document.body.style.overflow = 'auto';
  },
  watch: {
    isVisible(newVal) {
      if (newVal) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    }
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
  max-width: 900px;
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

.product-header {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.product-image-large {
  width: 200px;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #e2e8f0;
}

.detail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image-large {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
}

.product-main-info {
  flex: 1;
}

.product-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 20px 0;
  line-height: 1.2;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 16px;
  color: #1e293b;
  font-weight: 500;
  word-break: break-word;
}

.universes-section {
  border-top: 2px solid #f1f5f9;
  padding-top: 24px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.universes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.universe-card {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 1px solid #bae6fd;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
}

.universe-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -8px rgba(59, 130, 246, 0.3);
}

.universe-header {
  margin-bottom: 12px;
}

.universe-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e40af;
  margin: 0;
}

.secteurs-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.secteur-item {
  background: rgba(255, 255, 255, 0.7);
  padding: 12px;
  border-radius: 8px;
  border-left: 3px solid #3b82f6;
}

.secteur-name {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.secteur-description {
  color: #64748b;
  font-size: 14px;
  line-height: 1.4;
}

.no-secteurs {
  color: #94a3b8;
  font-style: italic;
  text-align: center;
  padding: 16px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #f1f5f9;
  background: #f8fafc;
}

.btn-secondary, .btn-primary {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
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

.btn-primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-container {
    margin: 10px;
    max-height: 95vh;
  }

  .product-header {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .product-image-large {
    width: 100%;
    height: 200px;
  }

  .universes-grid {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    flex-direction: column;
  }

  .btn-secondary, .btn-primary {
    justify-content: center;
  }
}
</style>
