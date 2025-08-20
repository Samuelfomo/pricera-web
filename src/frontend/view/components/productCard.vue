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
      <div v-if="product.universes && product.universes.length > 0" class="universes">
        <h4 class="universes-title">Univers:</h4>
        <div class="universes-list">
          <div
            v-for="(universe, index) in product.universes"
            :key="index"
            class="universe-item"
          >
            <div class="universe-name">{{ universe.nom }}</div>
            <div v-if="universe.secteur" class="secteur">
              <div class="secteur-name">{{ universe.secteur.nom }}</div>
              <div v-if="universe.secteur.description" class="secteur-description">
                {{ universe.secteur.description }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  emits: ['product-click'],
  methods: {
    handleImageError(event) {
      // Remplacer par une image par défaut si l'image ne se charge pas
      event.target.style.display = 'none'
      event.target.parentElement.classList.add('error')
    }
  }
}
</script>

<style scoped>
.product-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #1976d2;
}

.product-image-container {
  width: 100%;
  height: 200px;
  margin-bottom: 16px;
  border-radius: 4px;
  overflow: hidden;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image, .product-image-container.error {
  color: #999;
  font-size: 14px;
}

.product-info {
  text-align: left;
}

.product-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #333;
  line-height: 1.3;
}

.product-details {
  margin-bottom: 16px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.label {
  font-weight: 500;
  color: #666;
  flex-shrink: 0;
  margin-right: 8px;
}

.value {
  color: #333;
  text-align: right;
  word-break: break-word;
}

.universes {
  border-top: 1px solid #eee;
  padding-top: 12px;
}

.universes-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
}

.universes-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.universe-item {
  background-color: #f8f9fa;
  padding: 8px;
  border-radius: 4px;
  border-left: 3px solid #1976d2;
}

.universe-name {
  font-weight: 500;
  color: #1976d2;
  font-size: 14px;
  margin-bottom: 4px;
}

.secteur {
  margin-left: 8px;
}

.secteur-name {
  font-weight: 500;
  color: #333;
  font-size: 13px;
  margin-bottom: 2px;
}

.secteur-description {
  color: #666;
  font-size: 12px;
  line-height: 1.3;
  font-style: italic;
}

/* Responsive */
@media (max-width: 768px) {
  .product-card {
    margin-bottom: 16px;
  }

  .detail-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .value {
    text-align: left;
    margin-top: 2px;
  }
}
</style>