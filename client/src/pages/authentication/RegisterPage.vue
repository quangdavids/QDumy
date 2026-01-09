<script setup>
import { ref} from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "../../stores/auth.store";
const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const authStore = useAuthStore();
const router = useRouter();
const error = ref("");
const registerUser = async () => {
  try {
    if (password.value !== confirmPassword.value) {
      error.value = "Password do not match";
      return;
    }

    if (
      !username.value ||
      !email.value ||
      !password.value ||
      !confirmPassword.value
    ) {
      error.value = "All fields are required";
      return;
    }
    await authStore.register({
      username: username.value,
      email: email.value,
      password: password.value,
    });

    router.push("/");
  } catch (e) {
    console.log(e);
  }
};
</script>

<template>
  <div class="w-full min-h-screen flex flex-col lg:flex-row bg-white">
    <!-- Form Section -->
    <div
      class="flex flex-col justify-center items-center w-full lg:w-1/2 px-6 py-10 lg:py-0"
    >
      <div class="w-full max-w-md bg-white rounded-lg p-6 space-y-6">
        <h2 class="text-2xl font-bold text-center">Account Registration</h2>

        <form class="space-y-4">
          <!-- Username -->
          <div>
            <label for="username" class="block text-md mb-1">Username</label>
            <input
              v-model="username"
              type="text"
              id="username"
              class="block w-full bg-gray-200 focus:ring-primary-600 focus:border-primary-600 p-2.5 rounded-lg"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-md mb-1">Email</label>
            <input
              v-model="email"
              type="email"
              id="email"
              class="block w-full bg-gray-200 focus:ring-primary-600 focus:border-primary-600 p-2.5 rounded-lg"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-md mb-1">Password</label>
            <input
              v-model="password"
              type="password"
              id="password"
              class="block w-full bg-gray-200 focus:ring-primary-600 focus:border-primary-600 p-2.5 rounded-lg"
            />
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-md mb-1"
              >Confirm Password</label
            >
            <input
              v-model="confirmPassword"
              type="password"
              id="confirmPassword"
              class="block w-full bg-gray-200 focus:ring-primary-600 focus:border-primary-600 p-2.5 rounded-lg"
            />
          </div>
          <div v-if="error" class="text-red-500 text-center mb-4">
            {{ error }}
          </div>
          <!-- Remember Me -->
          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              class="w-5 h-5 cursor-pointer"
            />
            <label for="remember">Remember Me</label>
          </div>

          <!-- Register Button -->
          <button
            @click.prevent="registerUser()"
            class="font-bold bg-green-500 w-full text-white p-3 rounded-full hover:bg-green-600 transition"
          >
            Register
          </button>

          <!-- Or Divider -->
          <p class="text-center">Or</p>

          <!-- Google Login -->
          <button
            type="button"
            class="flex items-center justify-center gap-2 font-medium bg-red-500 w-full text-white p-3 rounded-full hover:bg-red-600 transition"
          >
            <i class="fa-brands fa-google"></i> Connect with Google
          </button>
        </form>
      </div>
    </div>

    <!-- Image Section -->
    <div class="hidden lg:flex w-1/2 items-center justify-center bg-gray-100">
      <img
        src="/images/instructors/trish2.jpeg"
        alt="Registration Banner"
        class="object-cover w-full h-full min-h-screen"
      />
    </div>
  </div>
</template>
