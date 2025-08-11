<template>
  <div class="min-h-screen bg-gradient-to-br bg-stone-200">
    <Header />
    <dashboard />
    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">-->
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
    </svg>
    <span>Retour</span>

    <!-- Contenu principal -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- État de chargement -->
      <div v-if="isLoading" class="flex justify-center items-center min-h-96">
        <div class="text-center">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p class="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>

      <!-- Erreur de chargement -->
      <div v-else-if="loadError" class="text-center py-12">
        <div class="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
          <svg class="h-16 w-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <h3 class="text-lg font-semibold text-red-800 mb-2">Erreur de chargement</h3>
          <p class="text-red-600 mb-4">{{ loadError }}</p>
          <button
            @click="loadFormData"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>

      <!-- Formulaire -->
      <div v-else class="space-y-8">

        <!-- Section langue et texte -->
        <div class="bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg p-8">

          <h2 class="text-lg font-semibold text-gray-900 mb-8 flex items-center">
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
            </svg>
            Nouvelle référence
          </h2>

          <!-- Champ référence flexible (toute la largeur) -->
          <div class="mb-8">
            <div class="space-y-2">
              <label for="reference" class="block text-sm font-medium text-gray-700">
                Référence *
              </label>
              <input
                id="reference"
                v-model="form.reference"
                type="text"
                placeholder="Ex: welcomeMessage, loginButton..."
                :class="[
                  'block w-full px-4 py-3 border rounded-xl transition-all duration-200 font-mono',
                  errors.reference
                    ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-200 bg-white/80 focus:ring-blue-500 focus:border-blue-500'
                ]"
                @blur="validateReference"
              >
              <p v-if="errors.reference" class="text-sm text-red-600 flex items-center mt-2">
                <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ errors.reference }}
              </p>
              <p v-else class="text-sm text-gray-500 mt-2">
                Identifiant unique pour cette référence lexicale
              </p>
            </div>
          </div>

          <!-- Section langue et configuration avec plus d'espace -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <!-- Sélecteur de langue -->
            <div class="space-y-2">
              <label for="langue" class="block text-sm font-medium text-gray-700">
                Langue *
              </label>
              <select
                id="langue"
                v-model="form.selectedLanguage"
                :disabled="mode === 'edit'"
                :class="[
                  'block w-full px-4 py-3 border rounded-xl transition-all duration-200',
                  mode === 'edit'
                    ? 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed'
                    : 'border-gray-200 bg-white/80 focus:ring-blue-500 focus:border-blue-500'
                ]"
              >
                <option value="" disabled>Choisir une langue</option>
                <option
                  v-for="(config, code) in availableLanguages"
                  :key="code"
                  :value="code"
                >
                  {{ config.drapeau }} {{ config.nom }}
                </option>
              </select>
              <p class="text-sm text-gray-500 mt-2">
                {{ mode === 'edit' ? 'Langue fixée pour cette modification' : 'Sélectionnez la langue du texte' }}
              </p>
            </div>

            <!-- Configuration exportabilité mobile - centrée à gauche -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Configuration
              </label>
              <div class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6 border border-gray-200">
                <div class="flex items-start">
                  <label class="flex items-start cursor-pointer">
                    <input
                      v-model="form.portable"
                      type="checkbox"
                      class="sr-only"
                    >
                    <div
                      :class="[
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 flex-shrink-0',
                        form.portable ? 'bg-blue-600' : 'bg-gray-300'
                      ]"
                    >
                      <span
                        :class="[
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
                          form.portable ? 'translate-x-6' : 'translate-x-1'
                        ]"
                      />
                    </div>
                    <div class="ml-4">
                      <span class="text-sm font-medium text-gray-900 block">Exportable vers mobile</span>
                      <p class="text-xs text-gray-500 mt-1">Cette référence pourra être utilisée dans l'app mobile</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Zone de texte avec plus d'espace -->
          <div class="space-y-2 mb-8">
            <label for="texte" class="block text-sm font-medium text-gray-700">
              Texte en {{ form.selectedLanguage ? LANGUES_CONFIG[form.selectedLanguage].nom : '...' }} *
            </label>
            <textarea
              id="texte"
              v-model="form.texte"
              rows="6"
              :placeholder="getTextPlaceholder()"
              :class="[
                'block w-full px-4 py-3 border rounded-xl transition-all duration-200 resize-none',
                errors.texte
                  ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-200 bg-white/80 focus:ring-blue-500 focus:border-blue-500'
              ]"
              @blur="validateTexte"
            ></textarea>
            <div class="flex justify-between items-center mt-2">
              <p v-if="errors.texte" class="text-sm text-red-600 flex items-center">
                <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ errors.texte }}
              </p>
              <p v-else class="text-sm text-gray-500">
                Saisissez le texte qui sera affiché pour cette référence
              </p>
            </div>
          </div>

          <!-- Boutons d'action bien espacés et positionnés -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-6 border-t border-gray-200">
            <!-- Bouton Annuler à gauche -->
            <button
              @click="goBack"
              class="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-gray-700 order-2 sm:order-1"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              <span>Annuler</span>
            </button>

            <!-- Section droite avec validation et bouton principal -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 order-1 sm:order-2">
              <!-- Informations de validation -->
              <div v-if="hasErrors" class="text-sm text-red-600 flex items-center">
                <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Veuillez corriger les erreurs</span>
              </div>

              <!-- Bouton principal -->
              <button
                @click="handleSubmit"
                :disabled="!canSubmit || isSubmitting"
                :class="[
                      'flex items-center space-x-2 px-8 py-3 rounded-xl transition-all duration-200 font-medium text-lg whitespace-nowrap',
                      canSubmit && !isSubmitting
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                    ]"
              >
                <svg v-if="isSubmitting" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>{{ getSubmitButtonText() }}</span>
              </button>
            </div>
          </div>

        </div>

        <!-- Aperçu (si mode édition) -->
        <div v-if="mode === 'edit' && currentEntry" class="bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg p-8">
          <h2 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            Comparaison avant/après
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Texte actuel -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Texte actuel
              </label>
              <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-32">
                <p class="text-gray-900 whitespace-pre-wrap">{{ currentText }}</p>
              </div>
            </div>

            <!-- Nouveau texte -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Nouveau texte
              </label>
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 min-h-32">
                <p class="text-gray-900 whitespace-pre-wrap">{{ form.texte || 'Aucun texte saisi...' }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>

    <!-- Notifications Toast -->
    <div
      v-if="notification.show"
      :class="[
        'fixed top-4 right-4 p-4 rounded-xl shadow-xl z-50 transition-all duration-300 transform max-w-md',
        notification.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
        {
          'bg-green-500 text-white': notification.type === 'success',
          'bg-red-500 text-white': notification.type === 'error',
          'bg-blue-500 text-white': notification.type === 'info',
          'bg-yellow-500 text-white': notification.type === 'warning'
        }
      ]"
    >
      <div class="flex items-start space-x-3">
        <svg v-if="notification.type === 'success'" class="h-6 w-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        <svg v-else-if="notification.type === 'error'" class="h-6 w-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        <svg v-else-if="notification.type === 'warning'" class="h-6 w-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <svg v-else class="h-6 w-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <div class="flex-1">
          <p class="font-medium">{{ notification.message }}</p>
          <p v-if="notification.detail" class="text-sm opacity-90 mt-1">{{ notification.detail }}</p>
        </div>
        <button @click="hideNotification" class="flex-shrink-0 ml-4">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Dashboard from '@/frontend/components/dashboard.vue';
import Header from '@/frontend/components/header.vue';

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

type FormMode = 'create' | 'edit' | 'translate';

// Configuration des langues
const LANGUES_CONFIG: Record<TranslationEntry['langue'], { nom: string; drapeau: string; code: string }> = {
  fr: { nom: 'Français', drapeau: '🇫🇷', code: 'fr' },
  en: { nom: 'English', drapeau: '🇺🇸', code: 'en' },
  es: { nom: 'Español', drapeau: '🇪🇸', code: 'es' },
  de: { nom: 'Deutsch', drapeau: '🇩🇪', code: 'de' },
};

// Router et route
const router = useRouter();
const route = useRoute();

// États réactifs
const mode = ref<FormMode>('create');
const isLoading = ref(false);
const loadError = ref<string | null>(null);
const isSubmitting = ref(false);
const currentEntry = ref<LexiconEntry | null>(null);
const currentText = ref('');

// Données du formulaire
const form = ref({
  reference: '',
  selectedLanguage: '' as TranslationEntry['langue'] | '',
  texte: '',
  portable: false
});

// Erreurs de validation
const errors = ref({
  reference: '',
  texte: ''
});

// Notifications
const notification = ref({
  show: false,
  message: '',
  detail: '',
  type: 'info' as 'success' | 'error' | 'warning' | 'info'
});

// Computed properties
const hasErrors = computed(() => {
  return Object.values(errors.value).some(error => error !== '');
});

const canSubmit = computed(() => {
  if (mode.value === 'create') {
    return form.value.reference.trim() !== '' &&
        form.value.selectedLanguage !== '' &&
        form.value.texte.trim() !== '' &&
        !hasErrors.value;
  } else {
    return form.value.selectedLanguage !== '' &&
        form.value.texte.trim() !== '' &&
        !hasErrors.value;
  }
});

const availableLanguages = computed(() => {
  if (mode.value === 'translate' && currentEntry.value) {
    // En mode traduction, exclure les langues déjà présentes
    const existingLanguages = getAvailableLanguages(currentEntry.value);
    return Object.fromEntries(
        Object.entries(LANGUES_CONFIG).filter(([code]) =>
            !existingLanguages.includes(code as TranslationEntry['langue'])
        )
    );
  }
  return LANGUES_CONFIG;
});

// Méthodes utilitaires
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

// Méthodes de texte dynamique
const getPageTitle = (): string => {
  switch (mode.value) {
    case 'create': return 'Nouvelle référence';
    case 'edit': return 'Modifier texte';
    case 'translate': return 'Ajouter traduction';
    default: return '';
  }
};

const getFormTitle = (): string => {
  switch (mode.value) {
    case 'create': return 'Créer une nouvelle référence lexicale';
    case 'edit': return 'Modifier le texte existant';
    case 'translate': return 'Ajouter une nouvelle traduction';
    default: return '';
  }
};

const getFormDescription = (): string => {
  switch (mode.value) {
    case 'create': return 'Définissez un nouvel identifiant de référence avec son premier texte';
    case 'edit': return 'Modifiez le contenu textuel pour cette langue';
    case 'translate': return 'Ajoutez une traduction dans une nouvelle langue';
    default: return '';
  }
};

const getSubmitButtonText = (): string => {
  if (isSubmitting.value) {
    switch (mode.value) {
      case 'create': return 'Création...';
      case 'edit': return 'Modification...';
      case 'translate': return 'Ajout...';
      default: return 'Traitement...';
    }
  }

  switch (mode.value) {
    case 'create': return 'Créer la référence';
    case 'edit': return 'Sauvegarder les modifications';
    case 'translate': return 'Ajouter la traduction';
    default: return 'Enregistrer';
  }
};

const getTextPlaceholder = (): string => {
  if (!form.value.selectedLanguage) {
    return 'Sélectionnez d\'abord une langue...';
  }

  const langName = LANGUES_CONFIG[form.value.selectedLanguage].nom;
  switch (mode.value) {
    case 'create': return `Saisissez le texte initial en ${langName}...`;
    case 'edit': return `Modifiez le texte en ${langName}...`;
    case 'translate': return `Saisissez la traduction en ${langName}...`;
    default: return `Texte en ${langName}...`;
  }
};

// Méthodes de validation
const validateReference = () => {
  if (mode.value !== 'create') return;

  const reference = form.value.reference.trim();

  if (!reference) {
    errors.value.reference = 'La référence est obligatoire';
    return;
  }

  if (reference.length < 2) {
    errors.value.reference = 'La référence doit contenir au moins 2 caractères';
    return;
  }

  // Validation du format (optionnel)
  const validFormat = /^[a-zA-Z][a-zA-Z0-9_]*$/.test(reference);
  if (!validFormat) {
    errors.value.reference = 'Format invalide (lettres, chiffres, _ uniquement, commencer par une lettre)';
    return;
  }

  errors.value.reference = '';

  // Vérification de l'unicité (appel asynchrone)
  checkReferenceUniqueness(reference);
};

const validateTexte = () => {
  const texte = form.value.texte.trim();

  if (!texte) {
    errors.value.texte = 'Le texte est obligatoire';
    return;
  }

  if (texte.length < 1) {
    errors.value.texte = 'Le texte doit contenir au moins 1 caractère';
    return;
  }

  errors.value.texte = '';
};

// Méthodes d'interaction
const goBack = () => {
  router.push('/lexicon');
};

const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', detail?: string) => {
  notification.value = { show: true, message, type, detail: detail || '' };
  setTimeout(() => {
    notification.value.show = false;
  }, 5000);
};

const hideNotification = () => {
  notification.value.show = false;
};

const saveDraft = async () => {
  // Fonctionnalité de sauvegarde de brouillon (optionnelle)
  showNotification('Brouillon sauvegardé localement', 'info', 'Vos modifications sont temporairement conservées');
};

// Méthodes principales
const loadFormData = async () => {
  isLoading.value = true;
  loadError.value = null;

  try {
    // Déterminer le mode en fonction de la route
    const { entryId, language } = route.params;

    if (route.path.includes('/create')) {
      mode.value = 'create';
      form.value.selectedLanguage = 'fr'; // Langue par défaut
    } else if (route.path.includes('/edit') && entryId && language) {
      mode.value = 'edit';
      form.value.selectedLanguage = language as TranslationEntry['langue'];

      // Charger l'entrée existante
      currentEntry.value = await loadEntry(parseInt(entryId as string));
      currentText.value = getTexteByLangue(currentEntry.value, form.value.selectedLanguage);
      form.value.texte = currentText.value;

    } else if (route.path.includes('/translate') && entryId) {
      mode.value = 'translate';

      // Charger l'entrée existante
      currentEntry.value = await loadEntry(parseInt(entryId as string));
    }

  } catch (error) {
    console.error('Erreur lors du chargement:', error);
    loadError.value = error instanceof Error ? error.message : 'Erreur inconnue';
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async () => {
  // Validation finale
  validateReference();
  validateTexte();

  if (!canSubmit.value) {
    showNotification('Veuillez corriger les erreurs avant de continuer', 'error');
    return;
  }

  isSubmitting.value = true;

  try {
    switch (mode.value) {
      case 'create':
        await createNewEntry();
        break;
      case 'edit':
        await updateExistingText();
        break;
      case 'translate':
        await addNewTranslation();
        break;
    }

  } catch (error) {
    console.error('Erreur lors de la soumission:', error);
    showNotification(
        'Erreur lors de l\'enregistrement',
        'error',
        error instanceof Error ? error.message : 'Erreur inconnue'
    );
  } finally {
    isSubmitting.value = false;
  }
};

// Méthodes du contrôleur (stubs - à remplacer par vos vraies méthodes)
const loadEntry = async (entryId: number): Promise<LexiconEntry> => {
  // TODO: Remplacer par l'appel réel au contrôleur
  throw new Error('loadEntry non implémentée');
};

const checkReferenceUniqueness = async (reference: string) => {
  // TODO: Vérifier l'unicité de la référence
  // Si non unique, définir errors.value.reference
};

const createNewEntry = async () => {
  // TODO: Appel au contrôleur pour créer une nouvelle entrée
  const entryData = {
    reference: form.value.reference,
    translation: { [form.value.selectedLanguage]: form.value.texte },
    portable: form.value.portable
  };

  // Simuler l'appel
  showNotification(
      `Référence "${form.value.reference}" créée avec succès`,
      'success',
      `Texte en ${LANGUES_CONFIG[form.value.selectedLanguage].nom} ajouté`
  );

  // Rediriger après un délai
  setTimeout(() => {
    router.push('/lexicon');
  }, 2000);
};

const updateExistingText = async () => {
  // TODO: Appel au contrôleur pour mettre à jour le texte
  if (!currentEntry.value) return;

  const updateData = {
    entryId: currentEntry.value.id,
    language: form.value.selectedLanguage,
    text: form.value.texte
  };

  showNotification(
      'Texte modifié avec succès',
      'success',
      `Mise à jour en ${LANGUES_CONFIG[form.value.selectedLanguage].nom}`
  );

  setTimeout(() => {
    router.push('/lexicon');
  }, 2000);
};

const addNewTranslation = async () => {
  // TODO: Appel au contrôleur pour ajouter une traduction
  if (!currentEntry.value) return;

  const translationData = {
    entryId: currentEntry.value.id,
    language: form.value.selectedLanguage,
    text: form.value.texte
  };

  showNotification(
      'Traduction ajoutée avec succès',
      'success',
      `Nouvelle traduction en ${LANGUES_CONFIG[form.value.selectedLanguage].nom}`
  );

  setTimeout(() => {
    router.push('/lexicon');
  }, 2000);
};

// Cycle de vie
onMounted(() => {
  loadFormData();
});
</script>

<style scoped>
/* Classes utilitaires personnalisées */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animations personnalisées */
@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Styles pour les champs de formulaire */
input:focus, textarea:focus, select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Transition pour les éléments interactifs */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Styles pour le switch personnalisé */
input[type="checkbox"]:checked + div {
  background-color: #2563eb;
}

input[type="checkbox"]:checked + div span {
  transform: translateX(1.5rem);
}
</style>