<script setup>
import { RouterLink, RouterView, useRoute } from "vue-router";
import { ref } from "vue";
import InstructorSidebar from "../../components/InstructorSidebar.vue";
const route = useRoute();
const isActive = (path) => route.path === path;
console.log(route.path);

const isOpen = ref(false);
</script>

<template>
  <div class="min-h-screen  container  max-w-screen overflow-x-hidden">
    <div class="flex w-screen">  
      <InstructorSidebar v-if = "!route.meta.hideSidebar"/>
  <div class=" mx-auto  container ">
     <div class="px-2">
        <div class="flex justify-between mb-2">
          <div class="p-3 border-b-gray-200 w-full relative border-b-1">
            <input
              type="text"
              class="w-60 p-2 text-sm rounded-md bg-gray-100"
              placeholder="Global search"
            />
          </div>

          <div class="flex self-center gap-3 py-2 px-5">
          <div class="flex items-center justify-center w-16 h-12  
          bg-gray-200 rounded-full hover:bg-green-500 hover:text-white">
            <i class="fa fa-bell text-xl "></i>
          </div>
          <img src="/images/students/ebony.jpg" class="w-12 h-12 rounded-full">
          </div>
        </div>
      </div>
      <RouterView ></RouterView>
      </div>
    </div>
  </div>
</template>
