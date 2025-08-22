<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <Header />
    <Dashboard />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- En-tête avec titre et actions -->
      <div class="mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Gestion des pays
            </h1>
            <p class="text-slate-600 mt-2">{{ filteredCountries.length }} pays {{ searchTerm ? 'trouvés' : 'au total' }}</p>
          </div>

          <!-- Actions principales -->
          <div class="flex flex-col sm:flex-row gap-3">
            <!-- Recherche -->
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <input
                v-model="searchTerm"
                type="text"
                placeholder="Rechercher un pays..."
                class="pl-10 pr-4 py-3 w-full sm:w-80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all"
              >
            </div>

            <!-- Boutons d'action -->
            <div class="flex gap-2">
              <button
                @click="openAddModal"
                class="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Ajouter
              </button>

              <button
                @click="loadCountries"
                :disabled="isLoading"
                class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center gap-2"
              >
                <svg class="w-5 h-5" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                {{ isLoading ? 'Chargement...' : 'Actualiser' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <div v-if="loadError" class="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-xl shadow-sm">
        <div class="flex items-center">
          <svg class="h-6 w-6 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-red-700 font-medium">{{ loadError }}</p>
        </div>
      </div>

      <div v-if="successMessage" class="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-r-xl shadow-sm">
        <div class="flex items-center">
          <svg class="h-6 w-6 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-green-700 font-medium">{{ successMessage }}</p>
        </div>
      </div>

      <!-- Table des pays -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <!-- Indicateur de chargement -->
        <div v-if="isLoading" class="flex justify-center items-center py-20">
          <div class="flex flex-col items-center">
            <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
            <p class="mt-4 text-slate-600 font-medium">Chargement des pays...</p>
          </div>
        </div>

        <!-- Table -->
        <div v-else-if="filteredCountries.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-gradient-to-r from-slate-50 to-slate-100">
            <tr>
              <th
                v-for="column in columns"
                :key="column.key"
                @click="sort(column.key)"
                class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-200 transition-colors select-none group"
                :class="{ 'bg-slate-200': sortKey === column.key }"
              >
                <div class="flex items-center space-x-2">
                  <span>{{ column.label }}</span>
                  <div class="flex flex-col">
                    <svg
                      class="w-3 h-3 transition-colors"
                      :class="sortKey === column.key && sortDirection === 'asc' ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"/>
                    </svg>
                    <svg
                      class="w-3 h-3 -mt-1 transition-colors"
                      :class="sortKey === column.key && sortDirection === 'desc' ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                    </svg>
                  </div>
                </div>
              </th>
<!--              <th class="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">-->
<!--                Actions-->
<!--              </th>-->
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-100">
            <tr
              v-for="(country, index) in paginatedCountries"
              :key="country.id"
              class="hover:bg-slate-50 transition-colors"
              :class="{ 'bg-slate-25': index % 2 === 1 }"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
<!--                  <div class="flex-shrink-0 h-12 w-12">-->
<!--                    <div v-if="country.flag" class="h-12 w-12 rounded-full overflow-hidden border-2 border-slate-200">-->
<!--                      <img :src="country.flag" :alt="`Drapeau ${country.name}`" class="w-full h-full object-cover">-->
<!--                    </div>-->
<!--                    <div v-else class="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">-->
<!--                      <span class="text-white font-bold text-sm">{{ country.code.substring(0, 2) }}</span>-->
<!--                    </div>-->
<!--                  </div>-->
                  <div class="ml-4">
                    <div class="text-2xl font-bold text-slate-900">{{ country.name }}</div>
<!--                    <div class="text-sm text-slate-500">{{ country.iso }}</div>-->
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ country.timezone }}
                  </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                {{ country.code }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                {{ country.iso }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <code class="text-xs bg-slate-100 px-2 py-1 rounded border text-slate-700">{{ country.mobileRegex }}</code>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                <span v-if="country.flag" class="truncate max-w-32 inline-block">{{ country.flag }}</span>
                <span v-else class="text-slate-400 italic">Aucun drapeau</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="absolute" @click.stop>
                  <button
                    @click="toggleDropdown(country.id)"
                    :class="{
                        'opacity-100': hoveredRowId === country.id || activeDropdownId === country.id,
                        'opacity-0 group-hover:opacity-100': hoveredRowId !== country.id && activeDropdownId !== country.id
                      }"
                    class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all transform hover:scale-110"
                    title="Options"
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                    </svg>
                  </button>

                  <!-- Menu déroulant -->
                  <div
                    v-if="activeDropdownId === country.id"
                    class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-50 animate-fade-in"
                    @click.stop
                  >
                    <div class="py-2">
                      <!-- Option Modifier -->
                      <button
                        @click="openEditModal(country)"
                        class="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                        Modifier
                      </button>

                      <!-- Option Copier -->
                      <button
                        @click="copyCountry(country.name)"
                        class="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                      >
                        {{ copiedText === country.name ? "✅ Nom copié" : "📋 Copier Nom" }}
                      </button>

                      <!-- Séparateur -->
                      <hr class="my-2 border-slate-200">

                      <!-- Option Supprimer -->
                      <button
                        @click="confirmDeleteCountry(country)"
                        class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                      >
                        <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- État vide -->
        <div v-else class="text-center py-20">
          <svg class="mx-auto h-16 w-16 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <h3 class="text-xl font-semibold text-slate-900 mb-2">Aucun pays trouvé</h3>
          <p class="text-slate-500 mb-6">
            {{ searchTerm ? 'Aucun pays ne correspond à votre recherche.' : 'Commencez par ajouter votre premier pays.' }}
          </p>
          <button
            v-if="!searchTerm"
            @click="openAddModal"
            class="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 shadow-lg"
          >
            Ajouter le premier pays
          </button>
        </div>

        <!-- Pagination -->
        <div v-if="filteredCountries.length > 0" class="bg-slate-50 px-6 py-4 border-t border-slate-200">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="text-sm text-slate-700">
              Affichage de <span class="font-semibold">{{ startIndex + 1 }}</span> à
              <span class="font-semibold">{{ Math.min(endIndex, filteredCountries.length) }}</span>
              sur <span class="font-semibold">{{ filteredCountries.length }}</span> résultats
            </div>

            <div class="flex items-center space-x-3">
              <select
                v-model="itemsPerPage"
                class="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option :value="5">5 par page</option>
                <option :value="10">10 par page</option>
                <option :value="25">25 par page</option>
                <option :value="50">50 par page</option>
              </select>

              <div class="flex items-center space-x-1">
                <button
                  @click="currentPage = 1"
                  :disabled="currentPage === 1"
                  class="px-3 py-2 text-sm border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                  title="Première page"
                >
                  «
                </button>
                <button
                  @click="currentPage--"
                  :disabled="currentPage === 1"
                  class="px-3 py-2 text-sm border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  ‹
                </button>

                <span class="px-4 py-2 text-sm text-slate-700 bg-white border border-slate-300 rounded-lg">
                  {{ currentPage }} / {{ totalPages }}
                </span>

                <button
                  @click="currentPage++"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-2 text-sm border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  ›
                </button>
                <button
                  @click="currentPage = totalPages"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-2 text-sm border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                  title="Dernière page"
                >
                  »
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'ajout/modification -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <!-- En-tête du modal -->
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-slate-900">
              {{ isEditMode ? 'Modifier le pays' : 'Ajouter un nouveau pays' }}
            </h2>
            <button
              @click="closeModal"
              class="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Formulaire -->
          <form @submit.prevent="saveCountry" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Nom du pays -->
              <div class="md:col-span-2">
                <label class="block text-sm font-semibold text-slate-700 mb-2">
                  Nom du pays <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.name"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Ex: France"
                >
              </div>
              <!-- Code -->
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">
                  Code <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.code"
                  type="number"
                  required
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Ex: 237"
                >
              </div>
              <!-- ISO -->
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">
                  Code ISO <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.iso"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Ex: FR"
                >
              </div>
              <!-- Timezone -->
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">
                  Timezone <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.timezone"
                  type="text"
                  required
                  readonly
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Ex: Europe/Paris"
                >
              </div>
              <!-- Mobile Regex -->
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">
                  Regex Mobile
                </label>
                <input
                  v-model="formData.mobileRegex"
                  type="text"
                  required
                  readonly
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono text-sm"
                  placeholder="Ex: ^0[6-7][0-9]{8}$"
                >
              </div>
              <!-- Drapeau -->
              <div class="md:col-span-2">
                <label class="block text-sm font-semibold text-slate-700 mb-2">
                  Drapeau
                </label>
                <input
                  v-model="formData.flag"
                  type="text"
                  readonly
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-xl"
                  placeholder="🇫🇷"
                >
                <p class="text-xs text-slate-500 mt-1">Emoji du drapeau généré automatiquement</p>
              </div>
            </div>

            <!-- Actions du formulaire -->
            <div class="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                @click="closeModal"
                class="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                :disabled="isSaving"
                class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                <svg v-if="isSaving" class="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                {{ isSaving ? 'Sauvegarde...' : (isEditMode ? 'Modifier' : 'Ajouter') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation de suppression -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div class="p-6">
          <div class="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </div>

          <h3 class="text-lg font-bold text-slate-900 text-center mb-2">Confirmer la suppression</h3>
          <p class="text-slate-600 text-center mb-6">
            Êtes-vous sûr de vouloir supprimer le pays <strong>{{ countryToDelete?.name }}</strong> ?
            Cette action est irréversible.
          </p>

          <div class="flex gap-3">
            <button
              @click="closeDeleteModal"
              class="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              @click="deleteCountry"
              :disabled="isDeleting"
              class="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <svg v-if="isDeleting" class="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              {{ isDeleting ? 'Suppression...' : 'Supprimer' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import Header from '@/frontend/view/components/header.vue';
import Dashboard from '@/frontend/view/components/dashboard.vue';
import { fetchCountriesData } from '@/frontend/Ctr/country.ts';
import Country from '@/frontend/service/country.service.ts'
import { PhoneNumberUtil } from 'google-libphonenumber'
// Interface pour les pays
interface CountryEntry {
  id: string;
  code: string;
  name: string;
  iso: string;
  timezone: string;
  mobileRegex: string;
  flag: string;
}

// États réactifs principaux
const countries = ref<CountryEntry[]>([]);
const isLoading = ref(false);
const loadError = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const searchTerm = ref('');
const sortKey = ref<keyof CountryEntry>('name');
const sortDirection = ref<'asc' | 'desc'>('asc');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const copiedText = ref("")


// États des modals
const showModal = ref(false);
const showDeleteModal = ref(false);
const isEditMode = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const countryToDelete = ref<CountryEntry | null>(null);

// États pour le dropdown et le hover
const activeDropdownId = ref<string | null>(null);
const hoveredRowId = ref<string | null>(null);

// Données du formulaire
const formData = ref<Partial<CountryEntry>>({
  name: '',
  code: '',
  iso: '',
  timezone: '',
  mobileRegex: '',
  flag: ''
});

// Colonnes du tableau
// const columns = [
//   { key: 'name' as keyof CountryEntry, label: 'Nom du Pays' },
//   { key: 'timezone' as keyof CountryEntry, label: 'Timezone' },
//   { key: 'code' as keyof CountryEntry, label: 'Code' },
//   { key: 'iso' as keyof CountryEntry, label: 'Code ISO' },
//   { key: 'mobileRegex' as keyof CountryEntry, label: 'Regex Mobile' },
//   { key: 'flag' as keyof CountryEntry, label: 'Drapeau' }
// ];

// Fonction pour charger les pays
const loadCountries = async () => {
  try {
    isLoading.value = true;
    loadError.value = null;
    successMessage.value = null;

    // Appel au contrôleur pour charger les données
    countries.value = await fetchCountriesData();

  } catch (error) {
    console.error('Erreur lors du chargement:', error);
    loadError.value = error instanceof Error ? error.message : 'Erreur lors du chargement des données';
  } finally {
    isLoading.value = false;
  }
};

// Notifications
const notification = ref({
  show: false,
  message: '',
  detail: '',
  type: 'info' as 'success' | 'error' | 'warning' | 'info',
});

// Gestion des messages
const clearMessages = () => {
  loadError.value = null;
  successMessage.value = null;
};

// Auto-clear success messages après 5 secondes
watch(successMessage, (newMessage) => {
  if (newMessage) {
    setTimeout(() => {
      successMessage.value = null;
    }, 5000);
  }
});

// Computed properties
const filteredCountries = computed(() => {
  let filtered = countries.value;

  // Filtrage par terme de recherche
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    filtered = filtered.filter(country =>
      country.name.toLowerCase().includes(term) ||
      country.code.toString().toLowerCase().includes(term) ||
      country.iso.toUpperCase().includes(term)
    );
  }

  // Tri
  filtered.sort((a, b) => {
    const aVal = String(a[sortKey.value] || '').toLowerCase();
    const bVal = String(b[sortKey.value] || '').toLowerCase();

    if (sortDirection.value === 'asc') {
      return aVal.localeCompare(bVal);
    } else {
      return bVal.localeCompare(aVal);
    }
  });

  return filtered;
});

const totalPages = computed(() =>
  Math.ceil(filteredCountries.value.length / itemsPerPage.value)
);

const startIndex = computed(() =>
  (currentPage.value - 1) * itemsPerPage.value
);

const endIndex = computed(() =>
  startIndex.value + itemsPerPage.value
);

const paginatedCountries = computed(() =>
  filteredCountries.value.slice(startIndex.value, endIndex.value)
);

// Watchers
watch(filteredCountries, () => {
  currentPage.value = 1;
});

watch(itemsPerPage, () => {
  currentPage.value = 1;
});

// Méthodes de tri
const sort = (key: keyof CountryEntry) => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortDirection.value = 'asc';
  }
};

// Gestion des modals
const openAddModal = () => {
  isEditMode.value = false;
  formData.value = {
    name: '',
    code: '',
    iso: '',
    timezone: '',
    mobileRegex: '',
    flag: ''
  };
  showModal.value = true;
  clearMessages();
};

// Fonctions pour le dropdown
const toggleDropdown = (countryId: string) => {
  activeDropdownId.value = activeDropdownId.value === countryId ? null : countryId;
};

const openEditModal = (country: CountryEntry) => {
  isEditMode.value = true;
  formData.value = { ...country };
  showModal.value = true;
  clearMessages();
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
  }, 2000);
};

const closeModal = () => {
  showModal.value = false;
  formData.value = {
    name: '',
    code: '',
    iso: '',
    timezone: '',
    mobileRegex: '',
    flag: ''
  };
};

// Validation du formulaire
const validateForm = (): string | null => {
  if (!formData.value.name?.trim()) {
    return 'Le nom du pays est obligatoire';
  }
  if (!formData.value.code || typeof formData.value.code !== 'number') {
    return 'Le code du pays est obligatoire';
  }
  if (!formData.value.iso?.trim()) {
    return 'Le code ISO est obligatoire';
  }
  if (!formData.value.timezone?.trim()) {
    return 'Le fuseau horaire est obligatoire';
  }
  if (!formData.value.mobileRegex?.trim()) {
    return 'Le regex mobile est obligatoire';
  }

  // Vérifier les doublons (sauf pour le pays en cours d'édition)
  const existingCountry = countries.value.find(country =>
      country.id !== formData.value.id && (
        country.name.toLowerCase() === formData.value.name?.toLowerCase() ||
        country.code === formData.value.code ||
        country.iso.toLowerCase() === formData.value.iso?.toLowerCase()
      )
  );

  if (existingCountry) {
    return 'Un pays avec ce nom, code ou ISO existe déjà';
  }

  return null;
};

const phoneUtil = PhoneNumberUtil.getInstance()
// Vérifier validité du mobile avec libphonenumber (et récupérer regex simplifiée)
function generateRegex(iso: string): string {
  try {
    const metadata = phoneUtil.getMetadataForRegion(iso.toUpperCase());
    if (!metadata) return '';
    return metadata.getMobile().getNationalNumberPattern();
  } catch (e) {
    console.error("Impossible de générer la regex pour", iso, e);
    return '';
  }
}

// Récupérer timezone depuis WorldTimeAPI
async function fetchTimezone(iso) {
  try {
    const res = await fetch('https://worldtimeapi.org/api/timezone')
    const timezones = await res.json()
    const tz = timezones.find(tz => tz.toUpperCase().includes(iso.toUpperCase()))
    return tz || ''
  } catch (e) {
    return ''
  }
}


// Convertir ISO en emoji drapeau
function isoToFlagEmoji(iso) {
  return iso
    .toUpperCase()
    .replace(/./g, char =>
      String.fromCodePoint(127397 + char.charCodeAt())
    )
}

// Surveille les changements du code ISO
watch(() => formData.value.iso, async (newIso) => {
  if (newIso) {
    const iso = newIso.toUpperCase()
    formData.value.flag = isoToFlagEmoji(iso)
    formData.value.timezone = await fetchTimezone(iso)
    formData.value.mobileRegex = generateRegex(iso)
  } else {
    formData.value.flag = ''
    formData.value.timezone = ''
    formData.value.mobileRegex = ''
  }
})
// Fonction pour copier un PAYS
const copyCountry = async (text: string ) => {
  try {
    await navigator.clipboard.writeText(String(text));
    copiedText.value = String(text);

    setTimeout(() => {
      copiedText.value = "";
    }, 2000);
  } catch (err) {
    alert("❌ Impossible de copier");
  }
};

// Gestion de la sauvegarde
const saveCountry = async () => {
  try {
    // isSaving.value = true;

    // Validation
    const validationError = validateForm();
    if (validationError) {
      loadError.value = validationError;
      return;
    }

    if (isEditMode.value && formData.value.id) {
      // Modification
      const index = countries.value.findIndex(c => c.id === formData.value.id);
      if (index !== -1) {
        countries.value[index] = { ...formData.value } as CountryEntry;
        successMessage.value = `Le pays "${formData.value.name}" a été modifié avec succès`;
      }
    } else {
      // Ajout
      try {
        isSaving.value = true;

        const response = await Country.save(formData.value);

        if (response.status === 201) {
          const createdCountry: CountryEntry = await response.response; // <-- dépend de ton contrôleur
          countries.value.unshift(createdCountry);

          successMessage.value = `Le pays "${createdCountry.name}" a été ajouté avec succès`;
          showNotification(`Le pays "${createdCountry.name}" a été ajouté avec succès`);
        } else {
          loadError.value = "Erreur lors de la création du pays";
        }

        closeModal();
      } catch (error) {
        loadError.value = error instanceof Error ? error.message : "Erreur lors de la sauvegarde";
      } finally {
        isSaving.value = false;
      }
    }
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : "Erreur lors de la sauvegarde";
  }
}

// Gestion de la suppression
const confirmDeleteCountry = (country: CountryEntry) => {
  countryToDelete.value = country;
  showDeleteModal.value = true;
  clearMessages();
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  countryToDelete.value = null;
};

const deleteCountry = async () => {
  if (!countryToDelete.value) return;

  try {
    isDeleting.value = true;

    const index = countries.value.findIndex(c => c.id === countryToDelete.value!.id);
    if (index !== -1) {
      const deletedCountryName = countries.value[index].name;
      countries.value.splice(index, 1);
      successMessage.value = `Le pays "${deletedCountryName}" a été supprimé avec succès`;

      // Ajuster la pagination si nécessaire
      if (paginatedCountries.value.length === 0 && currentPage.value > 1) {
        currentPage.value--;
      }
    }

    closeDeleteModal();

  } catch (error) {
    loadError.value = error instanceof Error ? error.message : 'Erreur lors de la suppression';
  } finally {
    isDeleting.value = false;
  }
};

// Raccourcis clavier
const handleKeydown = (event: KeyboardEvent) => {
  // Escape pour fermer les modals
  if (event.key === 'Escape') {
    if (showModal.value) {
      closeModal();
    } else if (showDeleteModal.value) {
      closeDeleteModal();
    }
  }

  // Ctrl+N pour nouveau pays
  if (event.ctrlKey && event.key === 'n') {
    event.preventDefault();
    openAddModal();
  }
};

// Chargement initial et événements
onMounted(() => {
  loadCountries();

  // // Si pas de données, charger des exemples après 2 secondes
  // setTimeout(() => {
  // }, 2000);

  // Écouter les raccourcis clavier
  document.addEventListener('keydown', handleKeydown);
});

// Nettoyage
import { onUnmounted } from 'vue';
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});

</script>

<style scoped>
/* Animations personnalisées */
@keyframes slideInFromTop {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInFromBottom {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-slide-in-top {
  animation: slideInFromTop 0.3s ease-out;
}

.animate-slide-in-bottom {
  animation: slideInFromBottom 0.3s ease-out;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* Scrollbar personnalisé */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Effets hover améliorés */
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Focus visible amélioré */
.focus-visible:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Transitions fluides pour les états */
.transition-all {
  transition: all 0.2s ease-in-out;
}

/* Style pour les états de chargement */
.loading-shimmer {
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Responsive improvements */
@media (max-width: 640px) {
  .table-responsive {
    font-size: 0.875rem;
  }

  .modal-responsive {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }
}

/* Animation pour les messages */
.alert-enter-active,
.alert-leave-active {
  transition: all 0.3s ease;
}

.alert-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.alert-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

/* Style pour les tooltips */
[title] {
  position: relative;
}

/* Style pour les codes regex */
code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.85em;
}

/* Amélioration des boutons d'action */
.action-button {
  position: relative;
  overflow: hidden;
}

.action-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.3s ease, height 0.3s ease;
}

.action-button:hover::before {
  width: 100px;
  height: 100px;
}
</style>