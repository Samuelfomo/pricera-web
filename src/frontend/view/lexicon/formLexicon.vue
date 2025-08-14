<template>
  <div class="min-h-screen bg-gradient-to-br bg-stone-200">
    <Header />
    <Dashboard />

    <!-- Navigation breadcrumb -->
    <nav class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <button
        @click="goBack"
        class="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <svg
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span>Retour au lexique</span>
      </button>
    </nav>

    <!-- Contenu principal -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <!-- État de chargement -->
      <div v-if="isLoading" class="flex justify-center items-center min-h-96">
        <div class="text-center">
          <div
            class="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"
          ></div>
          <p class="text-gray-600 font-medium">{{ getLoadingText() }}</p>
        </div>
      </div>

      <!-- Erreur de chargement -->
      <div v-else-if="loadError" class="text-center py-12">
        <div
          class="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto"
        >
          <svg
            class="h-16 w-16 text-red-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 class="text-lg font-semibold text-red-800 mb-2">
            Erreur de chargement
          </h3>
          <p class="text-red-600 mb-4">{{ loadError }}</p>
          <button
            @click="initializeForm"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>

      <!-- Formulaire -->
      <div v-else class="space-y-8">
        <!-- En-tête du formulaire -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            {{ getFormTitle() }}
          </h1>
          <p class="text-gray-600">{{ getFormDescription() }}</p>
        </div>

        <!-- Informations sur l'entrée existante (edit/translate) -->
        <div
          v-if="mode !== 'create' && currentEntry"
          class="bg-blue-50 rounded-xl p-6 border border-blue-200"
        >
          <div class="flex items-center space-x-3">
            <svg
              class="h-6 w-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 class="font-semibold text-blue-900">
                Référence: {{ currentEntry.reference }}
              </h3>
              <div class="flex items-center space-x-2 mt-1">
                <span class="text-sm text-blue-700">Langues disponibles:</span>
                <div class="flex space-x-1">
                  <span
                    v-for="lang in getAvailableLanguages(currentEntry)"
                    :key="lang"
                    class="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-sm"
                  >
                    {{ LANGUES_CONFIG[lang].drapeau }}
                    {{ LANGUES_CONFIG[lang].nom }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section du formulaire principal -->
        <div
          class="bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg p-8"
        >
          <h2
            class="text-lg font-semibold text-gray-900 mb-8 flex items-center"
          >
            <svg
              class="h-5 w-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            {{ getFormSectionTitle() }}
          </h2>

          <form @submit.prevent="handleSubmit" class="space-y-8">
            <!-- Champ référence (seulement en mode create) -->
            <div v-if="mode === 'create'" class="space-y-2">
              <label
                for="reference"
                class="block text-sm font-medium text-gray-700"
              >
                Référence *
              </label>
              <input
                id="reference"
                ref="referenceInput"
                v-model="form.reference"
                type="text"
                placeholder="Ex: welcomeMessage, loginButton..."
                :class="[
                  'block w-full px-4 py-3 border rounded-xl transition-all duration-200 font-mono text-sm',
                  errors.reference
                    ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-200 bg-white/80 focus:ring-blue-500 focus:border-blue-500',
                ]"
                @blur="validateReference"
                @input="handleReferenceInput"
              />
              <p
                v-if="errors.reference"
                class="text-sm text-red-600 flex items-center mt-2"
              >
                <svg
                  class="h-4 w-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {{ errors.reference }}
              </p>
              <p v-else class="text-sm text-gray-500 mt-2">
                Identifiant unique pour cette référence lexicale (lettres,
                chiffres, underscore)
              </p>
            </div>

            <!-- Section langue et configuration -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Sélecteur de langue -->
              <div class="space-y-2">
                <label
                  for="langue"
                  class="block text-sm font-medium text-gray-700"
                >
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
                      : 'border-gray-200 bg-white/80 focus:ring-blue-500 focus:border-blue-500',
                  ]"
                  @change="handleLanguageChange"
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
                  {{ getLanguageHelpText() }}
                </p>
              </div>

              <!-- Configuration exportabilité mobile (seulement create et edit) -->
              <div v-if="mode !== 'translate'" class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  Configuration
                </label>
                <div
                  class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6 border border-gray-200"
                >
                  <label class="flex items-start cursor-pointer">
                    <input
                      v-model="form.portable"
                      type="checkbox"
                      class="sr-only"
                    />
                    <div
                      :class="[
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 flex-shrink-0',
                        form.portable ? 'bg-blue-600' : 'bg-gray-300',
                      ]"
                    >
                      <span
                        :class="[
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
                          form.portable ? 'translate-x-6' : 'translate-x-1',
                        ]"
                      />
                    </div>
                    <div class="ml-4">
                      <span class="text-sm font-medium text-gray-900 block"
                        >Exportable vers mobile</span
                      >
                      <p class="text-xs text-gray-500 mt-1">
                        Cette référence pourra être utilisée dans l'app mobile
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Info sur la portabilité en mode translate -->
              <div v-else class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  Configuration héritée
                </label>
                <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div class="flex items-center space-x-3">
                    <svg
                      :class="[
                        'h-5 w-5',
                        currentEntry?.portable
                          ? 'text-green-500'
                          : 'text-gray-400',
                      ]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 15a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                    <span class="text-sm text-gray-700">
                      {{
                        currentEntry?.portable
                          ? 'Compatible mobile'
                          : 'Non compatible mobile'
                      }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Zone de texte -->
            <div class="space-y-2">
              <label
                for="texte"
                class="block text-sm font-medium text-gray-700"
              >
                {{ getTextFieldLabel() }} *
              </label>
              <textarea
                id="texte"
                ref="textareaInput"
                v-model="form.texte"
                rows="6"
                :placeholder="getTextPlaceholder()"
                :class="[
                  'block w-full px-4 py-3 border rounded-xl transition-all duration-200 resize-none',
                  errors.texte
                    ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-200 bg-white/80 focus:ring-blue-500 focus:border-blue-500',
                ]"
                @blur="validateTexte"
                @input="handleTextInput"
              ></textarea>
              <div class="flex justify-between items-center mt-2">
                <div>
                  <p
                    v-if="errors.texte"
                    class="text-sm text-red-600 flex items-center"
                  >
                    <svg
                      class="h-4 w-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {{ errors.texte }}
                  </p>
                  <p v-else class="text-sm text-gray-500">
                    {{ getTextFieldHelpText() }}
                  </p>
                </div>
                <div v-if="form.texte.length > 0" class="text-xs text-gray-400">
                  {{ form.texte.length }} caractères
                </div>
              </div>
            </div>

            <!-- Boutons d'action -->
            <div
              class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-6 border-t border-gray-200"
            >
              <!-- Bouton Annuler -->
              <button
                type="button"
                @click="handleCancel"
                class="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-gray-700 order-2 sm:order-1"
              >
                <svg
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span>Annuler</span>
              </button>

              <!-- Section droite avec validation et bouton principal -->
              <div
                class="flex flex-col sm:flex-row items-start sm:items-center gap-4 order-1 sm:order-2"
              >
                <!-- Informations de validation -->
                <div
                  v-if="hasErrors && showValidationErrors"
                  class="text-sm text-red-600 flex items-center"
                >
                  <svg
                    class="h-4 w-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Veuillez corriger les erreurs</span>
                </div>

                <!-- Bouton principal -->
                <button
                  type="submit"
                  :disabled="!canSubmit || isSubmitting"
                  :class="[
                    'flex items-center space-x-2 px-8 py-3 rounded-xl transition-all duration-200 font-medium text-lg whitespace-nowrap',
                    canSubmit && !isSubmitting
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none',
                  ]"
                >
                  <svg
                    v-if="isSubmitting"
                    class="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    />
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <svg
                    v-else
                    class="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{{ getSubmitButtonText() }}</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Aperçu comparatif (mode edit seulement) -->
        <div
          v-if="mode === 'edit' && currentEntry && currentText"
          class="bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg p-8"
        >
          <h2
            class="text-lg font-semibold text-gray-900 mb-6 flex items-center"
          >
            <svg
              class="h-5 w-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            Comparaison avant/après
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Texte actuel -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Texte actuel
              </label>
              <div
                class="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-32"
              >
                <p class="text-gray-900 whitespace-pre-wrap">
                  {{ currentText }}
                </p>
              </div>
            </div>

            <!-- Nouveau texte -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Nouveau texte
              </label>
              <div
                class="bg-blue-50 border border-blue-200 rounded-lg p-4 min-h-32"
              >
                <p class="text-gray-900 whitespace-pre-wrap">
                  {{ form.texte || 'Aucun texte saisi...' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Indicateur de changements -->
          <div
            v-if="hasTextChanged"
            class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <div class="flex items-center space-x-2">
              <svg
                class="h-4 w-4 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="text-sm text-yellow-800"
                >Des modifications ont été détectées</span
              >
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
        notification.show
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0',
        {
          'bg-green-500 text-white': notification.type === 'success',
          'bg-red-500 text-white': notification.type === 'error',
          'bg-blue-500 text-white': notification.type === 'info',
          'bg-yellow-500 text-white': notification.type === 'warning',
        },
      ]"
    >
      <div class="flex items-start space-x-3">
        <svg
          v-if="notification.type === 'success'"
          class="h-6 w-6 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <svg
          v-else-if="notification.type === 'error'"
          class="h-6 w-6 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <svg
          v-else-if="notification.type === 'warning'"
          class="h-6 w-6 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <svg
          v-else
          class="h-6 w-6 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div class="flex-1">
          <p class="font-medium">{{ notification.message }}</p>
          <p v-if="notification.detail" class="text-sm opacity-90 mt-1">
            {{ notification.detail }}
          </p>
        </div>
        <button @click="hideNotification" class="flex-shrink-0 ml-4">
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Dashboard from '@/frontend/view/components/dashboard.vue';
import Header from '@/frontend/view/components/header.vue';
import Lexicon from '@/frontend/service/lexicon.service.ts';

// Types
interface TranslationEntry {
  langue: 'fr' | 'en' | 'es' | 'de';
  texte: string;
}

interface LexiconEntry {
  guid: number;
  reference: string;
  translation: TranslationEntry[] | Record<string, string>;
  portable: boolean;
}

type FormMode = 'create' | 'edit' | 'translate';

// Configuration des langues
const LANGUES_CONFIG: Record<
  TranslationEntry['langue'],
  { nom: string; drapeau: string; code: string }
> = {
  fr: { nom: 'Français', drapeau: '🇫🇷', code: 'fr' },
  en: { nom: 'English', drapeau: '🇺🇸', code: 'en' },
  es: { nom: 'Español', drapeau: '🇪🇸', code: 'es' },
  de: { nom: 'Deutsch', drapeau: '🇩🇪', code: 'de' },
};

// Router et route
const router = useRouter();
const route = useRoute();

// Refs pour les éléments DOM
const referenceInput = ref<HTMLInputElement>();
const textareaInput = ref<HTMLTextAreaElement>();

// États réactifs
const mode = ref<FormMode>('create');
const isLoading = ref(false);
const loadError = ref<string | null>(null);
const isSubmitting = ref(false);
const currentEntry = ref<LexiconEntry | null>(null);
const currentText = ref('');
const showValidationErrors = ref(false);

// Données du formulaire
const form = ref({
  guid: '',
  reference: '',
  selectedLanguage: '' as TranslationEntry['langue'] | '',
  texte: '',
  portable: false,
});

// Données originales pour comparaison
const originalForm = ref({ ...form.value });

// Erreurs de validation
const errors = ref({
  reference: '',
  texte: '',
});

// Notifications
const notification = ref({
  show: false,
  message: '',
  detail: '',
  type: 'info' as 'success' | 'error' | 'warning' | 'info',
});

// Computed properties
const hasErrors = computed(() => {
  return Object.values(errors.value).some((error) => error !== '');
});

const canSubmit = computed(() => {
  const baseValidation =
    form.value.selectedLanguage !== '' &&
    form.value.texte.trim() !== '' &&
    !hasErrors.value;

  if (mode.value === 'create') {
    return baseValidation && form.value.reference.trim() !== '';
  }

  return baseValidation;
});

const hasTextChanged = computed(() => {
  return mode.value === 'edit' && form.value.texte !== currentText.value;
});

const availableLanguages = computed(() => {
  if (mode.value === 'translate' && currentEntry.value) {
    // En mode traduction, exclure les langues déjà présentes
    const existingLanguages = getAvailableLanguages(currentEntry.value);
    return Object.fromEntries(
      Object.entries(LANGUES_CONFIG).filter(
        ([code]) =>
          !existingLanguages.includes(code as TranslationEntry['langue'])
      )
    );
  }
  return LANGUES_CONFIG;
});

// Méthodes utilitaires
const getAvailableLanguages = (
  entry: LexiconEntry
): TranslationEntry['langue'][] => {
  if (!entry.translation) {
    return [];
  }
  try {
    let translations;

    // Cas 1: Si translation est une chaîne JSON, la parser
    if (typeof entry.translation === 'string') {
      translations = JSON.parse(entry.translation);
    }
    // Cas 2: Si translation est déjà un objet JavaScript
    else {
      translations = entry.translation;
    }

    // Si c'est un tableau (ancien format)
    if (Array.isArray(translations)) {
      return translations.map((t) => t.langue);
    }

    // Si c'est un objet (nouveau format)
    if (typeof translations === 'object' && translations !== null) {
      return Object.keys(translations) as TranslationEntry['langue'][];
    }

    return [];
  } catch (error) {
    console.error('Erreur lors du parsing des traductions:', error);
    return [];
  }
};

const getTexteByLangue = (
  entry: LexiconEntry,
  langue: TranslationEntry['langue']
): string => {
  if (!entry.translation) {
    return '';
  }

  try {
    let translations;

    // Cas 1: Si translation est une chaîne JSON, la parser
    if (typeof entry.translation === 'string') {
      translations = JSON.parse(entry.translation);
    }
    // Cas 2: Si translation est déjà un objet JavaScript
    else {
      translations = entry.translation;
    }

    // Si c'est un tableau (ancien format)
    if (Array.isArray(translations)) {
      const texte = translations.find((t) => t.langue === langue);
      return texte ? texte.texte : '';
    }

    // Si c'est un objet (nouveau format)
    if (typeof translations === 'object' && translations !== null) {
      return translations[langue] || '';
    }

    return '';
  } catch (error) {
    console.error('Erreur lors du parsing des traductions:', error);
    return '';
  }
};

// Méthodes de texte dynamique
const getLoadingText = (): string => {
  switch (mode.value) {
    case 'create':
      return 'Initialisation du formulaire...';
    case 'edit':
      return 'Chargement de la référence...';
    case 'translate':
      return 'Chargement des traductions...';
    default:
      return 'Chargement...';
  }
};

const getFormTitle = (): string => {
  switch (mode.value) {
    case 'create':
      return 'Créer une nouvelle référence';
    case 'edit':
      return 'Modifier le texte';
    case 'translate':
      return 'Ajouter une traduction';
    default:
      return '';
  }
};

const getFormDescription = (): string => {
  switch (mode.value) {
    case 'create':
      return 'Définissez un nouvel identifiant de référence avec son premier texte';
    case 'edit':
      return 'Modifiez le contenu textuel pour cette langue';
    case 'translate':
      return 'Ajoutez une traduction dans une nouvelle langue';
    default:
      return '';
  }
};

const getFormSectionTitle = (): string => {
  switch (mode.value) {
    case 'create':
      return 'Informations de la nouvelle référence';
    case 'edit':
      return 'Modification du texte existant';
    case 'translate':
      return 'Nouvelle traduction';
    default:
      return '';
  }
};

const getTextFieldLabel = (): string => {
  if (!form.value.selectedLanguage) return 'Texte';
  const langName = LANGUES_CONFIG[form.value.selectedLanguage].nom;
  return `Texte en ${langName}`;
};

const getTextFieldHelpText = (): string => {
  switch (mode.value) {
    case 'create':
      return 'Saisissez le texte initial qui sera affiché pour cette référence';
    case 'edit':
      return 'Modifiez le contenu du texte existant';
    case 'translate':
      return 'Saisissez la traduction dans la langue sélectionnée';
    default:
      return 'Saisissez le texte';
  }
};

const getLanguageHelpText = (): string => {
  switch (mode.value) {
    case 'create':
      return 'Sélectionnez la langue du texte initial';
    case 'edit':
      return 'Langue fixée pour cette modification';
    case 'translate':
      return 'Choisissez la langue de la nouvelle traduction';
    default:
      return '';
  }
};

const getSubmitButtonText = (): string => {
  if (isSubmitting.value) {
    switch (mode.value) {
      case 'create':
        return 'Création en cours...';
      case 'edit':
        return 'Modification en cours...';
      case 'translate':
        return 'Ajout en cours...';
      default:
        return 'Traitement...';
    }
  }

  switch (mode.value) {
    case 'create':
      return 'Créer la référence';
    case 'edit':
      return 'Sauvegarder les modifications';
    case 'translate':
      return 'Ajouter la traduction';
    default:
      return 'Enregistrer';
  }
};

const getTextPlaceholder = (): string => {
  if (!form.value.selectedLanguage) {
    return "Sélectionnez d'abord une langue...";
  }

  const langName = LANGUES_CONFIG[form.value.selectedLanguage].nom;
  switch (mode.value) {
    case 'create':
      return `Saisissez le texte initial en ${langName}...`;
    case 'edit':
      return `Modifiez le texte en ${langName}...`;
    case 'translate':
      return `Saisissez la traduction en ${langName}...`;
    default:
      return `Texte en ${langName}...`;
  }
};

// Méthodes de validation
const validateReference = (): boolean => {
  if (mode.value !== 'create') return true;

  const reference = form.value.reference.trim();

  if (!reference) {
    errors.value.reference = 'La référence est obligatoire';
    return false;
  }

  if (reference.length < 2) {
    errors.value.reference = 'La référence doit contenir au moins 2 caractères';
    return false;
  }

  // Validation du format
  const validFormat = /^[a-zA-Z][a-zA-Z0-9_]*$/.test(reference);
  if (!validFormat) {
    errors.value.reference =
      'Format invalide (lettres, chiffres, _ uniquement, commencer par une lettre)';
    return false;
  }

  errors.value.reference = '';
  return true;
};

const validateTexte = (): boolean => {
  const texte = form.value.texte.trim();

  if (!texte) {
    errors.value.texte = 'Le texte est obligatoire';
    return false;
  }

  if (texte.length < 1) {
    errors.value.texte = 'Le texte doit contenir au moins 1 caractère';
    return false;
  }

  if (texte.length > 5000) {
    errors.value.texte = 'Le texte ne peut pas dépasser 5000 caractères';
    return false;
  }

  errors.value.texte = '';
  return true;
};

const validateForm = (): boolean => {
  showValidationErrors.value = true;

  const referenceValid = validateReference();
  const texteValid = validateTexte();

  return referenceValid && texteValid;
};

// Gestionnaires d'événements
const handleReferenceInput = () => {
  if (errors.value.reference) {
    validateReference();
  }
};

const handleTextInput = () => {
  if (errors.value.texte) {
    validateTexte();
  }
};

const handleLanguageChange = async () => {
  // Si on change de langue en mode edit, on doit recharger le texte
  if (
    mode.value === 'edit' &&
    currentEntry.value &&
    form.value.selectedLanguage
  ) {
    const newText = getTexteByLangue(
      currentEntry.value,
      form.value.selectedLanguage
    );
    form.value.texte = newText;
    currentText.value = newText;
  }

  // Focus automatique sur le textarea après sélection de langue
  await nextTick();
  if (textareaInput.value) {
    textareaInput.value.focus();
  }
};

const handleCancel = () => {
  // Vérifier s'il y a des modifications non sauvegardées
  const hasUnsavedChanges = hasFormChanged();

  if (hasUnsavedChanges) {
    const confirmLeave = confirm(
      'Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?'
    );
    if (!confirmLeave) return;
  }

  goBack();
};

// Méthodes utilitaires
const hasFormChanged = (): boolean => {
  if (mode.value === 'create') {
    return (
      form.value.reference !== '' ||
      form.value.texte !== '' ||
      form.value.selectedLanguage !== ''
    );
  }

  if (mode.value === 'edit') {
    return form.value.texte !== currentText.value;
  }

  if (mode.value === 'translate') {
    return form.value.texte !== '' || form.value.selectedLanguage !== '';
  }

  return false;
};

const resetForm = () => {
  form.value = {
    guid: '',
    reference: '',
    selectedLanguage: '',
    texte: '',
    portable: false,
  };

  errors.value = {
    reference: '',
    texte: '',
  };

  showValidationErrors.value = false;
};

const goBack = () => {
  router.push('/lexicon');
};

// Méthodes de notification
const showNotification = (
  message: string,
  type: 'success' | 'error' | 'warning' | 'info' = 'info',
  detail?: string
) => {
  notification.value = {
    show: true,
    message,
    type,
    detail: detail || '',
  };

  setTimeout(() => {
    notification.value.show = false;
  }, 5000);
};

const hideNotification = () => {
  notification.value.show = false;
};

// Méthodes principales de gestion des données
const initializeForm = async () => {
  isLoading.value = true;
  loadError.value = null;

  try {
    // Déterminer le mode en fonction de la route
    const pathSegments = route.path.split('/');
    const entryId = route.params.entryId as string;
    const language = route.params.language as TranslationEntry['langue'];

    if (pathSegments.includes('create')) {
      await initializeCreateMode();
    } else if (pathSegments.includes('edit') && entryId && language) {
      await initializeEditMode(parseInt(entryId), language);
    } else if (pathSegments.includes('translate') && entryId) {
      await initializeTranslateMode(parseInt(entryId));
    } else {
      throw new Error('Mode de formulaire non reconnu');
    }
  } catch (error) {
    console.error("Erreur lors de l'initialisation:", error);
    loadError.value =
      error instanceof Error
        ? error.message
        : "Erreur d'initialisation inconnue";
  } finally {
    isLoading.value = false;
  }
};

const initializeCreateMode = async () => {
  mode.value = 'create';
  resetForm();
  form.value.selectedLanguage = 'fr'; // Langue par défaut

  // Focus automatique sur le champ référence
  await nextTick();
  if (referenceInput.value) {
    referenceInput.value.focus();
  }
};
const initializeEditMode = async (
  entryId: number,
  language: TranslationEntry['langue']
) => {
  mode.value = 'edit';

  // Charger l'entrée existante
  const result = await Lexicon.load(entryId);
  currentEntry.value = result.response.response;

  if (currentEntry.value === null || currentEntry.value === undefined) {
    return;
  }

  // Configurer le formulaire
  form.value.guid = entryId.toString();
  form.value.reference = currentEntry.value.reference;
  form.value.selectedLanguage = language;
  form.value.portable = currentEntry.value.portable;

  // Récupérer le texte existant avec la méthode corrigée
  form.value.texte = getTexteByLangue(currentEntry.value, language);

  // Focus automatique sur le textarea
  await nextTick();
  if (textareaInput.value) {
    textareaInput.value.focus();
  }
};

const initializeTranslateMode = async (entryId: number) => {
  mode.value = 'translate';

  // Charger l'entrée existante
  const result = await Lexicon.load(entryId);

  currentEntry.value = result.response.response;

  if (currentEntry.value === null || currentEntry.value === undefined) {
    return;
  }

  // Configurer le formulaire
  form.value.reference = currentEntry.value.reference;
  form.value.portable = currentEntry.value.portable;

  // Sélectionner automatiquement la première langue disponible si possible
  const available = Object.keys(availableLanguages.value);
  if (available.length > 0) {
    form.value.selectedLanguage = available[0] as TranslationEntry['langue'];
  }
};

const handleSubmit = async () => {
  // Validation finale
  if (!validateForm()) {
    showNotification(
      'Veuillez corriger les erreurs avant de continuer',
      'error'
    );
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
      "Erreur lors de l'enregistrement",
      'error',
      error instanceof Error ? error.message : 'Erreur inconnue'
    );
  } finally {
    isSubmitting.value = false;
  }
};

// Méthodes d'API (à connecter à votre contrôleur)
const loadEntry = async (entryId: number): Promise<LexiconEntry> => {
  // TODO: Remplacer par l'appel réel au contrôleur
  // Exemple d'implémentation:
  // const response = await lexiconController.getEntry(entryId);
  // return response.data;

  // Mock pour les tests
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (entryId === 999) {
        reject(new Error('Entrée non trouvée'));
      } else {
        resolve({
          guid: entryId,
          reference: 'exemple_reference',
          translation: [
            { langue: 'fr', texte: 'Texte français' },
            { langue: 'en', texte: 'English text' },
          ],
          portable: true,
        });
      }
    }, 1000);
  });
};

const checkReferenceUniqueness = async (
  reference: string
): Promise<boolean> => {
  // TODO: Vérifier l'unicité de la référence
  // const response = await lexiconController.checkReference(reference);
  // return response.isUnique;

  // Mock pour les tests
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simuler quelques références déjà prises
      const takenReferences = ['welcome', 'login', 'menu', 'home'];
      resolve(!takenReferences.includes(reference.toLowerCase()));
    }, 500);
  });
};

const createNewEntry = async () => {
  try {
    // Vérifier l'unicité de la référence
    const isUnique = await checkReferenceUniqueness(form.value.reference);
    if (!isUnique) {
      errors.value.reference = 'Cette référence existe déjà';
      throw new Error('Référence non unique');
    }

    // TODO: Appel au contrôleur pour créer une nouvelle entrée
    const entryData = {
      reference: form.value.reference,
      translation: {
        [form.value.selectedLanguage]: form.value.texte,
      },
      portable: form.value.portable,
    };

    // const response = await lexiconController.create(entryData);
    const response = await Lexicon.save(entryData);

    if (response.status === 201) {
      showNotification(
        `Référence "${form.value.reference}" créée avec succès`,
        'success',
        `Texte en ${LANGUES_CONFIG[form.value.selectedLanguage as TranslationEntry['langue']].nom} ajouté`
      );
      // Rediriger après un délai
      setTimeout(() => {
        router.push('/lexicon');
      }, 2000);
    } else {
      showNotification(`${response.response.error.message}`, 'error');
    }
  } catch (error: any) {
    showNotification(`${error.response}`, 'error');
  }
};

const updateExistingText = async () => {
  try {
    if (!currentEntry.value || !form.value.selectedLanguage) return;

    // TODO: Appel au contrôleur pour mettre à jour le texte
    const updateData = {
      guid: currentEntry.value.guid,
      reference: form.value.reference,
      translation: {
        [form.value.selectedLanguage]: form.value.texte,
      },
      portable: form.value.portable,
    };

    // const response = await lexiconController.updateText(updateData);
    const response = await Lexicon.update(updateData);
    if (response.status === 200) {
      showNotification(
        'Texte modifié avec succès',
        'success',
        `Mise à jour en ${LANGUES_CONFIG[form.value.selectedLanguage].nom}`
      );

      setTimeout(() => {
        router.push('/lexicon');
      }, 2000);
    } else {
      showNotification(`${response.response.error.message}`, 'error');
    }
  } catch (error: any) {
    showNotification(`${error.response}`, 'error');
  }
};

const addNewTranslation = async () => {
  try {
    if (!currentEntry.value || !form.value.selectedLanguage) return;

    // TODO: Appel au contrôleur pour ajouter une traduction
    const translationData = {
      guid: currentEntry.value.guid,
      // reference: form.value.reference,
      // portable: form.value.portable,
      translation: {
        [form.value.selectedLanguage]: form.value.texte,
      },
    };

    console.log(translationData);

    // const response = await lexiconController.addTranslation(translationData);
    const response = await Lexicon.saveTranslation(translationData);
    if (response.status === 200) {
      showNotification(
        'Traduction ajoutée avec succès',
        'success',
        `Nouvelle traduction en ${LANGUES_CONFIG[form.value.selectedLanguage].nom}`
      );

      setTimeout(() => {
        router.push('/lexicon');
      }, 2000);
    }
    else {
      showNotification(
        `${response.response.error.message}`,
        'error',
      );
    }
  } catch (error: any) {
    showNotification(`${error.response}`, 'error');
  }
};

// // Gestion du cycle de vie
// onMounted(() => {
//   initializeForm();
// });

// Gestion de la navigation (prévenir la perte de données)
const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (hasFormChanged()) {
    event.preventDefault();
    event.returnValue = '';
  }
};

onMounted(() => {
  initializeForm();

  window.addEventListener('beforeunload', handleBeforeUnload);
});

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
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
  0%,
  100% {
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
input:focus,
textarea:focus,
select:focus {
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
input[type='checkbox']:checked + div {
  background-color: #2563eb;
}

input[type='checkbox']:checked + div span {
  transform: translateX(1.5rem);
}

/* Amélioration de l'accessibilité */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Styles pour les erreurs */
.error-shake {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

/* Indicateur de changement */
.text-changed {
  position: relative;
}

.text-changed::after {
  content: '';
  position: absolute;
  left: -8px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #f59e0b;
  border-radius: 2px;
}

/* Responsive improvements */
@media (max-width: 640px) {
  .grid-cols-1.lg\:grid-cols-2 {
    gap: 1.5rem;
  }

  .px-8 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>