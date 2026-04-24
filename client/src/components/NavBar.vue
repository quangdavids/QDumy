<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { RouterLink, useRouter, useRoute } from "vue-router";
import { ref, onMounted, computed, onUpdated, watch } from "vue";
import { useAuthStore } from "../stores/auth.store";
import { useCartStore } from "../stores/cart.store";
import { useNotificationStore } from "../stores/notification.store";
import { storeToRefs } from "pinia";
import axios from "axios";

let searchQuery = ref("");
const authStore = useAuthStore();
const cartStore = useCartStore();
const notificationStore = useNotificationStore();
const { isAuthenticated, user } = storeToRefs(authStore);
const { courses: cartCourses } = storeToRefs(cartStore);
const { notifications, unreadCount } = storeToRefs(notificationStore);
let results = ref([]);
const router = useRouter();
let menuOpen = ref(false);
const isMobileMenuOpen = ref(false);
const apiUrl = import.meta.env.VITE_API_URL;
const cartCount = computed(() => cartCourses.value?.length || 0);
const unread = computed(() => unreadCount.value || 0);
const signOut = async function () {
  try {
    await authStore.logout();
    router.push("/login");
  } catch (e) {
    console.log(e);
  }
};

const route = useRoute();

const handleSearch = async (e) => {
  try {
    if (searchQuery.value.trim()) {
      await router.push({
        path: "/course/search",
        query: { query: searchQuery.value },
      });
      isMobileMenuOpen.value = false;
    } else  {
        await router.push({
        path: "/course/search",
        query: {query: searchQuery.value}
      });
      isMobileMenuOpen.value = false;
    }
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

const createLecturer = async (lecturerId) => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/lecturer/${lecturerId}`,
    );
    await getLecturerStatus();
    router.push({
      path: "/instructor",
      params: lecturerId,
    });
    isMobileMenuOpen.value = false;
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
};

const toLecturer = async (lecturerId) => {
  router.push({
    path: "/instructor",
    params: lecturerId,
  });
};

const toStudentDashboard = async () => {
  if (isAuthenticated) {
  router.push({
    path: `/user/dashboard`
  })
} else {
  router.push('/home')
}
}

const status = ref(false);
const lecturer = ref("");
const getLecturerStatus = async () => {
  try {
    if (!user.value || !user.value._id) {
      status.value = false;
      return;
    }
    const response = await axios.get(
      `${apiUrl}/api/lecturer/${user.value._id}`,
    );
    if (response.status === 200 && response.data.lecturer) {
      status.value = true;
    } else {
      status.value = false;
    }
    console.log(response.data);
    console.log(status.value);
  } catch (err) {
    status.value = false;
    console.log(err);
  }
};
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

onMounted(() => {
  cartStore.fetchCourses();
  // Don't fetch notifications here - wait for socket to connect first
  // Socket connection will trigger the initial fetch in initSocket()
  if (!notificationStore.isConnected) {
    // Fallback: fetch if socket isn't connected within a timeout
    setTimeout(() => {
      if (!notificationStore.isConnected) {
        notificationStore.fetchNotfications();
      }
    }, 2000);
  }
  getLecturerStatus();
});

// Watch for user changes to update lecturer status
watch(() => user.value, () => {
  if (user.value) {
    getLecturerStatus();
  }
});


console.log(user);
</script>

<template>
  <nav class="bg-black border-gray-200 shadow-sm top-0 z-150">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between text-white items-center h-16">
        <!-- Logo Section -->
        <div class="flex-shrink-0 flex items-center gap-2">
          <RouterLink
            to="/"
            class="flex items-center hover:opacity-80 transition-opacity"
          >
            <img
              src="/images/quangdemy.png"
              class="h-8 w-auto"
              alt="QuangStudy Logo"
            />
            <span class="font-bold text-lg text-gray-900 ml-2 hidden sm:inline"
              >QuangStudy</span
            >
          </RouterLink>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden lg:flex items-center justify-between flex-1 ml-8">
          <!-- Search Bar -->
          <form @submit.prevent="handleSearch" class="flex-1 max-w-md">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                class="w-full bg-gray-100 text-gray-900 py-2 px-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                placeholder="Search courses..."
              />
              <button
                type="submit"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <i class="fa-solid fa-magnifying-glass text-sm"></i>
              </button>
            </div>
          </form>

          <div  class="flex items-center justify-end space-x-8 ml-8">
            <!-- Become a Lecturer -->

            <div
              v-if="!status"
              class="hover:text-green-600 transition-colors cursor-pointer text-sm font-medium"
              @click="createLecturer(user?._id)"
            >
              Become a Lecturer
            </div>

            <div
              v-else
              @click="toLecturer(user._id)"
              class="hover:text-green-600 transition-colors cursor-pointer text-sm font-medium"
            >
              Lecturer Area
            </div>
         

            <!-- Cart -->
            <RouterLink
              to="/cart"
              class="relative hover:text-green-600 transition-colors flex items-center gap-2"
              title="Shopping Cart"
            >
              <i class="fa-solid fa-shopping-cart text-lg"></i>
              <span
                v-if="cartCount > 0"
                class="absolute -top-2 -right-3 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-semibold"
              >
                {{ cartCount }}
              </span>
            </RouterLink>

            <Menu as="div" class="relative z-1000">
              <MenuButton
                class="flex gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div>
                  <i
                    class="fa-solid fa-bell hover:text-green-600 text-white text-lg"
                  ></i>
                  <span
                    v-if="unreadCount > 0"
                    class="absolute -top-2 -right-3 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-semibold"
                  >
                    {{ unread }}
                  </span>
                </div>
              </MenuButton>

              <!-- Dropdown Menu -->
              <transition-group
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="absolute  bg-white text-black -right-25 mt-2 w-90 rounded-lg shadow-lg border divide-y divide-gray-100 overflow-hidden"
                >
                  <p class="text-lg font-bold p-2 border-b-1 border-slate-200">
                    Notifications
                  </p>
                  <div >
                    <MenuItem
                     
                      v-if="notifications.length > 0"
                      v-for="notification in notifications"
                      :key="notification._id"
                      v-slot="{ active }"
                    >
                      <RouterLink :to="notification.link">
                        <div
                          @click="
                            notificationStore.readNotification(notification._id)
                          "
                          :class="
                            notification.isRead
                              ? `border-b-1 w-full bg-slate-100 border-gray-400 p-6  flex justify-between items-center gap-3 `
                              : `border-b-1 w-full hover:bg-slate-100 border-gray-400 p-6 items-center flex justify-between gap-3`
                          "
                        >
                          <div class="p-2 rounded-full">
                            <i
                              class="fa-solid fa-bell text-xl text-green-600"
                            ></i>
                          </div>
                          <div class="text-sm w-full">
                            {{ notification.message }}
                          </div>

                          <div
                            class="flex items-start"
                            @click="
                              notificationStore.deleteNotification(
                                notification._id,
                              )
                            "
                          >
                            <i
                              class="fa fa-x text-sm hover:text-red-500 duration-200 cursor-pointer"
                            ></i>
                          </div>
                        </div>
                      </RouterLink>
                    </MenuItem>

                    <MenuItem class="py-5 px-4" v-else>
                      <div class="flex justify-center text-sm">
                        You have no notifications
                      </div>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition-group>
            </Menu>

            <template v-if="isAuthenticated">
              <Menu as="div" class="relative z-1000">
                <MenuButton
                  class="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <div class="text-right hidden sm:block">
                    <p class="text-xs">Welcome</p>
                    <p class="text-sm font-medium text-gray-900">
                      {{ user?.username }}
                    </p>
                  </div>
                  <img
                    :src="user.profileImg"
                    class="w-9 h-9 rounded-full object-cover border border-gray-200 hover:border-green-500 transition-colors"
                    :alt="user?.username"
                  />
                </MenuButton>

                <!-- Dropdown Menu -->
                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <MenuItems
                    class="absolute bg-white text-black right-0 mt-2 w-56 rounded-lg shadow-lg border divide-y divide-gray-100 overflow-hidden"
                  >
                    <!-- User Info -->
                    <div class="px-4 py-3">
                      <p class="text-sm font-medium text-gray-900">
                        {{ user?.username }}
                      </p>
                      <p class="text-xs text-gray-500 mt-1 wrap-break-word">
                        {{ user?.email }}
                      </p>
                    </div>

                    <!-- Menu Items -->
                    <div class="py-1">
                      <MenuItem v-slot="{ active }">
                        <div
                          @click="toStudentDashboard"
                          :class="[
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm  hover:text-gray-900 transition-colors',
                          ]"
                        >
                          <i class="fa-solid fa-chart-line mr-2 w-4"></i
                          >Dashboard
                       </div>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                        <RouterLink
                          to="/user/profile"
                          :class="[
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm  hover:text-gray-900 transition-colors',
                          ]"
                        >
                          <i class="fa-solid fa-user mr-2 w-4"></i>Profile
                        </RouterLink>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                        <RouterLink
                          to="/cart"
                          :class="[
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm  hover:text-gray-900 transition-colors',
                          ]"
                        >
                          <i class="fa-solid fa-shopping-cart mr-2 w-4"></i>My
                          Cart
                        </RouterLink>
                      </MenuItem>
                    </div>

                    <!-- Sign Out -->
                    <div class="py-1">
                      <MenuItem v-slot="{ active }">
                        <button
                          @click="signOut"
                          :class="[
                            active ? 'bg-red-50' : '',
                            'w-full text-left px-4 py-2 text-sm text-red-600 hover:text-red-700 transition-colors',
                          ]"
                        >
                          <i class="fa-solid fa-sign-out-alt mr-2 w-4"></i>Sign
                          Out
                        </button>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </transition>
              </Menu>
            </template>

            <template v-else>
              <RouterLink
                to="/login"
                class="hover:text-green-600 transition-colors text-sm font-medium"
              >
                Login
              </RouterLink>
              <RouterLink
                to="/register"
                class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Sign Up
              </RouterLink>
            </template>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="flex lg:hidden gap-4">
          <!-- Mobile Cart -->
          <RouterLink
            to="/cart"
            class="relative hover:text-green-600 transition-colors"
          >
            <i class="fa-solid fa-shopping-cart text-xl"></i>
            <span
              v-if="cartCount > 0"
              class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-semibold"
            >
              {{ cartCount }}
            </span>
          </RouterLink>

          <!-- Mobile Menu Toggle -->
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="hover:text-green-600 transition-colors"
          >
            <i
              class="fa-solid text-xl"
              :class="isMobileMenuOpen ? 'fa-times' : 'fa-bars'"
            ></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isMobileMenuOpen"
        class="lg:hidden bg-white border-t border-gray-200"
      >
        <div class="px-2 pt-2 pb-3 space-y-1">
          <!-- Mobile Search -->
          <form @submit.prevent="handleSearch" class="p-2 mb-2">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                class="w-full bg-gray-100 text-gray-900 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Search courses..."
              />
              <button
                type="submit"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <i class="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
          </form>

          <!-- Mobile Menu Items -->
          <div class="space-y-1 border-t border-gray-100 pt-2">
            <div
              class="block px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer font-medium text-sm"
              @click="
                toLecturer(user?._id);
                closeMobileMenu();
              "
            >
              <i class="fa-solid fa-chalkboard-user mr-2 w-4"></i>Teach
            </div>

            <template v-if="isAuthenticated">
              <RouterLink
                to="/user/dashboard"
                class="block px-3 py-2 rounded-md hover:bg-gray-100 text-sm"
                @click="closeMobileMenu"
              >
                <i class="fa-solid fa-chart-line mr-2 w-4"></i>Dashboard
              </RouterLink>
              <RouterLink
                to="/user/profile"
                class="block px-3 py-2 rounded-md hover:bg-gray-100 text-sm"
                @click="closeMobileMenu"
              >
                <i class="fa-solid fa-user mr-2 w-4"></i>Profile
              </RouterLink>
              <button
                @click="
                  signOut();
                  closeMobileMenu();
                "
                class="w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50 text-sm font-medium"
              >
                <i class="fa-solid fa-sign-out-alt mr-2 w-4"></i>Sign Out
              </button>
            </template>
            <template v-else>
              <RouterLink
                to="/login"
                class="block px-3 py-2 rounded-md hover:bg-gray-100 text-sm font-medium"
                @click="closeMobileMenu"
              >
                <i class="fa-solid fa-sign-in-alt mr-2 w-4"></i>Login
              </RouterLink>
              <RouterLink
                to="/register"
                class="block px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 text-sm font-medium"
                @click="closeMobileMenu"
              >
                <i class="fa-solid fa-user-plus mr-2 w-4"></i>Sign Up
              </RouterLink>
            </template>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
.sticky {
  position: sticky;
  top: 0;
  z-index: 50;
}
</style>
