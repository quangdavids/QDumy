<script setup>
import { RouterLink, RouterView, useRoute } from "vue-router";
import { ref } from "vue";
const route = useRoute();
const isActive = (path) => route.path === path;
console.log(route.path);


</script>

<template>
   
       
        <nav
          class="md:flex flex-col max-[640px]:hidden  min-h-screen w-80 flex-shrink border-l-gray-200  bg-gray-100 border-l-4 shadow-md "
        >
          <RouterLink to="/">
            <div class="ml-auto mr-auto">
              <img class="w-20 h-20" src="/images/quangdemy.png" />
            </div>
          </RouterLink>

          
          <RouterLink
            to="/instructor/dashboard"
            :class="
              isActive('/instructor/dashboard')
                ? 'w-full focus:bg-green-500'
                : 'w-full '
            "
          >
           <div
            class="flex p-3 transform items-baseline duration-150 hover:text-black gap-7 cursor-pointer hover:bg-green-500 w-full"
          >
            <i class="fa-solid fa-chart-simple ml-4 mt-1 text-xl"></i>
            <span class="text-md font-normal "> Dashboard </span>
          </div>
</RouterLink>

          <RouterLink
            to="/instructor/course"
            :class="
              isActive('/instructor/course')
                ? 'w-full focus:bg-green-500'
                : 'w-full '
            "
          >
            <div
              class="flex p-3 transform items-baseline duration-150 hover:text-black gap-7 cursor-pointer hover:bg-green-500"
            >
              <i class="fa-solid fa-book text-xl ml-4 "></i>
              <span class="text-md font-normal  "> Courses </span>
            </div>
          </RouterLink>


           <RouterLink
            to="/instructor/enrolled-students"
            :class="
              isActive('/instructor/enrolled-students')
                ? 'w-full focus:bg-green-500'
                : 'w-full '
            "
          >
          <div
            class="flex p-3 transform items-baseline duration-150 hover:text-black gap-7 cursor-pointer hover:bg-green-500 w-full"
          >
            <i class="fa-solid fa-graduation-cap mt-1 ml-3  text-xl"></i>
            <span class="text-md font-normal ">  Students </span>
          </div>
          </RouterLink>

         
          <!-- <div
            class="flex p-3 transform duration-150 hover:text-black gap-7 cursor-pointer hover:bg-green-500 w-full"
          >
            <i class="fa-solid fa-gear mt-1 ml-4 text-xl"></i>
            <span class="text-md font-normal "> Tools </span>
          </div> -->

        <RouterLink 
          to="/instructor/course/manage/"
           :class="
              isActive('/instructor/course/manage/')
                ? 'w-full focus:bg-green-500'
                : 'w-full '
            "
            >
          
     
          <div
            class="flex p-3 transform items-baseline duration-150 hover:text-black gap-7 cursor-pointer hover:bg-green-500 w-full"
          >
            <i class="fa-solid fa-plus mt-1 ml-4 text-xl"></i>
            <span class="text-md font-normal "> Add Course </span>
          </div>
   </RouterLink>
          <div
            class="flex p-3 transform items-baseline duration-150 hover:text-black gap-7 cursor-pointer hover:bg-green-500 w-full"
          >
            <i class="fa-solid fa-user mt-1 ml-4 text-xl"></i>
            <span class="text-md font-normal "> Profile </span>
          </div>

            <!-- <div
            class="flex p-3 transform items-baseline duration-150 hover:text-black gap-7 cursor-pointer hover:bg-green-500 w-full"
          >
            <i class="fa-solid fa-question mt-1 ml-5 text-xl"></i>
            <span class="text-md font-normal "> Quiz </span>
          </div> -->
        </nav>
         
     
</template>