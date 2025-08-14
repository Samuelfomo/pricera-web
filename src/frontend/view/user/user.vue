<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <Header/>
    <Dashboard/>
    <!-- Header -->
      <h1 class="text-3xl font-bold text-gray-800">Gestion des Utilisateurs</h1>

<!--    &lt;!&ndash; Formulaire de création &ndash;&gt;-->
<!--    <div class="bg-white p-6 rounded-2xl shadow-md max-w-xl mx-auto">-->
<!--      <h2 class="text-xl font-semibold mb-4">Créer un nouvel utilisateur</h2>-->
<!--      <form class="space-y-4" @submit.prevent="addUser">-->
<!--        &lt;!&ndash; Nom &ndash;&gt;-->
<!--        <div>-->
<!--          <label class="block text-gray-700 font-medium mb-1">Nom complet</label>-->
<!--          <input v-model="newUser.name" type="text" placeholder="Ex: Jean Dupont"-->
<!--                 class="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none" />-->
<!--        </div>-->

<!--        &lt;!&ndash; Email &ndash;&gt;-->
<!--        <div>-->
<!--          <label class="block text-gray-700 font-medium mb-1">Email</label>-->
<!--          <input v-model="newUser.email" type="email" placeholder="exemple@mail.com"-->
<!--                 class="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none" />-->
<!--        </div>-->

<!--        &lt;!&ndash; Rôle &ndash;&gt;-->
<!--        <div>-->
<!--          <label class="block text-gray-700 font-medium mb-1">Rôle</label>-->
<!--          <select v-model="newUser.role"-->
<!--                  class="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none">-->
<!--            <option value="integrateur">Intégrateur</option>-->
<!--            <option value="admin">Administrateur</option>-->
<!--            <option value="collaborateur">Collaborateur</option>-->
<!--          </select>-->
<!--        </div>-->

<!--        &lt;!&ndash; Bouton &ndash;&gt;-->
<!--        <div class="pt-4">-->
<!--          <button type="submit"-->
<!--                  class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">-->
<!--            Créer l’utilisateur-->
<!--          </button>-->
<!--        </div>-->
<!--      </form>-->
<!--    </div>-->

    <!-- Liste des utilisateurs -->
    <div class="mt-10 bg-white p-6 rounded-2xl shadow-md">
      <h2 class="text-xl font-semibold mb-4">Liste des utilisateurs</h2>
      <table class="w-full border-collapse">
        <thead>
        <tr class="bg-gray-200 text-gray-700">
          <th class="p-2 text-left">Nom</th>
<!--          <th class="p-2 text-left">Email</th>-->
          <th class="p-2 text-left">Rôle</th>
          <th class="p-2 text-center">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(user, index) in users" :key="index" class="border-b hover:bg-gray-50">
          <td class="p-2">{{ user.name }}</td>
          <td class="p-2">{{ user.email }}</td>
          <td class="p-2 capitalize">{{ user.role }}</td>
          <td class="p-2 text-center">
            <button class="text-red-600 hover:underline" @click="removeUser(index)">Supprimer</button>
          </td>
        </tr>
        <tr v-if="users.length === 0">
          <td colspan="4" class="text-center text-gray-500 py-4">Aucun utilisateur créé pour l’instant</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from '@/frontend/view/components/header.vue';
import Dashboard from '@/frontend/view/components/dashboard.vue';

// Liste des utilisateurs
const users = ref([])

// Formulaire d’ajout
const newUser = ref({
  name: '',
  email: '',
  role: 'integrateur'
})

// Fonction pour ajouter un utilisateur
const addUser = () => {
  if (!newUser.value.name || !newUser.value.email) {
    alert("Veuillez remplir tous les champs")
    return
  }

  users.value.push({ ...newUser.value })

  // Reset du formulaire
  newUser.value = { name: '', email: '', role: 'integrateur' }
}

// Fonction pour supprimer un utilisateur
const removeUser = (index) => {
  users.value.splice(index, 1)
}
</script>
