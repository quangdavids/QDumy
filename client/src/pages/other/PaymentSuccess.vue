<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useCartStore } from "../../stores/cart.store";
import { useAuthStore } from "../../stores/auth.store";

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();

const loading = ref(true);
const order = ref(null);
const error = ref("");

onMounted(async () => {
  try {
    const sessionId = route.query.session_id;

    if (!sessionId) {
      error.value = "Invalid session";
      loading.value = false;
      return;
    }

    // Get token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      error.value = "Authentication required";
      loading.value = false;
      return;
    }

    // Verify payment with backend
    const response = await axios.get(
      `http://localhost:3000/api/payment/verify-payment?session_id=${sessionId}&userId=${authStore.user?._id}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    order.value = response.data.order;

    // Clear cart after successful payment
    await cartStore.fetchCourses();
    // You might want to add a clearCart action to the store

    loading.value = false;
  } catch (err) {
    console.error("Error verifying payment:", err);
    error.value = err.response?.data?.message || "Payment verification failed";
    loading.value = false;
  }
});

const continueToLearning = () => {
  router.push("/dashboard");
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
      <div v-if="loading" class="text-center">
        <div class="mb-4">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
        </div>
        <p class="text-gray-600">Verifying your payment...</p>
      </div>

      <div v-else-if="error" class="text-center">
        <div class="mb-4">
          <i class="fa-solid fa-exclamation-circle text-red-500 text-5xl"></i>
        </div>
        <h2 class="text-2xl font-bold text-red-600 mb-2">Payment Error</h2>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button
          @click="router.push('/cart')"
          class="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Back to Cart
        </button>
      </div>

      <div v-else-if="order" class="text-center">
        <div class="mb-4">
          <i class="fa-solid fa-check-circle text-green-500 text-5xl"></i>
        </div>
        <h2 class="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
        <p class="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        <div class="bg-gray-100 p-4 rounded mb-6 text-left">
          <h3 class="font-bold mb-3">Order Details</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span>Order ID:</span>
              <span class="font-mono">{{ order._id }}</span>
            </div>
            <div class="flex justify-between">
              <span>Total Amount:</span>
              <span class="font-bold text-green-600">{{ order.totalAmount }} $</span>
            </div>
            <div class="flex justify-between">
              <span>Date:</span>
              <span>{{ new Date(order.createdAt).toLocaleDateString() }}</span>
            </div>
            <div class="flex justify-between">
              <span>Number of Courses:</span>
              <span>{{ order.courses?.length || 0 }}</span>
            </div>
          </div>
        </div>

        <button
          @click="continueToLearning"
          class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 mb-3"
        >
          Start Learning
        </button>

        <button
          @click="router.push('/courses')"
          class="w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400"
        >
          Continue Shopping
        </button>

        <p class="text-xs text-gray-500 mt-4">
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </div>
  </div>
</template>
