<script setup>
import { ref, computed, onMounted } from "vue";
import { useCartStore } from "../../stores/cart.store";
import { useAuthStore } from "../../stores/auth.store";
import { storeToRefs } from "pinia";
import axios from "axios";
import { useRouter } from "vue-router";

const cartStore = useCartStore();
const authStore = useAuthStore();
const { courses } = storeToRefs(cartStore);
const router = useRouter();

const loading = ref(false);
const error = ref("");

// Fetch cart items on mount
onMounted(async () => {
  await cartStore.fetchCourses();
});

// Calculate total price
const total = computed(() => {
  return courses.value.reduce((acc, course) => acc + (course.price || 0), 0).toFixed(2);
});

// Create Stripe checkout session
const createCheckoutSession = async () => {
  try {
    loading.value = true;
    error.value = "";

    if (courses.value.length === 0) {
      error.value = "Your cart is empty";
      return;
    }

    // Prepare cart items for Stripe
    const cartItems = courses.value.map(course => ({
      _id: course._id,
      title: course.title,
      price: course.price,
      courseImg: course.courseImg,
      quantity: course.quantity || 1
    }));

    console.log("Cart items being sent:", cartItems);

    // Get token from localStorage
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    
    if (!token) {
      error.value = "Authentication required. Please log in again.";
      return;
    }
    
    // Create checkout session
    const response = await axios.post(
      "http://localhost:3000/api/payment/create-checkout-session",
      { 
        courses: cartItems,
        userId: authStore.user?._id
      },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const { url } = response.data;

    if (!url) {
      error.value = "Failed to get checkout URL";
      return;
    }

    // Redirect to Stripe Checkout
    window.location.href = url;

  } catch (err) {
    console.error("Checkout error:", err);
    console.error("Error response:", err.response?.data);
    console.error("Axios config:", err.config);
    error.value = err.response?.data?.message || "Payment processing failed";
  } finally {
    loading.value = false;
  }
};

const removeFromCart = async (courseId) => {
  await cartStore.removeCourseFromCart(courseId);
};
</script>

<template>
  <div class="min-h-screen max-w-screen">
    <!-- <div v-if="courses.length === 0" class="flex justify-center items-center h-screen">
      <div class="text-center">
        <p class="text-2xl font-bold mb-4">Your cart is empty</p>
        <RouterLink to="/courses" class="text-blue-500 underline">
          Continue Shopping
        </RouterLink>
      </div>
    </div> -->

    <div class="flex justify-center gap-3 mt-5 md:flex-row flex-col container mx-auto">
      <div class="bg-white rounded-lg shadow-lg mt-5 sm:w-full md:w-[50%]">
        <div class="p-3">
          <div class="mt-2">
            <p class="text-[30px] font-bold">Checkout</p>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ error }}
          </div>

          <div class="mt-2">
            <p class="text-lg font-semibold">Billing Address</p>
            <p class="text-md font-semibold mt-2">Country</p>
            <select
              name="country"
              id="country"
              class="border rounded-md outline-1 p-2 w-60"
            >
              <option value="vn">Vietnam</option>
              <option value="us">United States</option>
              <option value="uk">United Kingdom</option>
              <option value="au">Australia</option>
              <option value="ca">Canada</option>
            </select>
          </div>

          <div>
            <p class="font-semibold text-lg mt-4 mb-2">Payment method</p>
            <div
              class="flex justify-between items-center p-3 border outline-gray-300 border-gray-300"
            >
              <div>
                <i class="fa-solid fa-credit-card text-[24px] mr-2"></i>
                <span class="text-lg font-bold">Stripe Payment</span>
              </div>
              <div class="flex gap-2">
                <img
                  class="object-fill rounded max-w-13 max-h-7"
                  src="/images/Visa.png"
                  alt="Visa"
                />
                <img
                  class="object-cover rounded max-w-13 max-h-7"
                  src="/images/jcb.png"
                  alt="JCB"
                />
                <img
                  class="object-cover rounded max-w-13 max-h-7"
                  src="/images/amex.png"
                  alt="Amex"
                />
              </div>
            </div>

            <div class="border p-3 flex flex-col outline-gray-300 border-gray-300 bg-blue-50">
              <p class="text-sm text-blue-700 mb-2">
                <i class="fa-solid fa-info-circle mr-2"></i>
                You will be redirected to Stripe's secure checkout page
              </p>
              <p class="text-xs text-gray-600">
                No card details are stored on our servers
              </p>
            </div>

            <button
              @click="createCheckoutSession"
              :disabled="loading"
              class="border p-3 bg-green-500 text-white font-bold rounded-md mt-6 w-full hover:bg-green-600 disabled:bg-gray-400"
            >
              {{ loading ? "Processing..." : "Proceed to Stripe Payment" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="mt-5 md:w-[30%] sm:w-full">
        <div class="flex flex-col rounded-lg shadow-lg bg-white max-h-auto p-3 md:w-auto">
          <div class="font-bold text-[30px] mt-2">Order Total</div>
          <div class="max-w-full">
            <div class="flex items-center justify-between border-b p-2">
              <span>Total Price:</span>
              <span class="font-bold text-2xl text-green-500">{{ total }} $</span>
            </div>

            <div class="flex flex-col p-2 space-y-3">
              <div
                v-for="course in courses"
                :key="course._id"
                class="flex justify-between gap-5 pb-3 border-b"
              >
                <div class="flex gap-2 flex-1">
                  <img
                    :src="course.courseImg"
                    :alt="course.title"
                    class="border max-w-12 max-h-12 object-cover"
                  />
                  <div class="text-[14px] font-bold flex-1">
                    {{ course.title }}
                  </div>
                </div>
                <div class="flex flex-col items-end gap-1">
                  <div class="text-green-500 font-bold">{{ course.price }} $</div>
                  <button
                    @click="removeFromCart(course._id)"
                    class="text-red-500 hover:text-red-700 text-sm"
                  >
                    <i class="fa-solid fa-trash"></i> Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
