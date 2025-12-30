<script setup>
    
</script>


<template>
  <div class="min-h-screen bg-white">
    <div class="flex flex-col lg:flex-row h-screen">
      <!-- Image Section - Hidden on mobile, shown on desktop -->
      <div class="hidden lg:flex lg:w-1/2 bg-gray-50 justify-center items-center">
        <img src="/images/students/trish.jpeg" alt="Login illustration" class="w-full h-full object-cover" />
      </div>

      <!-- Login Form Section -->
      <div class="flex flex-col justify-center items-center w-full lg:w-1/2 px-4 sm:px-6 lg:px-8 py-8 md:py-0">
        <div class="w-full max-w-md">
          <h1 class="text-3xl sm:text-4xl font-bold mb-8 text-gray-900">
            Log In
          </h1>

          <form class="space-y-6">
            <!-- Username Input -->
            <div class="space-y-2">
              <label for="username" class="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input id="username" type="text" v-model="username" placeholder="your username"
                class="w-full px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition" />
            </div>

            <!-- Password Input -->
            <div class="space-y-2">
              <label for="password" class="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input id="password" type="password" v-model="password" placeholder="••••••••"
                class="w-full px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition" />
            </div>

            <!-- Remember Me -->
            <div class="flex items-center space-x-2">
              <input type="checkbox" id="remember" class="w-4 h-4 cursor-pointer accent-green-500 rounded" />
              <label for="remember" class="text-sm text-gray-600 cursor-pointer">
                Remember Me
              </label>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-700">{{ error }}</p>
            </div>

            <!-- Login Button -->
            <button @click.prevent="handleLogin" type="button"
              class="w-full py-2.5 px-4 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200">
              Log In
            </button>

            <!-- Divider -->
            <div class="relative py-4">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <!-- Google Login Button -->
            <button type="button"
              class="w-full py-2.5 px-4 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 flex items-center justify-center gap-2">
              <i class="fa-brands fa-google"></i>
              <span>Connect with Google</span>
            </button>
          </form>

          <!-- Sign Up Link -->
          <p class="text-center text-gray-600 text-sm mt-8">
            Don't have an account?
            <router-link to="/register" class="text-green-500 font-semibold hover:text-green-600 transition">
              Sign Up
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css"></style>