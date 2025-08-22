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
            <path
              d="M12 5v14m-7-7h14"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
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
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
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
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            />
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
            <path
              d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"
              stroke="currentColor"
              stroke-width="2"
            />
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ productsWithImages }}</div>
          <div class="stat-label">Avec images</div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading && products.length === 0" class="loading">
      <div class="loading-spinner"></div>
      <p>Chargement des produits...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error">
      <div class="error-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </div>
      <p>Erreur lors du chargement : {{ error }}</p>
      <button @click="fetchProducts" class="retry-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M1 4v6h6M23 20v-6h-6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Réessayer
      </button>
    </div>

    <!-- Products section -->
    <div v-else class="products-section">
      <!-- Empty state -->
      <div v-if="products.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <h3>Aucun produit trouvé</h3>
        <p>Commencez par ajouter votre premier produit</p>
        <button @click="openCreateModal" class="btn-create">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5v14m-7-7h14"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
          Ajouter un produit
        </button>
      </div>

      <!-- Products grid -->
      <div v-else class="products-grid">
        <ProductCard
          v-for="product in products"
          :key="getProductKey(product)"
          :product="transformProduct(product)"
          @product-click="openDetailModal"
          @edit="openEditModal"
          @delete="openDeleteModal"
        />
      </div>
    </div>

    <!-- Modals -->
    <ProductDetailModal
      v-if="showDetailModal && selectedProduct"
      :product="transformProduct(selectedProduct)"
      :is-visible="showDetailModal"
      @close="closeDetailModal"
      @edit="openEditModal"
    />

    <ProductCrudModal
      v-if="showCrudModal"
      :is-visible="showCrudModal"
      :mode="crudMode"
      :product="selectedProduct ? transformProduct(selectedProduct) : null"
      @close="closeCrudModal"
      @submit="handleCrudSubmit"
      @delete="handleDelete"
    />

    <!-- Floating Action Button (mobile uniquement) -->
    <div class="floating-actions">
      <button
        @click="openCreateModal"
        class="fab"
        aria-label="Ajouter un produit"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 5v14m-7-7h14"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>

    <!-- Toast notifications -->
    <div v-if="notification" class="notification" :class="notification.type">
      <span>{{ notification.message }}</span>
      <button @click="clearNotification" class="notification-close">×</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import ProductService from '@/frontend/service/product.service'
import ProductCard from '@/frontend/view/components/productCard.vue'
import detailProduct from '@/frontend/view/components/detailProduct.vue'
import formProduct from '@/frontend/view/components/formProduct.vue'
import Dashboard from '@/frontend/view/components/dashboard.vue'

export default {
  name: 'ProductsPage',
  components: {
    ProductCard,
    detailProduct,
    formProduct,
    Dashboard
  },
  setup() {
    // State
    const products = ref([])
    const loading = ref(false)
    const error = ref(null)

    // Modal states
    const showDetailModal = ref(false)
    const showCrudModal = ref(false)
    const selectedProduct = ref(null)
    const crudMode = ref('create')

    // Notification state
    const notification = ref(null)

    // Computed properties pour les stats
    const uniqueUniverses = computed(() => {
      const universes = new Set()
      products.value.forEach(product => {
        product.universes?.forEach(universe => {
          universes.add(universe.nom)
        })
      })
      return universes.size
    })

    const productsWithImages = computed(() => {
      return products.value.filter(product => product.image).length
    })

    // Utility functions
    const getProductKey = (product) => {
      return product.barcode || product.id || `product-${Math.random()}`
    }

    const showNotification = (message, type = 'success') => {
      notification.value = { message, type }
      setTimeout(() => {
        notification.value = null
      }, 5000)
    }

    const clearNotification = () => {
      notification.value = null
    }

    // API calls
    const fetchProducts = async () => {
      loading.value = true
      error.value = null

      try {
        const data = await ProductService.getAll()
        products.value = Array.isArray(data) ? data : []
        console.log("Produits récupérés:", products.value)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Impossible de récupérer les produits"
        error.value = errorMessage
        console.error("Erreur lors de la récupération des produits:", err)
        showNotification("Erreur lors du chargement des produits", 'error')
      } finally {
        loading.value = false
      }
    }

    // Transformer les données du service vers le format attendu par ProductCard
    const transformProduct = (product) => {
      if (!product) return null

      return {
        id: product.id,
        nom: product.name || 'Produit sans nom',
        commercialName: product.name,
        barecode: product.barcode || '',
        nomenclature: product.nomenclatures?.join(', ') || '',
        image: product.image,
        universes: product.universes?.map(universe => ({
          nom: universe.nom,
          secteur: universe.sectors?.length > 0 ? {
            nom: universe.sectors.map(s => s.nom).join(', '),
            description: universe.sectors
              .filter(s => s.description)
              .map(s => s.description)
              .join(', ') || null
          } : null
        })) || []
      }
    }

    // Modal handlers
    const openDetailModal = (productData) => {
      if (!productData?.id) return

      const fullProduct = products.value.find(p => p.id === productData.id)
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

    const openEditModal = (product) => {
      // Si product est déjà transformé (depuis ProductCard), trouver le produit original
      const originalProduct = products.value.find(p => p.id === product.id) || product
      selectedProduct.value = originalProduct
      crudMode.value = 'edit'
      showDetailModal.value = false
      showCrudModal.value = true
    }

    const openDeleteModal = (product) => {
      const originalProduct = products.value.find(p => p.id === product.id) || product
      selectedProduct.value = originalProduct
      crudMode.value = 'delete'
      showCrudModal.value = true
    }

    const closeCrudModal = () => {
      showCrudModal.value = false
      selectedProduct.value = null
    }

    // CRUD operations
    const handleCrudSubmit = async (formData) => {
      if (!formData?.data) {
        showNotification('Données de formulaire invalides', 'error')
        return
      }

      loading.value = true

      try {
        if (formData.mode === 'create') {
          console.log('Création du produit:', formData.data)

          // Créer un nouvel ID unique
          const maxId = products.value.length > 0 ? Math.max(...products.value.map(p => p.id)) : 0

          const newProduct = {
            id: maxId + 1,
            barcode: formData.data.barcode || '',
            name: formData.data.commercialName ||
              (formData.data.nomenclatures?.items?.[0]) ||
              `Produit-${Date.now()}`,
            image: formData.data.image || null,
            nomenclatures: formData.data.nomenclatures?.items || [],
            universes: formData.data.universes?.items?.map((u) => ({
              nom: u.name || '',
              sectors: u.sectors?.items?.map((s) => ({
                nom: s.name || '',
                description: s.description || null
              })) || []
            })) || []
          }

          products.value.push(newProduct)
          showNotification('Produit créé avec succès!')

        } else if (formData.mode === 'edit' && formData.productId) {
          console.log('Modification du produit:', formData.productId, formData.data)

          const index = products.value.findIndex(p => p.id === formData.productId)
          if (index !== -1) {
            products.value[index] = {
              ...products.value[index],
              name: formData.data.commercialName ||
                (formData.data.nomenclatures?.items?.[0]) ||
                products.value[index].name,
              barcode: formData.data.barcode || '',
              image: formData.data.image || null,
              nomenclatures: formData.data.nomenclatures?.items || [],
              universes: formData.data.universes?.items?.map((u) => ({
                nom: u.name || '',
                sectors: u.sectors?.items?.map((s) => ({
                  nom: s.name || '',
                  description: s.description || null
                })) || []
              })) || []
            }
            showNotification('Produit modifié avec succès!')
          } else {
            throw new Error('Produit non trouvé')
          }
        }

        closeCrudModal()

      } catch (err) {
        console.error('Erreur lors de la sauvegarde:', err)
        const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde'
        showNotification(errorMessage, 'error')
      } finally {
        loading.value = false
      }
    }

    const handleDelete = async (productData) => {
      if (!productData?.id) {
        showNotification('ID de produit invalide', 'error')
        return
      }

      loading.value = true

      try {
        console.log('Suppression du produit:', productData.id)

        const index = products.value.findIndex(p => p.id === productData.id)
        if (index !== -1) {
          const deletedProduct = products.value.splice(index, 1)[0]
          showNotification(`Produit "${deletedProduct.name}" supprimé avec succès!`)
        } else {
          throw new Error('Produit non trouvé')
        }

        closeCrudModal()

      } catch (err) {
        console.error('Erreur lors de la suppression:', err)
        const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression'
        showNotification(errorMessage, 'error')
      } finally {
        loading.value = false
      }
    }

    // Lifecycle
    onMounted(() => {
      fetchProducts()
    })

    return {
      products,
      loading,
      error,
      showDetailModal,
      showCrudModal,
      selectedProduct,
      crudMode,
      notification,
      uniqueUniverses,
      productsWithImages,
      getProductKey,
      showNotification,
      clearNotification,
      fetchProducts,
      transformProduct,
      openDetailModal,
      closeDetailModal,
      openCreateModal,
      openEditModal,
      openDeleteModal,
      closeCrudModal,
      handleCrudSubmit,
      handleDelete
    }

    }
  }
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

.btn-create:focus {
  outline: none;
  ring: 2px solid #3b82f6;
  ring-offset: 2px;
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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

.retry-btn:focus {
  outline: none;
  ring: 2px solid #ef4444;
  ring-offset: 2px;
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

.fab:focus {
  outline: none;
  ring: 2px solid #3b82f6;
  ring-offset: 2px;
}

/* Notifications */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  padding: 16px 20px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 300px;
  animation: slideIn 0.3s ease;
}

.notification.success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.notification.error {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.notification.warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.notification-close {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  margin-left: auto;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
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

  .notification {
    min-width: auto;
    right: 16px;
    left: 16px;
  }
}

@media (min-width: 769px) {
  .floating-actions {
    display: none; /* Masquer le FAB sur desktop */
  }
}

/* Améliorations d'accessibilité */
@media (prefers-reduced-motion: reduce) {
  .loading-spinner {
    animation: none;
  }

  .stat-card,
  .btn-create,
  .fab {
    transition: none;
  }
}

/* Mode sombre (optionnel) */
@media (prefers-color-scheme: dark) {
  .products-container {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  }

  .products-header,
  .products-section,
  .stat-card,
  .loading,
  .error {
    background: #334155;
    color: #f1f5f9;
  }

  .page-title {
    color: #f1f5f9;
  }

  .page-subtitle,
  .stat-label {
    color: #94a3b8;
  }

  .stat-number {
    color: #f1f5f9;
  }
}
</style>