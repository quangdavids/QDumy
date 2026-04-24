<script setup>
import { RouterLink } from "vue-router";
import { useRoute } from "vue-router";
import { ref, computed } from "vue";
import { useAuthStore } from "../stores/auth.store";
import { storeToRefs } from "pinia";
const route = useRoute();

const authStore = useAuthStore()

const logout = function() {
  authStore.logout()
}

const { user } = storeToRefs(authStore)
const isActiveRoute = (path) => route.path === path;

const isExpanded = ref(false);

const sidebarStatus = function() {
    isExpanded.value = !isExpanded.value
}
const growOrShrink = computed(() => {
  return isExpanded.value
    ? "w-60 bg-black min-h-screen text-white duration-300 transtion-all"
    : "w-12 bg-black min-h-screen text-white duration-300 transition-all";
});
</script>

<template>
  <div class="py-4 px-2 hidden md:block">
        <div class="w-64 border rounded-lg outline-2 border-green-500">
          <div class="flex-col flex overflow-auto p-3 gap-1">
            <p class="text-sm py-3 text-gray-500">Welcome, {{ user.username }} </p>

            <RouterLink to="/user/dashboard">
              <div
                :class="isActiveRoute(`/user/dashboard`) 
                ? `w-full rounded-lg flex gap-2 items-center  p-3 bg-green-500 text-white`
                : `w-full rounded-lg flex duration-300  gap-2 items-center p-3 hover:bg-green-500 hover:text-white`"
              >
                <i class="fa-solid fa-chart-line "></i>
                <span> Dashboard </span>
              </div>
            </RouterLink>

            <!-- <div class="hover:bg-green-500 cursor-pointer flex gap-6 items-center  py-3 px-3 w-full">
        <i class="fa-solid fa-magnifying-glass "></i> 
        <span >Explore </span>
      </div> -->
            <RouterLink to="/user/my-courses">
              <div
                :class="isActiveRoute(`/user/my-courses`) 
                ? `w-full rounded-lg flex gap-1 items-center p-3 bg-green-500 text-white`
                : `w-full rounded-lg flex  duration-300 gap-1 items-center p-3 hover:bg-green-500 hover:text-white`"
              >
                <i class="fa-solid fa-book mr-3"></i> <span> My Courses </span>
              </div>
            </RouterLink>
           

            <RouterLink to="/support">
              <div   :class="isActiveRoute(`/support`) 
                ? `w-full rounded-lg flex items-center p-3 bg-green-500 text-white`
                : `w-full rounded-lg flex duration-300 items-center p-3 hover:bg-green-500 hover:text-white`">
                <i class="fa-solid fa-question mr-5"></i>
                <span> Help </span>
              </div>
            </RouterLink>

            <RouterLink to="/contact">
            <div
                :class="isActiveRoute(`/contact`) 
                ? `w-full rounded-lg flex  items-center p-3 bg-green-500 text-white`
                : `w-full rounded-lg flex duration-300 items-center p-3 hover:bg-green-500 hover:text-white`"
            >
              <i class="fa-solid fa-comment-dots mr-4"></i>
              <span> Contact Us </span>
            </div>
          </RouterLink>
        
          <RouterLink to="/user/profile">
             <div
                :class="isActiveRoute(`/user/profile`) 
                ? ` duration-300 cursor-pointer rounded-lg hover:rounded-lg  py-3 px-3 flex gap-4 items-center w-full bg-green-500 text-white`
                : `hover:bg-green-500 rounded-lg hover:text-white duration-300 cursor-pointer hover:rounded-lg  py-3 px-3 flex gap-4 items-center w-full`"
            >

              <i class="fa-solid fa-user"></i>
              <span> Profile </span>
            </div>
            </RouterLink>

            <div
              class="hover:bg-green-500 text-red-500 duration-300 hover:text-white cursor-pointer py-3 hover:rounded-lg  px-3 flex gap-4 items-center w-full"
              @click="logout"
              >
              <i class="fa-solid fa-door-open"></i>
              <span> Log Out </span>
            </div>
          </div>
        </div>
      </div>
</template>
