<template>
  <div class="bg-gray-100 min-h-screen">
    <div class="flex flex-col items-stretch">
      <!-- Header -->
      <div class="bg-[saddlebrown] text-white text-center py-6 px-4 relative h-[190px]">
        <h1 class="text-xl font-bold">Pricera</h1>
        <p class="text-sm">Enter your data account</p>
      </div>

      <!-- Card -->
      <div
        class="w-full max-w-4xl bg-white rounded-t-3xl shadow-md relative -top-20 mx-auto p-6"
      >
        <h2 class="text-lg font-semibold mb-4">Authentification</h2>

        <!-- Email -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">E-mail*</label>
          <input
            type="email"
            v-model="email"
            @input="handleEmailChange"
            :disabled="loading"
            placeholder="exemple@email.com"
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <p v-if="emailError" class="text-red-500 text-sm mt-1">{{ emailError }}</p>
        </div>

        <!-- Link -->
        <div class="text-right mb-2">
          <RouterLink to="#" class="text-blue-600 text-sm hover:underline">
            I have valid key
          </RouterLink>
        </div>

        <!-- Submit button -->
        <button
          @click="handleSubmit"
          :disabled="!isEmailValid() || loading"
          class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          <span
            v-if="loading"
            class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"
          ></span>
          <span>{{ loading ? "Envoi en cours..." : "Envoyer" }}</span>
        </button>

        <!-- Footer -->
        <div class="text-center mt-4">
          <p class="text-sm">
            Don't have an account?
            <RouterLink to="/signUp" class="text-blue-600 hover:underline">
              Yes
            </RouterLink>
          </p>
        </div>
      </div>
    </div>

    <!-- Snackbar -->
    <transition name="fade">
      <div
        v-if="notification.open"
        class="fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg max-w-md text-white"
        :class="{
          'bg-green-500': notification.severity === 'success',
          'bg-red-500': notification.severity === 'error',
          'bg-yellow-500': notification.severity === 'warning',
          'bg-blue-500': notification.severity === 'info'
        }"
      >
        <div class="flex justify-between items-center">
          <span>{{ notification.message }}</span>
          <button @click="handleCloseNotification" class="ml-4 font-bold">×</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import authCtrl from '@/frontend/Ctr/auth.ts';

const router = useRouter();

const email = ref<string>("");
const loading = ref<boolean>(false);
const emailError = ref<string>("");

const notification = ref({
  open: false,
  message: "",
  severity: "info" as "success" | "error" | "warning" | "info"
});

// Changement email + reset erreurs
const handleEmailChange = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  email.value = value;
  if (emailError.value) emailError.value = "";
};

// Notification
const showNotification = (message: string, severity: "success" | "error" | "warning" | "info") => {
  notification.value = { open: true, message, severity };
};

const handleCloseNotification = () => {
  notification.value.open = false;
};

const handleSubmit = async () => {
  emailError.value = "";
  loading.value = true;

  try {
    const response = await authCtrl.requestLogin(email.value);
    if (response && response.success) {
      showNotification(
        response.message || "Un email contenant un code vous a été envoyé !",
        "success"
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));
      loading.value = false;
      router.push("/otpPage");
      return;
    } else {
      loading.value = false;
      if (response.error && response.error.includes("Email invalide")) {
        emailError.value = response.error;
        showNotification("Veuillez corriger l'adresse email", "error");
      } else {
        showNotification(
          authCtrl.formatResponseMessage(response),
          "error"
        );
      }
    }
  } catch (error) {
    loading.value = false;
    console.error("Erreur réseau :", error);
    showNotification(
      "Une erreur est survenue. Veuillez réessayer plus tard.",
      "error"
    );
  }
};

const isEmailValid = () => {
  if (!email.value) return false;
  const validation = authCtrl.validateEmail(email.value);
  return validation.isValid;
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
