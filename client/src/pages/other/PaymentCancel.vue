<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
      <div class="mb-4">
        <i class="fa-solid fa-times-circle text-red-500 text-5xl"></i>
      </div>

      <h2 class="text-2xl font-bold text-red-600 mb-2">Payment Cancelled</h2>

      <p class="text-gray-600 mb-6">
        Your payment has been cancelled. No charges have been made to your account.
      </p>

      <p class="text-gray-600 mb-6">
        Your items remain in your cart and you can complete the payment anytime.
      </p>

      <button
        @click="router.push('/cart')"
        class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mb-3"
      >
        Back to Cart
      </button>

      <button
        @click="router.push('/courses')"
        class="w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400"
      >
        Continue Shopping
      </button>
    </div>
  </div>
</template>
