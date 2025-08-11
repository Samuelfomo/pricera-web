<template>
  <div class="p-6 max-w-4xl mx-auto">
    <!-- Navigation des onglets -->
    <div class="flex border-b border-gray-300 mb-6">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="activeTab = tab"
        :class="[
          'px-4 py-2 -mb-px border-b-2 font-medium',
          activeTab === tab
            ? 'border-blue-500 text-blue-500'
            : 'border-transparent text-gray-500 hover:text-blue-400'
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Contenu dynamique -->
    <div class="bg-white rounded-lg shadow p-4 min-h-[200px]">
      <div v-if="activeTab === 'Lexicon'">
        <h2 class="text-xl font-bold mb-2">Lexicon</h2>
        <p>Contenu du lexique…</p>
      </div>

      <div v-else-if="activeTab === 'Country'">
        <h2 class="text-xl font-bold mb-2">Country</h2>
        <p>Liste ou infos sur les pays…</p>
      </div>

      <div v-else-if="activeTab === 'Sector'">
        <h2 class="text-xl font-bold mb-2">Sector</h2>
        <p>Infos sectorielles…</p>
      </div>

      <div v-else-if="activeTab === 'Users'">
        <h2 class="text-xl font-bold mb-2">Users</h2>
        <p>Liste des utilisateurs…</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TabsPage",
  data() {
    return {
      tabs: ["Lexicon", "Country", "Sector", "Users"],
      activeTab: "Lexicon",
    };
  },
};
</script>

<style>
/* Tailwind gère déjà le style, pas besoin de CSS perso ici */
</style>
