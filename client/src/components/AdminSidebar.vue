<script setup>
import { RouterView, RouterLink, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from "../stores/auth.store";
import { storeToRefs } from 'pinia';
const route = useRoute()
const router = useRouter()
const isActiveRoute = (path) => route.path === path;
const authStore = useAuthStore()
const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>

    <aside class="w-80 h-screen  border-r-gray-200 border-r-1 p-4">
      <div class="flex flex-col gap-2 h-full">
        <div>
          <p class="text-xs font-bold mb-1">QDumy Center</p>
          <p class="text-xs text-gray-400 font-bold">Administrator</p>
        </div>

        <RouterLink to="/admin/overview">
        <div
          :class= "isActiveRoute(`/admin/overview`)
          ? `flex items-center gap-4 px-3 py-2 bg-green-500 text-white rounded-lg duration-300 cursor-pointer`
          : `flex items-center gap-4  ml-1 px-3 py-2 hover:bg-green-200 hover:text-green-600 rounded-lg duration-300 cursor-pointer`"
        >
          <i class="fa fa-dashboard text-xl"></i>
          <p class="text-sm font-semibold">Overview</p>
        </div>
        </RouterLink>

          <RouterLink to="/admin/course-approval">
        <div
          :class= "isActiveRoute(`/admin/course-approval`)
          ? `flex items-center gap-4 px-3 py-2 bg-green-500 text-white rounded-lg duration-300 cursor-pointer`
          : `flex items-center gap-4 px-3 ml-1 py-2 hover:bg-green-200 hover:text-green-600 rounded-lg duration-300 cursor-pointer`"
        >
        <!-- <div
          class="flex items-center gap-3 px-3 py-2 hover:bg-green-200 rounded-lg duration-300 cursor-pointer"
        > -->
          <i class="fa fa-graduation-cap text-xl"></i>
          <p class="text-sm font-semibold">Course Manager</p>
        </div>
        </RouterLink>
        
        <RouterLink to="/admin/user-directory">
        <div
          :class= "isActiveRoute(`/admin/user-directory`)
          ? `flex items-center gap-4 px-3 py-2 bg-green-500 text-white rounded-lg duration-300 cursor-pointer`
          : `flex items-center gap-4 px-3 py-2 ml-1 hover:bg-green-200 hover:text-green-600 rounded-lg duration-300 cursor-pointer`"
        >
          <i class="fa fa-users text-xl"></i>
          <p class="text-sm font-semibold">Users Directory</p>
        </div>
        </RouterLink>

        <div
          @click="logout"
          class= "`flex  items-center cursor-pointer text-red-500 gap-4  ml-1 px-3 py-2 hover:bg-green-200 hover:text-green-600 rounded-lg duration-300 cursor-pointer`"
        >
          
          <div class="text-sm font-semibold flex gap-4">
            <i class="fa-solid fa-door-open text-xl"></i>Logout</div>
        </div>
      </div>
    </aside>

</template>