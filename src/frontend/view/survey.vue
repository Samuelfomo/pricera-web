<template>
  <div class="p-6">
    <Header />
    <Dashboard/>
    <h1 class="text-2xl font-bold mb-6">Liste des Surveys</h1>

    <!-- Loader si aucun survey -->
    <div v-if="loading" class="text-center text-gray-500">
      Chargement des surveys...
    </div>

    <!-- Message si vide -->
    <div v-else-if="!surveys.length" class="text-center text-gray-400">
      Aucun survey trouvé.
    </div>

    <!-- Grille des surveys -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <SurveyCard
        v-for="survey in surveys"
        :key="survey.guid"
        :survey="survey"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import SurveyService from "@/frontend/service/survey.service.ts";
import SurveyCard from "@/frontend/view/components/surveyCard.vue";
import Header from '@/frontend/view/components/header.vue';
import Dashboard from '@/frontend/view/components/dashboard.vue';

const surveys = ref<any[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    surveys.value = await SurveyService.getAll();
    console.log("Surveys récupérés:", surveys.value);
  } catch (error) {
    console.error("Impossible de récupérer les surveys", error);
  } finally {
    loading.value = false;
  }
});
</script>
