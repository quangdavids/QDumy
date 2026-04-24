<script setup>
import axios from "axios";
import { ref, nextTick, watch, onMounted } from "vue";

import { useRouter } from "vue-router";
import CoursePill from "./CoursePill.vue";
import { useAuthStore } from "../stores/auth.store";
import { storeToRefs } from "pinia";
const messages = ref([]);
const userInput = ref("");
const container = ref(null);

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const router = useRouter()
const isCloseChatbot = ref(false)
const apiUrl = import.meta.env.VITE_API_URL;
const getGeminiRecommendation = async () => {
  if (userInput.value.trim()) {
    messages.value.push({
      role: "user",
      content: userInput.value,
    });

    const response = await axios.post(
      `${apiUrl}/api/ai/recommend/${user.value._id}`,
      { message: userInput.value }
    );
    console.log(response.data);

    await getMessages();
    userInput.value = "";
  }
};

const getMessages = async () => {
  const response = await axios.get(
    `${apiUrl}/api/ai/messages/${user.value._id}`
  );
  console.log(response.data);
  messages.value = response.data.messages;
  console.log(messages.value);

};

const handleNavigation = function (id) {
  
  try {
    router.push({
      path: `/course/${id}`,
    });
  } catch (e) {
    console.error(`Error ${e}`);
  }
};

watch(
  messages,
  async () => {
    await nextTick();
    if (container.value) {
      container.value.scrollTop = container.value.scrollHeight;
    }
  },
  { deep: true }
);

const isOpen = ref(false)

const toggleChatbot = function() {
  isOpen.value = !isOpen.value
}

onMounted(() => {
  getMessages();
});
</script>

<template>
  <div v-if="isOpen" class="  h-100 z-100" >
    <div class="max-w-sm  w-60 rounded-lg">
      <div class="h-auto bg-white rounded-t-lg shadow-lg p-3 flex justify-between">
        <div class="flex gap-3 items-cente">
          <div>
            <img
              src="\images\quangdemy.png"
              class="w-7 h-7 rounded-full border"
            />
          </div>
          <div class="flex flex-col">
            <span class="text-[12px] font-bold"> Qdumy Assistant </span>
            <span class="text-[8px] text-gray-700">
              Help you whenever you need</span
            >
          </div>
        </div>

        <div class="flex mt-1" >
          <i @click="toggleChatbot"  class="fa fa-x text-[16px] cursor-pointer flex hover:text-red-500 duration-200"
          ></i>
        </div>
      </div>
      <div class="h-60 shadow-lg bg-[#f6f6f8] overflow-y-auto">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="flex flex-col p-3 gap-3"
        >
          <div
            :class="
              message.role === 'user'
                ? `flex justify-end self-end p-2 bg-green-500 text-[10px] rounded-l-lg max-w-50 rounded-t-lg shadow-md text-white`
                : `justify-start flex self-start p-2 text-[10px] rounded-r-lg rounded-t-lg shadow-md max-w-50 bg-white`
            "
          >
            {{ message.content }}
          </div>

          <div
            v-if="message.role === 'bot' && message.recommendations?.length"
            class="flex flex-col gap-2 mt-2"
          >
            <CoursePill
            class="hover:border-2 cursor-pointer"
            v-for="course in message.recommendations"
             :key="course.courseId"
             :title = "course.title"
             :price = "course.price"
             :images = "course.courseImage"
             @click="handleNavigation(course.courseId)" />
          </div>

        </div>

        <!-- <div
            class="flex justify-end self-end p-2 bg-green-500 text-[10px] rounded-l-lg max-w-50 rounded-t-lg shadow-md text-white"
          >
            Hi, I want help with this
          </div> -->
      </div>

      <div class="bg-white shadow-lg px-2 py-3 rounded-b-lg">
        <div class="flex">
          <form @submit.prevent="getGeminiRecommendation" class="flex w-full">
            <input
              type="text"
              placeholder="Type your request here"
              v-model="userInput"
              class="focus:border-green-500 shadow-sm border-r-1 focus:border-2 max-w-full hover:border hover:border-green-500 text-[10px] rounded-l-lg w-full py-2 px-3"
            />
            <button
              type="submit"
              class="shadow-sm hover:cursor-pointer duration-200 hover:bg-green-500 hover:text-white p-2 rounded-r-lg"
            >
              <i class="fa fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <button v-if="!isOpen" @click="toggleChatbot" class="px-6 py-4 hover:bg-black cursor-pointer flex gap-3 items-center rounded-full text-lg font-semibold bg-green-500 text-white outline-white outline-1">
  <i class="fa-solid fa-headphones text-[25px]"></i>
   Chat 
</button>
</template>

<style lang="css" scoped></style>
