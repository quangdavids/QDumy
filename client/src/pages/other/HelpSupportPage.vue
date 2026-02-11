<script setup>
import { ref } from "vue";

const helps = ref([
  {
    title: "Getting Warmed Up",
    description: "Get to know how QUangStudy works",
    icon: "fa-solid fa-play",
  },
  {
    title: "Getting Warmed Up",
    description: "Get to know how QUangStudy works",
    icon: "fa-solid fa-play",
  },
  {
    title: "Getting Warmed Up",
    description: "Get to know how QUangStudy works",
    icon: "fa-solid fa-play",
  },
  {
    title: "Getting Warmed Up",
    description: "Get to know how QUangStudy works",
    icon: "fa-solid fa-play",
  },
  {
    title: "Getting Warmed Up",
    description: "Get to know how QUangStudy works",
    icon: "fa-solid fa-play",
  },
  {
    title: "Getting Warmed Up",
    description: "Get to know how QUangStudy works",
    icon: "fa-solid fa-play",
  },
]);

const Faqs = ref([
  { question: "How do I enroll in a course on the platform?" },
  { question: "Can I learn at my own pace or are there fixed deadlines?" },
  { question: "Is the platform accessible on mobile devices and tablets?" },
  {
    question:
      "What types of payment options are available for course purchases?",
  },
  { question: "Can I preview or test course content before buying?" },
  

]);
</script>

<template>
  <div class="min-h-screen max-w-screen">
    <div class="relative">
      <img
        src="/images/students/ebony.jpg "
        class="object-cover brightness-75 h-50 w-screen"
      />
      <div
        class="absolute top-1/2 left-1/2 text-white -translate-x-1/2 -translate-y-1/2 transform font-bold text-3xl"
      >
        Help and Support
      </div>
    </div>
    <div class="flex flex-col justify-center items-center container mx-auto">
      <p class="text-[26px] font-semibold p-4 ml-5">Select A Topic for Help</p>
      <div
        class="grid lg:grid-cols-3 justify-center items-center md:grid-cols-2 gap-5 sm:grid-cols-1 py-4"
      >
        <div
          v-for="help in helps"
          class="outline-1 outline-gray-400 focus:ring-1 cursor-pointer rounded-lg md:max-w-[330px] px-2 sm:w-full p-3 h-[200px] flex flex-col gap-2 justify-center items-center"
        >
          <span class="w-[90px] mb-4 bg-black h-[90px] rounded-full relative">
            <i
              class="fa-solid fa-play text-[40px] text-green-500 absolute top-6 left-8"
            ></i>
          </span>
          <span class="font-bold text-xl">
            {{ help.title }}
          </span>
          <span class="text-sm">
            {{ help.description }}
          </span>
        </div>
      </div>
    </div>

    <div class="flex flex-col justify-center items-center mb-2 mx-auto">
      <p class="font-semibold text-[26px] ml-5 p-4">
        Frequently Asked Question
      </p>
       </div>
      <div class="grid md:grid-cols-2 mx-auto gap-3 p-5 container sm:grid-cols-1  items-center">
        <div v-for="(faq, index) in Faqs" 
        class=" flex justify-between rounded-md  outline-1 p-5 outline-gray-300">
           {{ faq.question }}

           <i class="fa-solid fa-plus cursor-pointer hover:text-green-500"></i>
        </div>
      </div>
      <div class="max-w-screen-xl mx-auto p-4 ">
      <div class="outline-1 outline-gray-300 bg-gray-100 flex p-10 items-center flex-col gap-3 ">
          <div class="font-bold text-[26px]">
            Still have a question?
          </div>

          <div class="max-w-150">
            We'd be happy to help you with any questions you have! Please let us know what you're looking for, and we'll do our best to assist you.
          </div>

          <button class="bg-green-500 text-white p-3 font-bold rounded-full">
            Contact Us
          </button>
      </div>
      </div>
   
  </div>
</template>
