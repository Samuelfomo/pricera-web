<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Bar -->
    <Header />
    <Dashboard />

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto py-10">
      <h2 class="text-center text-lg text-gray-700 mb-8">
        Quel module souhaitez-vous gérer?
      </h2>

      <!-- Single grid, multiple cards -->
      <div class="grid grid-cols-4 gap-6">
        <div
          v-for="card in contentCards"
          :key="card.icon"
          class="bg-white border rounded-lg flex flex-col items-center justify-center py-8 cursor-pointer hover:shadow-lg transition"
        >
          <div class="text-4xl mb-4">
<!--            {{ card.icon }}-->
            <component :is="card.icon" stroke={2} :class="card.color" class="w-6 h-6 flex-shrink-0" />
          </div>
          <div class="text-gray-700 font-medium">{{ card.label }}</div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from '@/frontend/view/components/header.vue';
import Dashboard from '@/frontend/view/components/dashboard.vue';
import { ref } from 'vue';
import { IconBuildingFactory2, IconFlag, IconLanguage, IconPlanet, IconUsersGroup } from '@tabler/icons-vue';

const contentCards = ref([
  { icon: IconFlag, label: "Country" , color: "text-green-600" },
  { icon: IconLanguage, label: "Lexicon", color: "text-bleu-600", route: '/lexicon', roles: ['PARTNER', 'MANAGER'] },
  { icon:IconPlanet, label: "universe", color: "text-yellow-600" },
  { icon: IconUsersGroup, label: "User", color: "text-pupple-600" },
  { icon:IconBuildingFactory2, label: "Sector", color: "text-orange-600" },
]);
</script>

<style>
body {
  font-family: 'Segoe UI', sans-serif;
}
</style>

