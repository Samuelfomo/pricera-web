<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <Header />
    <dashboard />

    <!-- Header -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <h1 class="text-4xl font-semibold bg-[#283a52] bg-clip-text text-transparent">
          Gestion du Lexique
        </h1>
        <button
          @click="openCreateForm"
          class="flex items-center space-x-2 bg-gradient-to-r from-blue-500 hover:to-purple-700 px-6 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          <span>Nouvelle référence</span>
        </button>
      </div>
    </div>

    <!-- Contenu -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center items-center min-h-96">
        <div class="text-center">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p class="text-gray-600 font-medium">Chargement des données...</p>
          <p class="text-gray-400 text-sm mt-1">Récupération depuis l'API</p>
        </div>
      </div>

      <!-- Erreur -->
      <div v-else-if="loadError" class="text-center py-12">
        <div class="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
          <h3 class="text-lg font-semibold text-red-800 mb-2">Erreur de chargement</h3>
          <p class="text-red-600 mb-4">{{ loadError }}</p>
          <button
            @click="reloadData"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>

      <!-- Liste vide -->
      <div v-else-if="filteredEntries.length === 0 && !searchQuery" class="text-center py-16">
        <h3 class="text-xl font-semibold text-gray-600 mb-2">Aucune référence créée</h3>
        <p class="text-gray-400 mb-6">Commencez par créer votre première référence lexicale</p>
        <button
          @click="openCreateForm"
          class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl transition-all duration-200 shadow-lg font-medium"
        >
          Créer ma première référence
        </button>
      </div>

      <!-- Aucun résultat -->
      <div v-else-if="filteredEntries.length === 0 && searchQuery" class="text-center py-16">
        <h3 class="text-lg font-semibold text-gray-600 mb-2">Aucun résultat trouvé</h3>
        <p class="text-gray-400 mb-4">Aucune référence ne correspond à "{{ searchQuery }}"</p>
        <button @click="clearSearch" class="text-blue-600 hover:text-blue-700 font-medium">
          Effacer la recherche
        </button>
      </div>

      <!-- Tableau -->
      <div v-else>
        <table class="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 text-left">Référence</th>
            <th class="px-4 py-2 text-left">Langues disponible</th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="entry in paginatedEntries"
            :key="entry.id"
            class="border-b hover:bg-gray-50"
          >
            <!-- Référence -->
            <td class="px-4 py-2 font-mono font-semibold text-gray-900">
              {{ entry.reference }}
            </td>

            <!-- Langues -->
            <td class="px-4 py-2">
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="langue in getAvailableLanguages(entry)"
                  :key="langue"
                  @click="openEditForm(entry, langue)"
                  :title="`${LANGUES_CONFIG[langue].nom}: ${getTexteByLangue(entry, langue)}`"
                  class="flex items-center gap-1 px-2 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition"
                >
                  <span class="text-lg">{{ LANGUES_CONFIG[langue].drapeau }}</span>
<!--                  <span class="text-sm">{{ LANGUES_CONFIG[langue].nom }}</span>-->
                </button>
              </div>
            </td>

            <!-- Actions -->
            <td class="px-4 py-2 text-center">
              <div class="flex justify-center items-center gap-3">

                <!-- Icône mobile (à gauche) -->
                <button @click="toggleMobileExport(entry)" :title="'Activer/Désactiver mobile'">
                  <svg
                    v-if="entry.portable"
                    class="h-6 w-6 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 15a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                  <svg
                    v-else
                    class="h-6 w-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M7 4h10a1 1 0 011 1v14a1 1 0 01-1 1H7a1 1 0 01-1-1V5a1 1 0 011-1z" />
                  </svg>
                </button>

                <!-- Bouton Traduire -->
                <button
                  @click="openTranslateForm(entry)"
                  class="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg text-sm transition flex items-center gap-2"
                >
                  Traduire
                </button>

                <!-- Icône poubelle (à droite) -->
                <button
                  @click="confirmDelete(entry)"
                  :title="'Supprimer la référence'"
                  class="text-red-500 hover:text-red-700 transition"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3H4m16 0H4" />
                  </svg>
                </button>

              </div>
            </td>
          </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div
          v-if="filteredEntries.length > itemsPerPage"
          class="flex justify-center mt-6"
        >
          <nav class="flex items-center space-x-2">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition',
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white hover:bg-gray-50 text-gray-700 shadow border border-gray-200'
              ]"
            >
              Précédent
            </button>

            <div class="flex items-center space-x-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'w-10 h-10 rounded-lg font-medium transition',
                  page === currentPage
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow'
                    : 'bg-white hover:bg-gray-50 text-gray-700 shadow border border-gray-200'
                ]"
              >
                {{ page }}
              </button>
            </div>

            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition',
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white hover:bg-gray-50 text-gray-700 shadow border border-gray-200'
              ]"
            >
              Suivant
            </button>
          </nav>
        </div>
      </div>
    </main>

    <!-- Modal et notifications inchangés -->
  </div>
</template>



<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import Header from "@/frontend/view/components/header.vue";
import Dashboard from '@/frontend/view/components/dashboard.vue';
import { fetchData } from '@/frontend/Ctr/lexicon.ts';

// Types
interface TranslationEntry {
  langue: 'fr' | 'en' | 'es' | 'de';
  texte: string;
}

interface LexiconEntry {
  id: number;
  reference: string;
  translation: TranslationEntry[];
  portable: boolean;
}

// Configuration des langues
const LANGUES_CONFIG: Record<TranslationEntry['langue'], { nom: string; drapeau: string; code: string }> = {
  fr: { nom: 'Français', drapeau: '🇫🇷', code: 'fr' },
  en: { nom: 'English', drapeau: '🇺🇸', code: 'en' },
  es: { nom: 'Español', drapeau: '🇪🇸', code: 'es' },
  de: { nom: 'Deutsch', drapeau: '🇩🇪', code: 'de' },
};

// Router
const router = useRouter();

// États réactifs
const entries = ref<LexiconEntry[]>([]);
const searchQuery = ref('');
const isLoading = ref(true);
const loadError = ref<string | null>(null);

// Pagination
const currentPage = ref(1);
const itemsPerPage = 12;

// États pour les interactions
const activeMenuId = ref<number | null>(null);
const showDeleteConfirm = ref(false);
const entryToDelete = ref<LexiconEntry | null>(null);

// Notifications
const notification = ref({
  show: false,
  message: '',
  type: 'info' as 'success' | 'error' | 'warning' | 'info'
});

// Statistiques
const statistics = computed(() => ({
  totalEntries: entries.value.length,
  totalTranslations: entries.value.reduce((sum, entry) => sum + entry.translation.length, 0),
  averageTranslationsPerEntry: entries.value.length > 0
      ? Math.round((entries.value.reduce((sum, entry) => sum + entry.translation.length, 0) / entries.value.length) * 10) / 10
      : 0
}));

// Entrées filtrées par la recherche
const filteredEntries = computed(() => {
  if (!searchQuery.value.trim()) {
    return entries.value;
  }

  const query = searchQuery.value.toLowerCase();
  return entries.value.filter(entry =>
      entry.reference.toLowerCase().includes(query) ||
      entry.translation.some(t => t.texte.toLowerCase().includes(query))
  );
});

// Pagination calculée
const totalPages = computed(() => Math.ceil(filteredEntries.value.length / itemsPerPage));

const paginatedEntries = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredEntries.value.slice(start, end);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  const start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages.value, start + maxVisible - 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

// Méthodes utilitaires pour les traductions
const getAvailableLanguages = (entry: LexiconEntry): TranslationEntry['langue'][] => {
  if (!entry.translation || !Array.isArray(entry.translation)) {
    return [];
  }
  return entry.translation.map(t => t.langue);
};

const getTexteByLangue = (entry: LexiconEntry, langue: TranslationEntry['langue']): string => {
  if (!entry.translation || !Array.isArray(entry.translation)) {
    return '';
  }
  const texte = entry.translation.find(t => t.langue === langue);
  return texte ? texte.texte : '';
};

// Méthodes de navigation
const openCreateForm = () => {
  router.push('/lexicon/create');
};

const openEditForm = (entry: LexiconEntry, langue: TranslationEntry['langue']) => {
  router.push(`/lexicon/edit/${entry.id}/${langue}`);
};

const openTranslateForm = (entry: LexiconEntry) => {
  router.push(`/lexicon/translate/${entry.id}`);
};

// Méthodes de recherche et pagination
const handleSearch = () => {
  currentPage.value = 1;
};

const clearSearch = () => {
  searchQuery.value = '';
  currentPage.value = 1;
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const goToPage = (page: number) => {
  currentPage.value = page;
};

// Méthodes pour les menus et actions
const toggleEntryMenu = (entryId: number) => {
  activeMenuId.value = activeMenuId.value === entryId ? null : entryId;
};

const closeMenus = () => {
  activeMenuId.value = null;
};

// Méthodes pour les notifications
const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
  notification.value = { show: true, message, type };
  setTimeout(() => {
    notification.value.show = false;
  }, 4000);
};

const hideNotification = () => {
  notification.value.show = false;
};

// Méthodes pour la suppression
const confirmDelete = (entry: LexiconEntry) => {
  entryToDelete.value = entry;
  showDeleteConfirm.value = true;
  closeMenus();
};

const cancelDelete = () => {
  showDeleteConfirm.value = false;
  entryToDelete.value = null;
};

const executeDelete = async () => {
  if (!entryToDelete.value) return;

  try {
    // Appel au contrôleur pour supprimer l'entrée
    await deleteEntry(entryToDelete.value.id);

    // Retirer l'entrée de la liste locale
    entries.value = entries.value.filter(e => e.id !== entryToDelete.value!.id);

    showNotification(`Référence "${entryToDelete.value.reference}" supprimée avec succès`, 'success');

    // Ajuster la pagination si nécessaire
    if (paginatedEntries.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
    }
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    showNotification('Erreur lors de la suppression de la référence', 'error');
  } finally {
    showDeleteConfirm.value = false;
    entryToDelete.value = null;
  }
};

// Méthode pour basculer l'exportabilité mobile
const toggleMobileExport = async (entry: LexiconEntry) => {
  try {
    const newPortableState = !entry.portable;

    // Appel au contrôleur pour mettre à jour l'état
    await updateEntryPortableState(entry.id, newPortableState);

    // Mettre à jour l'entrée locale
    const index = entries.value.findIndex(e => e.id === entry.id);
    if (index !== -1) {
      entries.value[index] = { ...entries.value[index], portable: newPortableState };
    }

    showNotification(
        `Export mobile ${newPortableState ? 'activé' : 'désactivé'} pour "${entry.reference}"`,
        'success'
    );
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    showNotification('Erreur lors de la mise à jour de l\'exportabilité', 'error');
  } finally {
    closeMenus();
  }
};

// Méthodes du contrôleur (à implémenter selon votre architecture)
const loadEntries = async () => {
  try {
    isLoading.value = true;
    loadError.value = null;

    // Appel au contrôleur pour charger les données
    entries.value = await fetchData();

  } catch (error) {
    console.error('Erreur lors du chargement:', error);
    loadError.value = error instanceof Error ? error.message : 'Erreur inconnue';
  } finally {
    isLoading.value = false;
  }
};

const reloadData = () => {
  loadEntries();
};

// Méthodes du contrôleur (stubs - à remplacer par vos vraies méthodes)
const fetchAllEntries = async (): Promise<LexiconEntry[]> => {
  // TODO: Remplacer par l'appel réel au contrôleur
  throw new Error('fetchAllEntries non implémentée');
};

const deleteEntry = async (entryId: number): Promise<void> => {
  // TODO: Remplacer par l'appel réel au contrôleur
  throw new Error('deleteEntry non implémentée');
};

const updateEntryPortableState = async (entryId: number, portable: boolean): Promise<void> => {
  // TODO: Remplacer par l'appel réel au contrôleur
  throw new Error('updateEntryPortableState non implémentée');
};

// Gestionnaire de clics extérieurs pour fermer les menus
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Element;
  if (!target.closest('.relative')) {
    closeMenus();
  }
};

// Cycle de vie du composant
onMounted(() => {
  loadEntries();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animation pour les transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Scrollbar custom pour les zones de défilement */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>