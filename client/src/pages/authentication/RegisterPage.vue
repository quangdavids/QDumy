<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useAuthStore } from "../../stores/auth.store";
const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const authStore = useAuthStore();
const router = useRouter();
const error = ref("");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

    // Only push to router if registration was successful (no error in store)
    if (!authStore.error) {
      router.push("/");
    } else {
      error.value = authStore.error;
    }
  } catch (e) {
    error.value = e.response?.data?.message || "Registration failed";
    console.log(e);
  }
};
const isPasswordShown = ref(false)
const showPassword = function() {
    isPasswordShown.value = !isPasswordShown.value
}
watch([password, confirmPassword], () => {
  if (confirmPassword.value !== password.value) {
    error.value = "Password do not match";
  } else {
    error.value = "";
  }
});

watch(email, () => {
  if (!emailRegex.test(email.value) && email.value) {
    error.value = "Please enter a valid email address.";
  } else if (!email.value || emailRegex.test(email.value) ) {
    error.value = "";
  }
});
</script>

<template>
  <div class="w-full min-h-screen flex flex-col lg:flex-row bg-white">
    <!-- Form Section -->
    <div
      class="flex flex-col justify-center items-center w-full lg:w-1/2 px-10 py-10 lg:py-0"
    >
      <div class="w-full max-w-md bg-white rounded-lg p-6 space-y-6">
        <h2 class="text-2xl font-bold text-center">Account Registration</h2>

        <form class="space-y-4">
          <!-- Username -->
          <div>
            <label for="username" class="block text-md mb-1">Username</label>
            <input
              v-model="username"
              placeholder="Type your username here"
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
              placeholder="janeDoe@gmail.com"
              type="email"
              id="email"
              class="block w-full bg-gray-200 focus:ring-primary-600 focus:border-primary-600 p-2.5 rounded-lg"
            />
          </div>

          <div class="relative">
            <label for="password" class="block text-md mb-1">Password</label>
            <input
              v-model="password"
               placeholder="••••••••"
              :type="isPasswordShown ? `text` : `password`"
              id="password"
              class="block w-full bg-gray-200 focus:ring-primary-600 focus:border-primary-600 p-2.5 rounded-lg"
              />
              <i @click="showPassword()" class="fa-solid fa-eye absolute right-4 bottom-3 hover:text-green-500 duration-300 cursor-pointer "></i>
          </div>

          <div  class="relative ">
            <label for="confirmPassword" class="block text-md mb-1"
              >Confirm Password</label
            >
            <input 
              v-model="confirmPassword"
              :type="isPasswordShown ? `text` : `password`"
               placeholder="••••••••"
              id="confirmPassword"
              class="block w-full bg-gray-200 focus:ring-primary-600 focus:border-primary-600 p-2.5 rounded-lg"
            />
            <i @click="showPassword()" class="fa-solid fa-eye absolute right-4 bottom-3 hover:text-green-500 duration-300 cursor-pointer "></i>
          </div>
          <div
            v-if="error"
            class="text-red-500 text-center mb-4 bg-red-200 p-3 rounded-lg"
          >
            {{ error }}
          </div>

          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              class="w-5 h-5 cursor-pointer"
            />
            <label for="remember">Remember Me</label>
          </div>

          <button
            @click.prevent="registerUser()"
            class="font-bold mt-6 bg-green-500 w-full text-white p-3 rounded-full hover:bg-green-600 transition"
          >
            Register
          </button>

          <p class="text-center text-gray-600 text-sm mt-8">
            ALready have an account?
            <router-link
              to="/login"
              class="text-green-500 font-semibold hover:text-green-600 transition"
            >
              Log In here
            </router-link>
          </p>

          <!-- <p class="text-center ">Or</p>

           
       
           <button type="button" class="flex items-center justify-center gap-2 font-medium bg-red-500 w-full text-white p-3 rounded-full hover:bg-red-600 transition">
             <i class="fa-brands fa-google"></i> Connect with Google
           </button> -->
        </form>
      </div>
    </div>

    <!-- Image Section -->
    <div
      class="hidden lg:flex w-1/2 items-center justify-center bg-gray-100 min-h-screen"
    >
      <img
        src="/images/student1.jpg"
        alt="Registration Banner"
        class="object-cover w-full h-full"
      />
    </div>
  </div>
</template>
