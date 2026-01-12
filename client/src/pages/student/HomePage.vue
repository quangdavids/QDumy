<script setup>
import Banner from "../../components/Banner.vue";
import CourseCard from "../../components/CourseCard.vue";
import { register } from "swiper/element/bundle";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import axios from "axios";
import { useCourseStore } from "../../stores/course.store";
import CourseDetails from "./CourseDetails.vue";
register();

const modules = [EffectCoverflow, Pagination, Navigation];
const route = useRouter();
const latestCourses = ref([]);

const getLatest = async () => {
  const response = await axios.get("http://localhost:3000/api/courses/latest");
  latestCourses.value = response.data.courses;
  console.log(latestCourses.value)
};

onMounted(() => {
  getLatest();
});

const courseId = ref("");

const handleNavigation = function (id) {
  courseId.value = id;
  try {
    route.push({
      path: `/course/${id}`,
    });
  } catch (e) {
    console.error(`Error ${e}`);
  }
};
</script>

<template>
  <Banner />

  <!-- University Logos -->
   <div class="scroll-smooth">
  <div
    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mx-auto container place-items-center max-w-8xl justify-between p-8"
  >
    <img
      src="/images/universities/brown.png"
      class="max-w-[100px] h-auto object-contain"
    />
    <img
      src="/images/universities/Cornell.png"
      class="max-w-[100px] h-auto object-contain"
    />
    <img
      src="/images/universities/greenwichFPT.png"
      class="max-w-[100px] h-auto object-contain"
    />
    <img
      src="/images/universities/Salford.png"
      class="max-w-[100px] h-auto object-contain"
    />
    <img
      src="/images/universities/TDT.png"
      class="max-w-[100px] h-auto object-contain"
    />
 
  </div>

  <!-- Lifelong Learning Section -->
  <div
    class="max-w-auto p-5 md:p-13 flex self-center text-black"
  >
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 container mx-auto"
    >
      <div
        class="hover:mb-5 duration-200 cursor-pointer hover:opacity-80 rounded-lg p-10 bg-gray-100 text-lg text-center flex items-center justify-center font-bold w-auto"
      >
        <div class="flex flex-col gap-4 mx-auto">
          <i class="fa-solid fa-graduation-cap text-5xl flex self-center"></i>
        <p class="text-[20px]">  Lifelong Learning Mindset </p>
          <div class="font-normal mt-2 text-md md:text-md">
           Learning top skills can bring an extra-ordinary outcome in a career.
          </div>
        </div>
      </div>
        <div
        class="hover:mb-5 duration-200 cursor-pointer hover:opacity-80 rounded-lg p-10 bg-gray-100 text-lg text-center flex items-center justify-center font-bold w-auto"
      >
        <div class="flex flex-col gap-4 mx-auto">
          <i class="fa-solid fa-graduation-cap text-5xl flex self-center"></i>
        <p class="text-[20px]">  Lifelong Learning Mindset </p>
          <div class="font-normal mt-2 text-md md:text-md">
           Learning top skills can bring an extra-ordinary outcome in a career.
          </div>
        </div>
      </div>
             <div
        class="hover:mb-5 duration-200 cursor-pointer hover:opacity-80 rounded-lg p-10 bg-gray-100 text-lg text-center flex items-center justify-center font-bold w-auto"
      >
        <div class="flex flex-col gap-4 mx-auto">
          <i class="fa-solid fa-graduation-cap text-5xl flex self-center"></i>
        <p class="text-[20px]">  Lifelong Learning Mindset </p>
          <div class="font-normal mt-2 text-md md:text-md">
           Learning top skills can bring an extra-ordinary outcome in a career.
          </div>
        </div>
      </div>
              <div
        class="hover:mb-5 duration-200 cursor-pointer hover:opacity-80 rounded-lg p-10 bg-gray-100 text-lg text-center flex items-center justify-center font-bold w-auto"
      >
        <div class="flex flex-col gap-4 mx-auto">
          <i class="fa-solid fa-graduation-cap text-5xl flex self-center"></i>
        <p class="text-[20px]">  Lifelong Learning Mindset </p>
          <div class="font-normal mt-2 text-md md:text-md">
           Learning top skills can bring an extra-ordinary outcome in a career.
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Categories -->
   <!-- <div class="w-full">
  <p class="font-bold text-xl p-2 sm:text-2xl mx-auto max-w-auto md:text-3xl  mt-7 mb-3 text-center border 
   ">Top Categories</p>
   </div> -->
   <div class="flex justify-center">
    <p class="border p-3 rounded-full text-[20px] font-semibold text-green-500 bg-green-100 mb-3"> Top Categories</p>
   </div>
  <div
    class="max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-3 mx-auto container"
  >
    <div
      class="flex flex-col hover:bg-black hover:text-white gap-2 justify-center items-center border-2 rounded-lg border-gray-200 p-5"
    >
      <div
        class="bg-[#84cf84] w-20 h-20 rounded-full flex items-center justify-center shadow-xl"
      >
        <i class="fa-solid fa-language text-3xl"></i>
      </div>
      <div>Languages & Linguism</div>
    </div>
    <div
      class="flex flex-col gap-2 justify-center items-center border-2 rounded-lg border-gray-200 p-5"
    >
      <div
        class="bg-[#84cf84] w-20 h-20 rounded-full flex items-center justify-center shadow-xl"
      >
        <i class="fa-solid fa-hexagon-nodes text-4xl"></i>
      </div>
      <div>Artificial Intelligence</div>
    </div>
    <div
      class="flex flex-col gap-2 justify-center items-center border-2 rounded-lg border-gray-200 p-5"
    >
      <div
        class="bg-[#84cf84] w-20 h-20 rounded-full flex items-center justify-center shadow-xl"
      >
        <i class="fa-solid fa-laptop-code text-4xl"></i>
      </div>
      <div>Programming</div>
    </div>
    <div
      class="flex flex-col gap-2 justify-center items-center border-2 rounded-lg border-gray-200 p-5"
    >
      <div
        class="bg-[#84cf84] w-20 h-20 rounded-full flex items-center justify-center shadow-xl"
      >
        <i class="fa-solid fa-pen-nib text-4xl"></i>
      </div>
      <div>Writing</div>
    </div>

    <div
      class="flex flex-col gap-2 justify-center items-center border-2 rounded-lg border-gray-200 p-5"
    >
      <div
        class="bg-[#84cf84] w-20 h-20 rounded-full flex items-center justify-center shadow-xl"
      >
        <i class="fa-solid fa-pen-nib text-4xl"></i>
      </div>
      <div>Writing</div>
    </div>

     <div
      class="flex flex-col gap-2 justify-center items-center border-2 rounded-lg border-gray-200 p-5"
    >
      <div
        class="bg-[#84cf84] w-20 h-20 rounded-full flex items-center justify-center shadow-xl"
      >
        <i class="fa-solid fa-pen-nib text-4xl"></i>
      </div>
      <div>Writing</div>
    </div>

     <div
      class="flex flex-col gap-2 justify-center items-center border-2 rounded-lg border-gray-200 p-5"
    >
      <div
        class="bg-[#84cf84] w-20 h-20 rounded-full flex items-center justify-center shadow-xl"
      >
        <i class="fa-solid fa-pen-nib text-4xl"></i>
      </div>
      <div>Writing</div>
    </div>
     <div
      class="flex flex-col gap-2 justify-center items-center border-2 rounded-lg border-gray-200 p-5"
    >
      <div
        class="bg-[#84cf84] w-20 h-20 rounded-full flex items-center justify-center shadow-xl"
      >
        <i class="fa-solid fa-pen-nib text-4xl"></i>
      </div>
      <div>Writing</div>
    </div>
  </div>

  <!-- Best Seller Swiper -->
    <div class="flex justify-center">
    <p class="border p-3 rounded-full text-[20px] font-semibold text-green-500 bg-green-100 mb-5 mt-5"> Best Seller </p>
   </div>
  <Swiper
    :modules="modules"
    
    grab-cursor="true"
    centered-slides="true"
    :slides-per-view="3"
    :coverflow-effect="{
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    }"
    :speed="500"
    :loop="true"
    pagination
    :breakpoints="{
      480: { slidesPerView: 1 },
      640: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    }"
    class="w-full h-auto mx-auto"
  >
    <SwiperSlide v-for="course in latestCourses" :key="course._id">
      <CourseCard
        :price="course.price"
        :title="course.title"
        :description="course.description"
        :images="course.courseImage"
        @click="handleNavigation(course._id)"
      />
    </SwiperSlide>
  </Swiper>
  <div class="p-3">

  </div>

  <!-- Testimonial Section
  <div class="p-4 container mx-auto">
    <h1 class="font-bold text-xl sm:text-2xl md:text-3xl">
      Our Best Customers' Review
    </h1>
    <swiper-container speed="500" loop="true" :slides-per-view="1">
      <swiper-slide>
        <Testimonial
          user="Jumi Laikkonen"
          nation="fi"
          title="Absolute Brilliant"
          images="/images/students/blonde.jpg"
          testimony="I've worn it to multiple events and always get compliments. It’s now one of my go-to outfits."
        />
      </swiper-slide>
      <swiper-slide>
        <Testimonial
          user="Anna Mlynárová"
          nation="sk"
          title="Wonderful Course"
          images="/images/students/stephanie2.jpg"
          testimony="Courses hard to find trendy clothes at fair prices, but this store nailed it. Already placed my next order."
        />
      </swiper-slide>
    </swiper-container>
  </div> -->

  <div class="bg-green-500 ">
    <div
      class="justify-center flex flex-col gap-4 items-center h-100 text-white font-bold text-xl"
    >
      <p>Ready to take your skills to the next level? Sign up here</p>
      <button
        class="bg-white text-green-500 p-3 hover:text-white hover:bg-black cursor-pointer text-md font-medium rounded-full w-50"
      >
        Sign up here!
      </button>
    </div>
  </div>

  <div class="w-full h-full flex flex-col md:flex-row container mx-auto">
    <div class="w-full md:w-1/2">
      <img
        src="/images/student2.jpg"
        class="w-full h-60 md:h-150 object-cover object-top"
      />
    </div>
    <div class="w-full md:w-1/2 flex flex-col items-center justify-center p-4">
      <span class="text-2xl md:text-3xl font-bold text-center"
        >Choose your courses</span
      >
      <p class="max-w-90 text-lg md:text-2xl mt-2 text-center">
        For a better career
      </p>
      <button
        class="w-60 md:w-80 text-lg hover:bg-green-500 bg-green-500 text-white cursor-pointer font-bold transform duration-300 border p-3 mt-4"
      >
        View Courses
      </button>
    </div>
  </div>

  <div
    class="flex w-full flex-wrap sm:flex-col-reverse container mx-auto md:flex-row py-3 justify-center"
  >
    <div class="md:max-w-1/2 sm:w-screen p-4">
      <img src="/images/01.png" class="md:w-150" />
    </div>

    <div class="flex md:max-w-1/2 sm:w-screen flex-col justify-around p-3">
      <div>
        <div class="text-green-500 text-[18px] font-sans leading-12">
          About QuangStudy
        </div>
        <div class="font-bold text-[40px] leading-15">
          Good Qualification Services And Better Skills
        </div>
        <div class="leading-7">
          Distinctively provide acces mutfuncto users whereas transparent
          proceses somes ncentivize eficient functionalities rather than
          extensible archtectur communicate leveraged services and
          cross-platform.
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <div class="flex gap-4">
          <img src="/images/teacher.png" class="h-20 w-20" />
          <div>
            <p class="font-bold text-lg">Skilled Instructors</p>
            <p>
              Distinctively provide acces mutfuncto users whereas communicate
              leveraged services
            </p>
          </div>
        </div>

        <div class="flex gap-4">
          <img src="/images/cert.png" class="h-20 w-20" />
          <div>
            <p class="font-bold text-lg">Skilled Instructors</p>
            <p>
              Distinctively provide acces mutfuncto users whereas communicate
              leveraged services
            </p>
          </div>
        </div>
        <div class="flex gap-4">
          <img src="/images/lesson.png" class="h-20 w-20" />
          <div>
            <p class="font-bold text-lg">Skilled Instructors</p>
            <p>
              Distinctively provide acces mutfuncto users whereas communicate
              leveraged services
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="max-h-full py-13">
    <div class="flex flex-col justify-center items-center">
      <p class="text-[23px]">Ideal Lecturer for Everyone</p>
      <p class="text-[32px] font-bold">
        Passionate and Professional People of our service
      </p>
      <br></br>
      <div class="flex gap-5 cursor-pointer items-center justify-center flex-shrink flex-wrap">
        <div
          class="flex flex-col gap-3 p-3 border-3 border-gray-200 hover:border-green-500 transition durarion-300 rounded-xl"
        >
          <div class="max-w-85 p-2">
            <img src="/images/instructors/blonde1.jpeg " class="rounded-xl" />
          </div>
          <div class="flex flex-col justify-center items-center">
            <p class="text-[26px] font-semibold">Laura Mortensen
               <i class="fi fi-dk"></i>
            </p>
            <p class="text-md text-gray-600">Java Developer and Lecturer</p>
          </div>
          <div class="mt-2 flex justify-around">
            <div>
              <i
                class="fa-brands  text-lg fa-facebook-f border border-gray-200 rounded-full w-13 h-13 text-center p-4 hover:text-white cursor-pointer hover:bg-blue-500"
              ></i>
            </div>
            <div>
              <i
                class="fa-brands text-lg fa-square-instagram cursor-pointer hover:text-white border-gray-200 hover:bg-purple-500 border rounded-full w-13 h-13 text-center p-4"
               
              ></i>
            </div>
            <div>
              <i
                class="fa-brands fa-github border text-lg rounded-full cursor-pointer hover:text-white border-gray-200 hover:bg-black w-13 h-13 text-center p-4"
              ></i>
            </div>
            <div>
              <i
                class="fa-brands fa-linkedin border text-lg rounded-full cursor-pointer hover:text-white border-gray-200 hover:bg-blue-700  w-13 h-13 text-center p-4"
              ></i>
            </div>
          </div>
        </div>

         <div
          class="flex flex-col gap-2 p-3 border-3 border-gray-200 hover:border-green-500 transition durarion-300 rounded-xl"
        >
          <div class="max-w-85 p-2">
            <img src="/images/instructors/blonde2.jpeg " class="rounded-xl" />
          </div>
          <div class="flex flex-col justify-center items-center">
            <p class="text-[26px] font-semibold">Milan Jurasek
              <i class="fi fi-cz"></i>
            </p>
            <p class="text-md text-gray-600">Blockchain Developer and Lecturer</p>
          </div>
          <div class="mt-2 flex justify-around">
            <div>
              <i
                class="fa-brands  text-lg fa-facebook-f border border-gray-200 rounded-full w-13 h-13 text-center p-4 hover:text-white cursor-pointer hover:bg-blue-500"
              ></i>
            </div>
            <div>
              <i
                class="fa-brands text-lg fa-square-instagram cursor-pointer hover:text-white border-gray-200 hover:bg-purple-500 border rounded-full w-13 h-13 text-center p-4"
               
              ></i>
            </div>
            <div>
              <i
                class="fa-brands fa-github border text-lg rounded-full cursor-pointer hover:text-white border-gray-200 hover:bg-black w-13 h-13 text-center p-4"
              ></i>
            </div>
            <div>
              <i
                class="fa-brands fa-linkedin border text-lg rounded-full cursor-pointer hover:text-white border-gray-200 hover:bg-blue-700  w-13 h-13 text-center p-4"
              ></i>
            </div>
          </div>
        </div>

          <div
          class="flex flex-col gap-2 p-3 border-3 border-gray-200 hover:border-green-500 transition durarion-300 rounded-xl"
        >
          <div class="max-w-85 p-2">
            <img src="/images/instructors/blonde3.jfif " class="rounded-xl" />
          </div>
          <div class="flex flex-col justify-center items-center">
            <p class="text-[26px] font-semibold"> Amila Piotrowska
              <i class="fi fi-pl"></i>
            </p>
            <p class="text-md text-gray-600">Blockchain Developer and Lecturer</p>
          </div>
          <div class="mt-2 flex justify-around">
            <div>
              <i
                class="fa-brands  text-lg fa-facebook-f border border-gray-200 rounded-full w-13 h-13 text-center p-4 hover:text-white cursor-pointer hover:bg-blue-500"
              ></i>
            </div>
            <div>
              <i
                class="fa-brands text-lg fa-square-instagram cursor-pointer hover:text-white border-gray-200 hover:bg-purple-500 border rounded-full w-13 h-13 text-center p-4"
               
              ></i>
            </div>
            <div>
              <i
                class="fa-brands fa-github border text-lg rounded-full cursor-pointer hover:text-white border-gray-200 hover:bg-black w-13 h-13 text-center p-4"
              ></i>
            </div>
            <div>
              <i
                class="fa-brands fa-linkedin border text-lg rounded-full cursor-pointer hover:text-white border-gray-200 hover:bg-blue-700  w-13 h-13 text-center p-4"
              ></i>
            </div>
          </div>
        </div>
        

        
      </div>
    </div>
  </div>
  <!-- Become a Lecturer -->
  <div class="w-full h-full flex flex-col md:flex-row container mx-auto">
    <div class="w-full md:w-1/2 flex flex-col items-center justify-center p-4">
      <span class="text-2xl md:text-3xl font-bold text-center"
        >Become a lecturer now!</span
      >
      <p class="max-w-100 text-sm md:text-md mt-2 text-center">
        Think you can guide others to success? You can become a lecturer now
      </p>
      <button
        class="w-60 md:w-80 text-lg hover:bg-green-500 bg-green-500 text-white cursor-pointer font-bold transform duration-300 border p-3 mt-4"
      >
        Start your lecturing journey!
      </button>
    </div>
    <div class="w-full md:w-1/2">
      <img
        src="/images/students/student1.jpg"
        class="w-full h-60 md:h-150 object-cover object-top"
      />
    </div>
  </div>
</div>
</template>
