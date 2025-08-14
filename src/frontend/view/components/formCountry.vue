<!--<template>-->
<!--  <div class="bg-white rounded-lg shadow-md">-->
<!--    <div class="p-6 border-b border-gray-200">-->
<!--      <h3 class="text-lg font-semibold text-gray-800">-->
<!--        {{ isEditing ? 'Modifier le pays' : 'Ajouter un nouveau pays' }}-->
<!--      </h3>-->
<!--      <p class="text-gray-600 text-sm mt-1">-->
<!--        {{ isEditing ? 'Modifiez les informations du pays' : 'Remplissez les informations du nouveau pays' }}-->
<!--      </p>-->
<!--    </div>-->

<!--    <form @submit.prevent="handleSubmit" class="p-6 space-y-6">-->
<!--      &lt;!&ndash; Nom du pays &ndash;&gt;-->
<!--      <div>-->
<!--        <label for="name" class="block text-sm font-medium text-gray-700 mb-2">-->
<!--          Nom du pays *-->
<!--        </label>-->
<!--        <input-->
<!--          guid="name"-->
<!--          v-model="form.name"-->
<!--          type="text"-->
<!--          required-->
<!--          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"-->
<!--          :class="{ 'border-red-500': errors.name }"-->
<!--          placeholder="Ex: France"-->
<!--        >-->
<!--        <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>-->
<!--      </div>-->

<!--      &lt;!&ndash; Code pays &ndash;&gt;-->
<!--      <div>-->
<!--        <label for="code" class="block text-sm font-medium text-gray-700 mb-2">-->
<!--          Code pays *-->
<!--        </label>-->
<!--        <input-->
<!--          guid="code"-->
<!--          v-model="form.code"-->
<!--          type="text"-->
<!--          required-->
<!--          maxlength="2"-->
<!--          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors uppercase"-->
<!--          :class="{ 'border-red-500': errors.code }"-->
<!--          placeholder="Ex: FR"-->
<!--          @input="form.code = $event.target.value.toUpperCase()"-->
<!--        >-->
<!--        <p v-if="errors.code" class="mt-1 text-sm text-red-600">{{ errors.code }}</p>-->
<!--        <p class="mt-1 text-xs text-gray-500">Code ISO à 2 lettres</p>-->
<!--      </div>-->

<!--      &lt;!&ndash; Capitale &ndash;&gt;-->
<!--      <div>-->
<!--        <label for="capital" class="block text-sm font-medium text-gray-700 mb-2">-->
<!--          Capitale *-->
<!--        </label>-->
<!--        <input-->
<!--          guid="capital"-->
<!--          v-model="form.capital"-->
<!--          type="text"-->
<!--          required-->
<!--          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"-->
<!--          :class="{ 'border-red-500': errors.capital }"-->
<!--          placeholder="Ex: Paris"-->
<!--        >-->
<!--        <p v-if="errors.capital" class="mt-1 text-sm text-red-600">{{ errors.capital }}</p>-->
<!--      </div>-->

<!--      &lt;!&ndash; Population &ndash;&gt;-->
<!--      <div>-->
<!--        <label for="population" class="block text-sm font-medium text-gray-700 mb-2">-->
<!--          Population *-->
<!--        </label>-->
<!--        <input-->
<!--          guid="population"-->
<!--          v-model.number="form.population"-->
<!--          type="number"-->
<!--          required-->
<!--          min="1"-->
<!--          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"-->
<!--          :class="{ 'border-red-500': errors.population }"-->
<!--          placeholder="Ex: 67000000"-->
<!--        >-->
<!--        <p v-if="errors.population" class="mt-1 text-sm text-red-600">{{ errors.population }}</p>-->
<!--        <p class="mt-1 text-xs text-gray-500">Nombre d'habitants</p>-->
<!--      </div>-->

<!--      &lt;!&ndash; Continent &ndash;&gt;-->
<!--      <div>-->
<!--        <label for="continent" class="block text-sm font-medium text-gray-700 mb-2">-->
<!--          Continent *-->
<!--        </label>-->
<!--        <select-->
<!--          guid="continent"-->
<!--          v-model="form.continent"-->
<!--          required-->
<!--          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"-->
<!--          :class="{ 'border-red-500': errors.continent }"-->
<!--        >-->
<!--          <option value="">Sélectionnez un continent</option>-->
<!--          <option value="Afrique">Afrique</option>-->
<!--          <option value="Amérique du Nord">Amérique du Nord</option>-->
<!--          <option value="Amérique du Sud">Amérique du Sud</option>-->
<!--          <option value="Asie">Asie</option>-->
<!--          <option value="Europe">Europe</option>-->
<!--          <option value="Océanie">Océanie</option>-->
<!--        </select>-->
<!--        <p v-if="errors.continent" class="mt-1 text-sm text-red-600">{{ errors.continent }}</p>-->
<!--      </div>-->

<!--      &lt;!&ndash; Export vers mobile &ndash;&gt;-->
<!--      <div class="bg-gray-50 p-4 rounded-lg">-->
<!--        <div class="flex items-start space-x-3">-->
<!--          <div class="flex items-center h-5">-->
<!--            <input-->
<!--              guid="exportToMobile"-->
<!--              v-model="form.exportToMobile"-->
<!--              type="checkbox"-->
<!--              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"-->
<!--            >-->
<!--          </div>-->
<!--          <div class="text-sm">-->
<!--            <label for="exportToMobile" class="font-medium text-gray-700 cursor-pointer">-->
<!--              Exporter vers l'application mobile-->
<!--            </label>-->
<!--            <p class="text-gray-500 mt-1">-->
<!--              Si activé, ce pays sera disponible dans l'application mobile et pourra être téléchargé par les utilisateurs.-->
<!--              Cela permettra l'accès hors ligne aux informations de ce pays.-->
<!--            </p>-->
<!--            <div class="mt-2 flex items-center space-x-2">-->
<!--              <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">-->
<!--                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>-->
<!--              </svg>-->
<!--              <span class="text-xs text-gray-600">-->
<!--                {{ form.exportToMobile ? 'Sera exporté vers mobile' : 'Non exporté vers mobile' }}-->
<!--              </span>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

<!--      &lt;!&ndash; Aperçu &ndash;&gt;-->
<!--      <div v-if="form.name || form.capital" class="bg-blue-50 border border-blue-200 rounded-lg p-4">-->
<!--        <h4 class="text-sm font-medium text-blue-800 mb-2">Aperçu</h4>-->
<!--        <div class="text-sm text-blue-700">-->
<!--          <p v-if="form.name && form.capital">-->
<!--            <strong>{{ form.name }}</strong> ({{ form.code || '??' }}) - Capitale: {{ form.capital }}-->
<!--          </p>-->
<!--          <p v-if="form.population" class="mt-1">-->
<!--            Population: {{ formatPopulation(form.population) }} habitants-->
<!--          </p>-->
<!--          <p v-if="form.continent" class="mt-1">-->
<!--            Continent: {{ form.continent }}-->
<!--          </p>-->
<!--          <div class="mt-2 flex items-center space-x-2">-->
<!--            <span-->
<!--              :class="form.exportToMobile ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"-->
<!--              class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"-->
<!--            >-->
<!--              {{ form.exportToMobile ? 'Exportable mobile' : 'Non exportable' }}-->
<!--            </span>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

<!--      &lt;!&ndash; Actions &ndash;&gt;-->
<!--      <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">-->
<!--        <button-->
<!--          type="submit"-->
<!--          :disabled="!isFormValid || isSubmitting"-->
<!--          class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"-->
<!--        >-->
<!--          <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">-->
<!--            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>-->
<!--            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>-->
<!--          </svg>-->
<!--          <span>{{ isEditing ? 'Mettre à jour' : 'Créer le pays' }}</span>-->
<!--        </button>-->

<!--        <button-->
<!--          type="button"-->
<!--          @click="handleCancel"-->
<!--          class="flex-1 sm:flex-initial bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"-->
<!--        >-->
<!--          Annuler-->
<!--        </button>-->
<!--      </div>-->
<!--    </form>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
<!--  name: 'CountryForm',-->
<!--  props: {-->
<!--    country: {-->
<!--      type: Object,-->
<!--      default: null-->
<!--    }-->
<!--  },-->
<!--  emits: ['save-country', 'cancel'],-->
<!--  data() {-->
<!--    return {-->
<!--      isSubmitting: false,-->
<!--      form: {-->
<!--        guid: null,-->
<!--        name: '',-->
<!--        code: '',-->
<!--        capital: '',-->
<!--        population: null,-->
<!--        continent: '',-->
<!--        exportToMobile: false-->
<!--      },-->
<!--      errors: {}-->
<!--    }-->
<!--  },-->
<!--  computed: {-->
<!--    isEditing() {-->
<!--      return this.country && this.country.guid-->
<!--    },-->

<!--    isFormValid() {-->
<!--      return this.form.name &&-->
<!--        this.form.code &&-->
<!--        this.form.capital &&-->
<!--        this.form.population-->