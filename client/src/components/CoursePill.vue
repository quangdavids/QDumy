<script setup>
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
  class="w-full bg-white border border-gray-200 rounded-lg shadow-sm
  hover:shadow-md transition p-2 flex gap-2 text-[11px]"
>
  <div class="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md">
    <img
      :src="images"
      class="w-full h-full object-cover"
    />
  </div>

  <div class="flex flex-col justify-between flex-1">
    <div>
      <p class="font-semibold leading-tight line-clamp-2">
        {{ title }}
      </p>

      <p class="text-gray-500 text-[10px]">
        {{ lecturer }}
      </p>
    </div>

    <div class="flex justify-between items-center mt-1">
      <span class="text-green-600 font-bold text-[12px]">
        {{ price === 0 ? "Free" : `$${price}` }}
      </span>

      <span class="text-yellow-500 text-[10px]">
        ★ 4.9
      </span>
    </div>
  </div>
</div>

</template>