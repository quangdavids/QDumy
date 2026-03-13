<script setup>
import { ref } from "vue";
const showMore = ref(false);

const toggleMore = () => {
  showMore.value = !showMore.value;
};
</script>

<template>
  <div class="min-h-screen">
    <div class="w-full h-auto max-h-full bg-gray-100 ">
      <div class="flex flex-1 items-start mr-auto ml-10 gap-5 p-2">
        <div class="rounded-full">
          <img
            src="/images/students/blonde.jpg"
            class="w-50 h-50 rounded-full"
          />
          <div class="mt-2 flex justify-around">
            <div>
              <i
                class="fa-brands fa-facebook-f border rounded-full w-10 h-10 text-center p-3 hover:text-white cursor-pointer hover:bg-blue-500"
              ></i>
            </div>
            <div>
              <i
                class="fa-brands fa-square-instagram border rounded-full w-10 h-10 text-center p-3"
                style="color: purple"
              ></i>
            </div>
            <div>
              <i
                class="fa-brands fa-github border rounded-full w-10 h-10 text-center p-3"
              ></i>
            </div>
            <div>
              <i
                class="fa-brands fa-linkedin border rounded-full w-10 h-10 text-center p-3"
              ></i>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-1.5">
          <div class="flex gap-3 text-2xl">
            <span class="font-bold max-w-80 mt-10">Dr. Marianna Johansson</span>
            <i class="fi fi-se mt-10"></i>
          </div>

          <div>Senior Developer at FPT University and Card Trader</div>

          <div>University of FPT Greenwich Hanoi</div>
        </div>
      </div>
    </div>

    <div class="p-3 ml-10 flex flex-col gap-2">
      <p class="font-bold text-3xl">Bio</p>
      <div class="max-w-full font-medium text-md">
        Nguyen Dung is a seasoned senior developer at FPT Tech Company and a
        dedicated lecturer at FPT Greenwich, where he combines real-world
        industry experience with academic excellence. With over a decade of
        expertise in software development, Nguyen Dung has contributed to
        numerous large-scale enterprise solutions, specializing in full-stack
        web development, cloud integration, and scalable architecture. At FPT
        Tech, he leads cross-functional teams, mentors junior developers, and
        helps drive innovation through agile practices and modern frameworks
        like NestJS, Vue.js, and microservices architecture.
        <span v-if="!showMore">...</span>
        <span v-if="showMore">
          As a lecturer at FPT Greenwich, Nguyen Dung is known for his practical
          teaching style and passion for bridging the gap between theory and
          real-world application. His courses in web development, software
          engineering, and systems architecture are widely respected by students
          for their relevance and clarity. He often incorporates real project
          case studies and encourages hands-on learning through collaborative
          coding sessions and capstone projects. Nguyen Dung holds a Master’s
          degree in Computer Science and is committed to lifelong learning and
          tech community growth. He regularly speaks at tech meetups and mentors
          students pursuing careers in software development. Through his dual
          roles, Nguyen Dung continues to inspire and shape the next generation
          of Vietnamese tech talent.
        </span>

        <button @click="toggleMore" class="mt-2 text-blue-600 hover:underline">
          {{ showMore ? "Read Less" : "Read More" }}
        </button>
      </div>
    </div>

    <div class="p-3 ml-10 mt-2">
       <p class="font-bold text-3xl"> Courses </p>
    </div>
  </div>
</template>