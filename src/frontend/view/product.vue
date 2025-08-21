<template>
  <div class="products-container">
    <Dashboard />

    <!-- Header avec actions -->
    <div class="products-header">
      <div class="header-content">
        <h1 class="page-title">Gestion des Produits</h1>
        <p class="page-subtitle">Gérez votre catalogue de produits</p>
      </div>

      <div class="header-actions">
        <button @click="openCreateModal" class="btn-create">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14m-7-7h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Ajouter un produit
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ products.length }}</div>
          <div class="stat-label">Produits</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ uniqueUniverses }}</div>
          <div class="stat-label">Univers</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ productsWithImages }}</div>
          <div class="stat-label">Avec images</div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>Chargement des produits...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error">
      <div class="error-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
        </svg>
      </div>
      <p>Erreur lors du chargement : {{ error }}</p>
      <button @click="fetchProducts" class="retry-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Réessayer
      </button>
    </div>

    <!-- Products section -->
    <div v-else class="products-section">
      <!-- Products grid -->
      <div v-if="products.length > 0" class="products-grid">
        <ProductCard
          v-for="product in products"
          :key="product.barcode || product.id"
          :product="transformProduct(product)"
          @product-click="openDetailModal"
        />
      </div>

      <!-- Empty state -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h3>Aucun produit trouvé</h3>
        <p>Commencez par ajouter votre premier produit</p>
        <button @click="openCreateModal" class="btn-create">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14m-7-7h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Ajouter un produit
        </button>
      </div>
    </div>

    <!-- Modals -->
    <ProductDetailModal
      v-if="showDetailModal"
      :product="selectedProduct"
      :isVisible="showDetailModal"
      @close="closeDetailModal"
      @edit="openEditModal"
    />

    <ProductCrudModal
      v-if="showCrudModal"
      :isVisible="showCrudModal"
      :mode="crudMode"
      :product="selectedProduct"
      @close="closeCrudModal"
      @submit="handleCrudSubmit"
      @delete="handleDelete"
    />

    <!-- Action buttons flottants (optionnel pour mobile) -->
    <div class="floating-actions">
      <button @click="openCreateModal" class="fab">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14m-7-7h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import ProductService from '@/frontend/service/product.service'
import ProductCard from '@/frontend/view/components/productCard.vue'
// import formProduct from '@/frontend/view/components/formProduct.vue'
// import ProductDetailModal from '@/frontend/view/components/ProductDetailModal.vue'
// import ProductCrudModal from '@/frontend/view/components/ProductCrudModal.vue'
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

// Modal states
const showDetailModal = ref(false)
const showCrudModal = ref(false)
const selectedProduct = ref<Product | null>(null)
const crudMode = ref<'create' | 'edit' | 'delete'>('create')

// Computed properties pour les stats
const uniqueUniverses = computed(() => {
  const universes = new Set()
  products.value.forEach(product => {
    product.universes.forEach(universe => {
      universes.add(universe.nom)
    })
  })
  return universes.size
})

const productsWithImages = computed(() => {
  return products.value.filter(product => product.image).length
})

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
    id: product.id,
    nom: product.name,
    barecode: product.barcode,
    nomenclature: product.nomenclatures.join(', '),
    image: product.image,
    universes: product.universes.map(universe => ({
      nom: universe.nom,
      secteur: universe.sectors.length > 0 ? {
        nom: universe.sectors.map(s => s.nom).join(', '),
        description: universe.sectors
          .filter(s => s.description)
          .map(s => s.description)
          .join(', ') || null
      } : null
    }))
  }
}

// Modal handlers
const openDetailModal = (product: any) => {
  // Trouver le produit complet dans notre liste
  const fullProduct = products.value.find(p => p.id === product.id)
  if (fullProduct) {
    selectedProduct.value = fullProduct
    showDetailModal.value = true
  }
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedProduct.value = null
}

const openCreateModal = () => {
  selectedProduct.value = null
  crudMode.value = 'create'
  showCrudModal.value = true
}

const openEditModal = (product: Product) => {
  selectedProduct.value = product
  crudMode.value = 'edit'
  showDetailModal.value = false
  showCrudModal.value = true
}

const openDeleteModal = (product: Product) => {
  selectedProduct.value = product
  crudMode.value = 'delete'
  showCrudModal.value = true
}

const closeCrudModal = () => {
  showCrudModal.value = false
  selectedProduct.value = null
}

// CRUD operations
const handleCrudSubmit = async (formData: any) => {
  loading.value = true

  try {
    if (formData.mode === 'create') {
      // Appeler l'API pour créer le produit
      console.log('Création du produit:', formData.data)
      // await ProductService.create(formData.data)

      // Simuler la création pour l'exemple
      const newProduct: Product = {
        id: Math.max(...products.value.map(p => p.id), 0) + 1,
        barcode: formData.data.barcode || '',
        name: formData.data.commercialName || formData.data.nomenclatures?.items?.[0] || `Produit-${Date.now()}`,
        image: formData.data.image,
        nomenclatures: formData.data.nomenclatures?.items || [],
        universes: formData.data.universes?.items?.map((u: any) => ({
          nom: u.name,
          sectors: u.sectors?.items?.map((s: any) => ({
            nom: s.name,
            description: s.description
          })) || []
        })) || []
      }

      products.value.push(newProduct)

    } else if (formData.mode === 'edit') {
      // Appeler l'API pour modifier le produit
      console.log('Modification du produit:', formData.productId, formData.data)
      // await ProductService.update(formData.productId, formData.data)

      // Simuler la modification pour l'exemple
      const index = products.value.findIndex(p => p.id === formData.productId)
      if (index !== -1) {
        products.value[index] = {
          ...products.value[index],
          name: formData.data.commercialName || formData.data.nomenclatures?.items?.[0] || products.value[index].name,
          barcode: formData.data.barcode || '',
          image: formData.data.image,
          nomenclatures: formData.data.nomenclatures?.items || [],
          universes: formData.data.universes?.items?.map((u: any) => ({
            nom: u.name,
            sectors: u.sectors?.items?.map((s: any) => ({
              nom: s.name,
              description: s.description
            })) || []
          })) || []
        }
      }
    }

    closeCrudModal()

    // Afficher un message de succès (vous pouvez utiliser une lib comme vue-toastification)
    console.log(formData.mode === 'create' ? 'Produit créé avec succès!' : 'Produit modifié avec succès!')

  } catch (err) {
    console.error('Erreur lors de la sauvegarde:', err)
    error.value = 'Erreur lors de la sauvegarde'
  } finally {
    loading.value = false
  }
}

const handleDelete = async (productData: any) => {
  loading.value = true

  try {
    // Appeler l'API pour supprimer le produit
    console.log('Suppression du produit:', productData.id)
    // await ProductService.delete(productData.id)

    // Simuler la suppression pour l'exemple
    const index = products.value.findIndex(p => p.id === productData.id)
    if (index !== -1) {
      products.value.splice(index, 1)
    }

    closeCrudModal()

    console.log('Produit supprimé avec succès!')

  } catch (err) {
    console.error('Erreur lors de la suppression:', err)
    error.value = 'Erreur lors de la suppression'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.products-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

/* Header */
.products-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  color: #64748b;
  font-size: 16px;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-create {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.6);
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.2);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  color: #3b82f6;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.stat-label {
  color: #64748b;
  font-size: 14px;
  margin-top: 4px;
}

/* Products section */
.products-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

/* Loading state */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  text-align: center;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading p {
  color: #64748b;
  font-size: 16px;
  margin: 0;
}

/* Error state */
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  text-align: center;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.error-icon {
  color: #ef4444;
  margin-bottom: 16px;
}

.error p {
  color: #64748b;
  font-size: 16px;
  margin: 0 0 24px 0;
}

.retry-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-1px);
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  text-align: center;
}

.empty-icon {
  color: #9ca3af;
  margin-bottom: 24px;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.empty-state p {
  color: #6b7280;
  margin: 0 0 32px 0;
  font-size: 16px;
}

/* Floating Action Button */
.floating-actions {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;
}

.fab {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.6);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fab:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 40px rgba(59, 130, 246, 0.8);
}

/* Responsive */
@media (max-width: 768px) {
  .products-container {
    padding: 16px;
  }

  .products-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .products-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .header-actions {
    width: 100%;
  }

  .btn-create {
    width: 100%;
    justify-content: center;
  }

  .fab {
    display: none; /* Masquer le FAB sur mobile car le bouton principal est visible */
  }
}

@media (min-width: 769px) {
  .floating-actions {
    display: none; /* Masquer le FAB sur desktop */
  }
}
</style>