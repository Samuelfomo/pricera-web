<template>
  <div class="survey-card p-4 rounded-2xl shadow-md border bg-white">
    <!-- Produit lié -->
    <div class="flex items-center gap-4">
      <img
        v-if="survey.product.images?.items?.length"
        :src="survey.product.images.items[0]"
        alt="product image"
        class="w-24 h-24 object-cover rounded-lg"
      />
      <div>
        <h2 class="text-lg font-bold">{{ survey.product.commercialName }}</h2>
        <p class="text-gray-500 text-sm">Barcode: {{ survey.product.barcode }}</p>
        <p class="text-gray-400 text-sm">Nomenclature: {{ survey.product.nomenclatures.items.join(', ') }}</p>
      </div>
    </div>

    <!-- Infos Survey -->
    <div class="mt-3 text-sm">
      <p><span class="font-semibold">Prix:</span> {{ survey.price }} FCFA</p>
      <p><span class="font-semibold">Marchand:</span> {{ survey.merchant }}</p>
      <p><span class="font-semibold">Lieu:</span> {{ survey.location }}</p>
      <p><span class="font-semibold">Date:</span> {{ new Date(survey.date).toLocaleDateString() }}</p>
    </div>

    <!-- Universes -->
    <div class="mt-3">
      <h3 class="text-md font-semibold">Universes:</h3>
      <ul class="list-disc list-inside text-sm">
        <li v-for="(universe, i) in survey.product.universes.items" :key="i">
          <span class="font-medium">{{ universe.name }}</span>
          <ul class="ml-4 list-disc list-inside">
            <li v-for="(sector, j) in universe.sectors.items" :key="j">
              {{ sector.name }} <span class="text-gray-500">{{ sector.description }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <!-- Compte / entreprise -->
    <div class="mt-3 border-t pt-2">
      <h3 class="text-md font-semibold">Entreprise:</h3>
      <p class="text-sm">{{ survey.account.company.name }}</p>
      <p class="text-xs text-gray-500">{{ survey.account.company.metadata.city }} · {{ survey.account.company.metadata.location }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  survey: {
    type: Object,
    required: true
  }
});
</script>
