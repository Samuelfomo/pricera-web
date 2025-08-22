<template>
  <div class="product-card" @click="$emit('product-click', product)">
    <!-- Image du produit -->
    <div class="product-image-container">
      <img
        v-if="product.image"
        :src="product.image"
        :alt="product.nom"
        class="product-image"
        @error="handleImageError"
      />
      <div v-else class="no-image">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17l2.5-3.21L14 17H9z"/>
        </svg>
        <span>Aucune image</span>
      </div>
    </div>

    <!-- Informations du produit -->
    <div class="product-info">
      <h3 class="product-name">{{ product.nom }}</h3>

      <div class="product-details">
        <div class="detail-item">
          <span class="label">Code-barres:</span>
          <span class="value">{{ product.barecode }}</span>
        </div>

        <div class="detail-item" v-if="product.nomenclature">
          <span class="label">Nomenclature:</span>
          <span class="value">{{ product.nomenclature }}</span>
        </div>
      </div>
      <!-- Univers -->
      <div v-if="product.universes && product.universes.length > 0" class="universes-preview">
        <div class="universes-header">
          <span class="universes-label">Univers:</span>
          <span class="universes-count">({{ product.universes.length }})</span>
        </div>
        <div class="universes-list">
          <div
            v-for="(universe, index) in product.universes.slice(0, 2)"
            :key="index"
            class="universe-badge"
          >
            {{ universe.nom }}
          </div>
          <div v-if="product.universes.length > 2" class="more-universes">
            +{{ product.universes.length - 2 }} autre{{ product.universes.length - 2 > 1 ? 's' : '' }}
          </div>
        </div>
      </div>
      <div class="product-actions">
        <button
          @click.stop="$emit('edit', product)"
          class="action-btn edit-btn"
          title="Modifier"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <button
          @click.stop="$emit('delete', product)"
          class="action-btn delete-btn"
          title="Supprimer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Indicateur de clic -->
      <div class="click-indicator">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/frontend/view/components/header.vue';

export default {
  name: 'ProductCard',
  components: { Header },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  emits: ['product-click', 'edit', 'delete'],
  data() {
    return {
      imageError: false,
    }
  },
  methods: {
    handleImageError(event) {
      // Remplacer par une image par défaut si l'image ne se charge pas
      event.target.style.display = 'none'
      event.target.parentElement.classList.add('error')
    }
  }
}
</script>

<style scoped                                                                                                                                                                           >
.product-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  height: 400px; /* Hauteur fixe pour uniformité */
  display: flex;
  flex-direction: column;
  border: 2px solid transparent;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-color: #3b82f6;
}

.product-card:focus {
  outline: none;
  ring: 2px solid #3b82f6;
  ring-offset: 2px;
}

.product-image-container {
  width: 100%;
  height: 140px; /* Hauteur fixe pour les images */
  border-radius: 12px;
  overflow: hidden;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  border: 1px solid #e2e8f0;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.no-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  font-size: 12px;
}

.product-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.product-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  line-height: 1.3;
  flex: 1;
  min-height: 48px; /* Hauteur minimale pour uniformité */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-id {
  font-size: 12px;
  color: #64748b;
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 500;
  flex-shrink: 0;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-label {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}

.info-value.nomenclature {
  font-size: 12px;
  line-height: 1.4;
}

.universes-preview {
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.universes-header {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
}

.universes-label {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.universes-count {
  font-size: 10px;
  color: #94a3b8;
}

.universes-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.universe-badge {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  color: #1e40af;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  border: 1px solid #bfdbfe;
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.more-universes {
  background: #f1f5f9;
  color: #64748b;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
}

.product-actions {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.2s ease;
}

.product-card:hover .product-actions {
  opacity: 1;
  transform: translateY(0);
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.edit-btn {
  color: #3b82f6;
}

.edit-btn:hover {
  background: #3b82f6;
  color: white;
  transform: scale(1.1);
}

.delete-btn {
  color: #ef4444;
}

.delete-btn:hover {
  background: #ef4444;
  color: white;
  transform: scale(1.1);
}

.click-indicator {
  position: absolute;
  bottom: 16px;
  right: 16px;
  color: #94a3b8;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.2s ease;
}

.product-card:hover .click-indicator {
  opacity: 1;
  transform: translateX(0);
}

/* États de focus et accessibilité */
.product-card:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.action-btn:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

/* Animation de chargement pour les images */
.product-image[src=""] {
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .product-card {
    height: auto;
    min-height: 350px;
  }

  .product-image-container {
    height: 120px;
  }

  .product-title {
    font-size: 16px;
  }

  .product-actions {
    position: relative;
    top: auto;
    right: auto;
    opacity: 1;
    transform: none;
    justify-content: flex-end;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #f1f5f9;
  }

  .click-indicator {
    display: none;
  }
}

/* Mode sombre */
@media (prefers-color-scheme: dark) {
  .product-card {
    background: #334155;
    border-color: #475569;
  }

  .product-card:hover {
    border-color: #60a5fa;
  }

  .product-title {
    color: #f1f5f9;
  }

  .product-id {
    background: #475569;
    color: #cbd5e1;
  }

  .info-label {
    color: #94a3b8;
  }

  .info-value {
    color: #cbd5e1;
  }

  .universe-badge {
    background: rgba(59, 130, 246, 0.2);
    color: #93c5fd;
    border-color: rgba(59, 130, 246, 0.3);
  }

  .more-universes {
    background: #475569;
    color: #94a3b8;
  }

  .action-btn {
    background: rgba(51, 65, 85, 0.9);
  }
}

/* Réduction des animations pour l'accessibilité */
@media (prefers-reduced-motion: reduce) {
  .product-card,
  .product-image,
  .product-actions,
  .click-indicator,
  .action-btn {
    transition: none;
  }

  .product-card:hover .product-image {
    transform: none;
  }
}
</style>