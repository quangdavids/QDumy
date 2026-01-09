<script setup>
  import { computed, onMounted } from "vue";
  import { useCartStore } from "../../stores/cart.store";
  import { storeToRefs } from "pinia";
  const cartStore = useCartStore();
  const { courses } = storeToRefs(cartStore);

  onMounted(async () => {
    await cartStore.fetchCourses();
    console.log(courses.value);
    console.log(courses.value.lecturer)
  });
const deleteProduct = function (courseId) {
  cartStore.removeCourseFromCart(courseId);
}



const totalSum = computed(() => {
  return courses.value.reduce((sum, course) => sum + (course.price || 0), 0).toFixed(2);
});
</script>

<template>
  <div class="min-h-screen py-3 px-2 bg-[#fcfcfc] ">
    <p class="font-semibold mx-auto text-[48px] container p-5 ">Your Cart</p>

    <div class="flex container mx-auto md:flex-row flex-col">

      <div class="flex flex-col gap-2 flex-1 md:w-2/3">
        <div v-for="(c, index) in courses" :key="index" class="mr-4 shadow-lg bg-white rounded-lg">
          <div class="flex h-auto ">
            <div class="p-3">
              <img :src="c.courseImage" class="w-50 h-40 border object-cover">
            </div>
            <div class="flex flex-col flex-1">
              <div class="p-2 flex justify-between">
                <span class="font-semibold"> {{ c.title }} </span>
                <span @click="deleteProduct(c._id)"> <i class="fa-solid fa-x hover:text-red-500 cursor-pointer"></i> </span>
              </div>
              <div class="px-2">
                <p class="text-gray-600 text-sm"> By {{ c.lecturer }}</p>
                <p class="text-lg font-bold text-green-500">{{ c.price }}$</p>
              </div>

              <div class="mt-auto mb-3 text-sm ml-2">
                {{ c.lessons }} lectures . {{ c.hours }} hours
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="md:w-120 mt-4 md:mt-0 border border-[#ececec] shadow-md rounded-lg p-2 bg-white">
        <div class=" p-2 sm:mx-auto container max-[480px]:w-130">
          <div class="flex flex-col justify-between rounded-lg">
            <div class="w-auto font-bold text-2xl py-3 ml-2 rounded">Total</div>

            <div class="flex justify-between p-3 border-b-gray-300">
              <span>Original Price:</span>
              <span class="text-lg font-semibold text-green-500"> {{ totalSum }} $ </span>
            </div>

            <div class="flex justify-between p-3  border-b-gray-300">
              <span>Discount Price:</span>
              <span class="text-lg font-semibold text-green-500"> 0 $ </span>
            </div>

            <div class="flex justify-between p-3  border-b-gray-300">
              <span class="font-bold text-lg">Total Price:</span>
              <span class="text-xl font-bold text-green-500"> {{ totalSum }} $ </span>
            </div>

            <br>
            
          </div>
          <br>
          <RouterLink to="/checkout">
          <button class="w-full bg-green-500 cursor-pointer hover:bg-black hover:text-white 
        rounded font-medium p-5 text-lg"> Proceed To Checkout </button>
        </RouterLink>
        </div>
      </div>
    </div>

  </div>
</template>
