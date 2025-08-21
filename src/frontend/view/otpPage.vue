<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md p-6 bg-white rounded-2xl shadow">
      <h1 class="text-2xl font-bold mb-2">Vérification</h1>
      <p class="text-gray-600 mb-4">
        Entrez le code de vérification à 6 chiffres qui a été envoyé à votre email.
      </p>

      <!-- Affichage des erreurs -->
      <div v-if="errors.length" class="mb-3">
        <div
          class="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm"
        >
          <div v-for="(error, i) in errors" :key="i">{{ error }}</div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit">
        <!-- Zone OTP -->
        <div
          class="flex justify-center gap-2 mb-4"
          @paste="handleContainerPaste"
        >
          <input
            v-for="(digit, i) in otp"
            :key="i"
            v-model="otp[i]"
            ref="otpRefs"
            type="text"
            inputmode="numeric"
            maxlength="1"
            class="w-12 h-12 text-center text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            :disabled="isLoading"
            @input="(e) => handleInput(i, e)"
            @keydown="(e) => handleKeyDown(i, e)"
          />
        </div>

        <!-- Bouton Vérifier -->
        <button
          type="submit"
          class="w-full py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
          :disabled="!isFormValid || isLoading"
        >
          <span v-if="isLoading" class="flex items-center justify-center gap-2">
            <svg
              class="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
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
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            Vérification...
          </span>
          <span v-else>Vérifier</span>
        </button>
      </form>

      <!-- Lien renvoi code -->
      <div class="mt-4 text-center text-sm text-gray-600">
        Vous n'avez pas reçu le code ?
        <button
          type="button"
          class="text-blue-600 underline disabled:opacity-50"
          @click="handleResendOtp"
          :disabled="isResending || resendCooldown > 0"
        >
          <span v-if="resendCooldown > 0">
            Renvoyer ({{ resendCooldown }}s)
          </span>
          <span v-else-if="isResending">Envoi...</span>
          <span v-else>Renvoyer</span>
        </button>
      </div>

      <!-- Snackbar -->
      <transition name="fade">
        <div
          v-if="showSnackbar"
          class="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          {{ successMessage }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import otpCtrl from '@/frontend/Ctr/otp.ts';

const router = useRouter();

const otp = ref<string[]>(new Array(6).fill(""));
const otpRefs = ref<HTMLInputElement[]>([]);

const isLoading = ref(false);
const isResending = ref(false);
const errors = ref<string[]>([]);
const successMessage = ref("");
const showSnackbar = ref(false);
const resendCooldown = ref(0);

let interval: NodeJS.Timeout | null = null;

// Gestion cooldown resend
onMounted(() => {
  if (resendCooldown.value > 0) {
    interval = setInterval(() => {
      resendCooldown.value = Math.max(0, resendCooldown.value - 1);
    }, 1000);
  }
});
onBeforeUnmount(() => {
  if (interval) clearInterval(interval);
});

// Entrée utilisateur
const handleInput = (index: number, e: Event) => {
  const value = (e.target as HTMLInputElement).value.replace(/\D/g, "");
  const newOtp = [...otp.value];

  if (value.length > 1) {
    const digits = value.slice(0, 6).split("");
    digits.forEach((d, i) => (newOtp[i] = d));
    otp.value = newOtp;
    setTimeout(() => {
      focusInput(Math.min(digits.length - 1, 5));
    }, 10);
    errors.value = [];
    return;
  }

  if (/^[0-9]$/.test(value)) {
    newOtp[index] = value;
    otp.value = newOtp;
    if (index < 5) focusInput(index + 1);
    errors.value = [];
  } else {
    newOtp[index] = "";
    otp.value = newOtp;
  }
};

const handleKeyDown = (index: number, e: KeyboardEvent) => {
  if (
    !/^[0-9]$/.test(e.key) &&
    !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key)
  ) {
    e.preventDefault();
    return;
  }

  if (e.key === "Backspace" || e.key === "Delete") {
    if (otp.value[index]) {
      otp.value[index] = "";
    } else if (index > 0) {
      otp.value[index - 1] = "";
      setTimeout(() => focusInput(index - 1), 10);
    }
  }

  if (e.key === "ArrowLeft" && index > 0) focusInput(index - 1);
  if (e.key === "ArrowRight" && index < 5) focusInput(index + 1);
};

const handleContainerPaste = (e: ClipboardEvent) => {
  e.preventDefault();
  const pasted = e.clipboardData?.getData("text") || "";
  const digits = pasted.replace(/\D/g, "").slice(0, 6).split("");
  if (!digits.length) return;

  const newOtp = new Array(6).fill("");
  digits.forEach((d, i) => (newOtp[i] = d));
  otp.value = newOtp;

  setTimeout(() => {
    focusInput(Math.min(digits.length - 1, 5));
  }, 10);

  errors.value = [];
};

const handleSubmit = async () => {
  isLoading.value = true;
  errors.value = [];
  successMessage.value = "";

  try {
    const code = otp.value.join("");
    if (code.length !== 6) {
      errors.value = ["Veuillez saisir les 6 chiffres du code OTP"];
      return;
    }

    // const response = await otpCtrl.verifyOtp(code);
    // if (response.success) {
    //   successMessage.value = response.message;
    //   showSnackbar.value = true;
    //   otpCtrl.handleVerificationSuccess(response.user);
    //   setTimeout(() => router.push("/home"), 2000);
    // } else {
    //   errors.value = [response.message];
    //   otpCtrl.handleVerificationError(response.error || response.message);
    // }
  } catch (error: any) {
    errors.value = [
      "Une erreur inattendue est survenue lors de la vérification",
    ];
    otpCtrl.handleVerificationError(error.message);
  } finally {
    isLoading.value = false;
    router.push("/home");
  }
};

const handleResendOtp = async () => {
  isResending.value = true;
  errors.value = [];
  successMessage.value = "";

  try {
    // const response = await otpCtrl.requestNewOtp();
    // if (response.success) {
    //   successMessage.value = response.message;
    //   showSnackbar.value = true;
    //   resendCooldown.value = 60;
    //   otp.value = new Array(6).fill("");
    //   setTimeout(() => focusInput(0), 100);
    // } else {
    //   errors.value = [response.message];
    // }
  } catch {
    errors.value = ["Erreur lors du renvoi du code OTP"];
  } finally {
    isResending.value = false;
  }
};

const focusInput = (i: number) => {
  const el = otpRefs.value[i];
  if (el) el.focus();
};

const isFormValid = computed(
  () => otp.value.every((d) => d !== "") && !isLoading.value
);
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

