<template>
  <div class="products-container">
    <Dashboard />

    <!-- Loading state -->
    <div v-if="loading" class="loading">
      <p>Chargement des produits...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error">
      <p>Erreur lors du chargement : {{ error }}</p>
      <button @click="fetchProducts" class="retry-btn">Réessayer</button>
    </div>

    <!-- Products grid -->
    <div v-else class="products-grid">
      <ProductCard
        v-for="product in products"
        :key="product.barcode"
        :product="transformProduct(product)"
        @product-click="handleProductClick"
      />
    </div>

    <!-- Empty state -->
    <div v-if="!loading && !error && products.length === 0" class="empty-state">
      <p>Aucun produit trouvé</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProductService from '@/frontend/service/product.service'
import ProductCard from '@/frontend/view/components/productCard.vue'
import Dashboard from '@/frontend/view/components/dashboard.vue'

export interface Product {
  id: number;
  barcode: string;
  name: string;
  image: string | null;
  universes: Array<{
    nom: string;
    sectors: Array<{
      nom: string;
      description: string | null;
    }>;
  }>;
  nomenclatures: string[];
}

const products = ref<Product[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const fetchProducts = async () => {
  loading.value = true
  error.value = null

  try {
    products.value = await ProductService.getAll()
    console.log("Produits récupérés:", products.value)
  } catch (err) {
    error.value = "Impossible de récupérer les produits"
    console.error("Impossible de récupérer les produits", err)
  } finally {
    loading.value = false
  }
}

// Transformer les données du service vers le format attendu par ProductCard
const transformProduct = (product: Product) => {
  return {
    nom: product.name,
    barecode: product.barcode,
    nomenclature: product.nomenclatures.join(', '), // Joindre les nomenclatures
    image: product.image,
    universes: product.universes.map(universe => ({
      nom: universe.nom,
      secteur: universe.sectors.length > 0 ? {
        nom: universe.sectors.map(s => s.nom).join(', '), // Joindre tous les secteurs
        description: universe.sectors
          .filter(s => s.description)
          .map(s => s.description)
          .join(', ') || null
      } : null
    }))
  }
}

const handleProductClick = (product: any) => {
  console.log('Produit sélectionné:', product)
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.products-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.loading, .error, .empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error {
  color: #d32f2f;
}

.retry-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.retry-btn:hover {
  background-color: #1565c0;
}
</style>