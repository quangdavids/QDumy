<script setup>
import { ref } from "vue";
const props = defineProps([
  "images",
  "title",
  "price",
  "description",
  "lecturer",
  "progress",
  "ownedStatus"
]);

</script>

<template>
 
    
    <div
      class="max-w-full  max-h-[420px] gap-2 bg-gray-50 shadow h-auto
      flex flex-col self-center justify-between border-gray-50 rounded-xl
      hover:shadow-xl/30 transform duration-400  cursor-pointer p-3"
    >
      <div class="relative">
        <div class="relative overflow-hidden">
  <img  :src="images"  class="transform w-full 
  object-cover h-50 -z-2 transition-transform  duration-300 hover:scale-110">
</div>
       
        <button class=" absolute top-0.5 
       cursor-pointer hover:inset-shadowx-xs transform
       durarion-300 right-1 rounded-full w-10 h-10 z-2 bg-white">
        <i
          class="fa-regular fa-heart mt-1 text-center text-2xl"
          style="color: tomato"
        ></i>
        </button>
        
      </div>

      <div class="flex flex-col  mb-auto max-w-lg gap-1 text-[15px] font-bold  ">
        <div class="text-md">
          {{ title }}
        </div>
        <div class="font-medium   text-gray-500 mb-2 text-[11px]">
          Lecturer: {{ lecturer }}
        </div>
        <div class="flex justify-center space-x-2 items-center "></div>

        <div class="font-medium">
          <div>
            <span class="text-yellow-500">
              <i class="fa-solid fa-star"> </i>
            </span>
            4.9 (27.312 reviews)
          </div>
        </div>
        <div class="font-medium">
             <div>
              <i class="fa-solid fa-book-open"> </i>
            301 lectures
          </div>
        </div>

        <div v-if="props.price === 0" class="text-green-500 font-bold  text-xl">
           Free
        </div>

         <div v-else class="text-green-500 font-bold  text-xl">
           {{ price }} $
        </div>

        <!-- <div v-if="props.progress === `Learning`" class="w-auto 
        rounded-full p-1.5 bg-yellow-400 text-white shadow-sm ">
           {{ progress }}
        </div>

        <div v-if="props.progress === `Completed`" class=" 
        rounded-full p-1.5 bg-green-400 text-white shadow-sm ">
           {{ progress }}
        </div> -->

    
      </div>
    </div>

</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap");

*:not(i) {
  font-family: "Montserrat";
}
</style>
