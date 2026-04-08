<script setup>
const emit = defineEmits(["confirm", "cancel"]);
const props = defineProps({ show: Boolean, message: String, header: String, color: String });
const handleConfirmation = function () {
  emit('confirm');
};

const handleCancel = function () {
  emit('cancel');
};
</script>
<template>
  <div v-if="show" class="shadow-overlay top-0 left-0 z-1000 fixed flex justify-center h-full w-full items-center">
    <div class="outline-1 bg-white outline-gray-300 rounded-t-lg">
      <div
        :class="props.color + ` p-5 rounded-t-lg flex items-center justify-between`"
      >
        <div class="text-sm font-semibold tracking-wide text-white">
          {{ props.header }}
        </div>
        <i class="fa fa-x text-white"></i>
      </div>
      <div class="p-7 text-left text-[16px] border-b-1 border-gray-300">
        {{ props.message }}?
      </div>

      <div class="flex justify-end p-4 text-sm gap-3 ">
        <button
          @click="handleCancel"
          class="p-3 rounded-lg bg-gray-100 font-semibold hover:opacity-60 duration-200 cursor-pointer"
        >
          Cancel
        </button>
        <button
          @click="handleConfirmation"
          class="p-3 rounded-lg bg-green-500 text-white cursor-pointer hover:bg-black hover:text-white duration-200 font-semibold"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.shadow-overlay {
      background-color: rgba(0, 0, 0, 0.6); 
}
</style>