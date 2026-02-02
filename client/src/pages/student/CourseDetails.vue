<script setup>
import { onMounted, ref, computed } from "vue";
import { getCourseAPI } from "../../helpers/api";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import { useAuthStore } from "../../stores/auth.store";
import { storeToRefs } from "pinia";

import vue3StarRatings from "vue3-star-ratings"
import axios from 'axios'
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const props = defineProps(["courseId"]);
import { useCartStore } from "../../stores/cart.store";
const cartStore = useCartStore();

function toggleDescription(index) {
  lessons.value[index].show = !lessons.value[index].show;
}
const course = ref({});
const route = useRoute();
const courseId = route.params.id;
console.log(courseId);
const getCourseDetail = async () => {
  try {
    const response = await getCourseAPI(courseId);
    course.value = response.course;
    console.log(course);
    console.log(course.value);
    console.log(response);
    console.log(response.course.lecturerId)
    console.log(response.course.promotionalVideo);
  } catch (e) {
    console.log(`Error ${e}`);
  }
};

const getUserCourse = async () => {
  
}

const lecturer = ref("")
const getInstructorDetail = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/lecturer/${user.value._id}`);
    lecturer.value = response.data.lecturer;
    console.log(response.data.lecturer)
    console.log(lecturer.value)
  } catch (e) {
    console.log(`Error ${e}`)
  }
}
const order = ref(0);
const lessons = ref([
  { title: "Dance Ya Bo", duration: "3:52" },
  { title: "Dance Ya Bo", duration: "3:52" },
  { title: "Dance Ya Bo", duration: "3:52" },
  { title: "Dance Ya Bo", duration: "3:52" },
  { title: "Dance Ya Bo", duration: "3:52" },
  { title: "Dance Ya Bo", duration: "3:52" },
  { title: "Dance Ya Bo", duration: "3:52" },
  { title: "Dance Ya Bo", duration: "3:52" },
]);

const active = ref(0);
const overviews = ref([
  { section: "Overview" },
  { section: "Curriculum" },
  { section: "Instructor" },
  { section: "Reviews" },
  { section: "Quiz"}
]);

const overviewClicked = function (index) {
  active.value = overviews.value[index].section;
  console.log(active.value);
};
const latestReviews = ref([])
const overviewActive = computed(() => {
  return overviews.value[index].section
    ? "bg-black text-white w-full p-2 text-center "
    : "hover:bg-black duration-300 hover:text-white w-full p-2 text-center";
});

const rating = ref(0)
const getLatestReviews = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/review/${courseId}/`)
    latestReviews.value = response.data.reviews

    console.log(latestReviews.value)
  } catch (err) {
    console.log(err)
  }
}


const isReview = ref(false)
// const descriptionShown = ref(false);

// const showMore = () => {
//   descriptionShown.value = !descriptionShown.value;
//   console.log(descriptionShown.value);
// };
// const description = computed(() => {
//   console.log(descriptionShown.value);
//   return descriptionShown.value ? "" : "line-clamp-5";
// });

const addToCart = () => {
  cartStore.addCourseToCart(courseId)
  console.log(courseId)
}

onMounted(() => {
  getCourseDetail();
  getInstructorDetail()
  getLatestReviews();
});
</script>

<template>
  <div class="mx-auto sm:w-full overflow-x-hidden mb-12">
    <div class="bg-[#1fb562]">
      <div class="flex container flex-col-reverse md:flex-row mx-auto items-center text-white md:p-12 h-auto relative">
        <div class="h-auto flex md:flex-col mr-auto cmx-auto ml-5 items-start flex-grow flex-row">
          <div>
            <div class="mb-5">Programming</div>

            <div class="text-3xl font-bold">
              {{ course.title }}
            </div>
            <div class="text-md font-light">
              {{ course.introduction }}
            </div>

            <div class="mt-5">
              4.5 <i class="fa-solid fa-star text-sm text-yellow-500"></i>
            </div>

            <div class="mt-5">
              Lectured by
              <u class="hover:text-black cursor-pointer">
                {{ lecturer.lecturerName }}
              </u>
            </div>
          </div>
        </div>
        <div class="lg:col-span-1 sm:w-screen p-3 md:w-[480px] h-auto right-8 top-5 bottom-9">
          <video v-if="course.promotionalVideo" id="player" class="aspect-video w-full object-cover mx-auto" controls
            autoplay muted>
            <source :src="course.promotionalVideo" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>

    <div class="  max-w-full mx-auto container  ">
      <div class="flex gap-3  justify-center flex-grow md:flex-row flex-col">
        <div class=" md:w-150 w-full">
          <div class="flex justify-around cursor-pointer font-semibold bg-gray-100 mt-7 max-w-full items-center">
            <div v-for="(overview, index) in overviews" :key="index" @click="overviewClicked(index)" :class="active === overview.section
              ? `bg-black text-white w-full p-2 text-center `
              : `hover:bg-black duration-300 hover:text-white w-full p-2 text-center`
              ">
              {{ overview.section }}
            </div>
          </div>
          <div class="mt-7 flex flex-col" v-if="active === 'Overview'">
            <div class="font-bold text-[23px]">Description</div>
            <div class="text-[16px] mt-2" v-html="course.description"></div>
            <div class="font-bold text-[23px] mt-2">Requirements</div>
            <ul class="text-[16px] mt-2 list-disc px-4 py-3" v-for="(requirement, index) in course.requirements">
             <li> {{ requirement }} </li>
            </ul>
            <div class="font-bold text-[23px] mt-2">Learning Qualities</div>
            <div class="text-[16px] mt-2" v-for="(quality, index) in course.learningQualities">
              {{ quality }}
            </div>
          </div>

          <div class="mt-7 flex flex-col" v-if="active === 'Curriculum'">
            <ul class="odd:bg-gray-100 even:bg-white">
              <li class="flex px-2 py-4 justify-between odd:bg-gray-100 even:bg-white"
                v-for="(lesson, index) in course.lessons" :key="index">
                <div>
                  <i class="fa-solid fa-book mr-3"></i>
                  {{ index + 1 }} - {{ lesson.title }}
                </div>
                <div>{{ lesson.duration }}</div>
              </li>
            </ul>
          </div>

          <div class="mt-7 flex flex-col " v-if="active === 'Instructor'">
            <div class="flex gap-3 max-w-full">
              <div class="max-w-60">
                <img src="/images/students/blonde.jpg" class="object-cover rounded-lg" />
              </div>
              <div>
                <div class="font-bold text-[23px]">{{ lecturer.lecturerName }}</div>
                <div class="text-gray-800">Lecturer at QuangStudy</div>
                <div class="mt-2 flex justify-around gap-5">
                  <div>
                    <i
                      class="fa-brands text-lg outline-1 text-blue-500  fa-facebook-f border rounded-full w-13 h-13 text-center p-4 hover:text-white cursor-pointer hover:bg-blue-500"></i>
                  </div>
                  <div>
                    <i
                      class="fa-brands text-lg outline-1 text-purple-500 fa-square-instagram cursor-pointer hover:text-white border-gray-200 hover:bg-purple-500 border rounded-full w-13 h-13 text-center p-4"></i>
                  </div>
                  <div>
                    <i
                      class="fa-brands fa-github outline-1 border text-lg rounded-full cursor-pointer hover:text-white border-gray-200 hover:bg-black w-13 h-13 text-center p-4"></i>
                  </div>
                  <div>
                    <i
                      class="fa-brands fa-linkedin outline-1 text-blue-700 border text-lg rounded-full cursor-pointer hover:text-white border-gray-200 hover:bg-blue-700 w-13 h-13 text-center p-4"></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-3">
              <p class="text-[23px] font-bold">About Instructor</p>
              <div class="mt-2">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, quam voluptatum possimus quas mollitia
                aliquam in voluptatem ullam repellat numquam totam accusantium sapiente animi eos dolore enim quidem ab
                porro!
              </div>
            </div>
          </div>

          <div class="mt-7 flex flex-col  max-h-full gap-2 " v-if="active === 'Reviews'">


            <div v-if="latestReviews" class="flex flex-col gap-2 ">
              <div v-for="review in latestReviews" :key="review._id"
                class=" rounded-lg gap-5 bg-gray-50 flex-grow flex p-2">
                <div class="max-w-15 ">
                  <img :src="review.userId.profileImg" class="rounded-full">
                </div>

                <div class="flex flex-col gap-2">
                  <div class="text-[18px] font-semibold">
                    {{ review.userId.username }}
                  </div>
                  <div class="flex gap-3 items-center">
                    <span>
                      <i v-for="star in review.rating" :key="star" class="fa-star"
                        :class="star <= rating ? 'far ' : 'fas filled text-yellow-500 '"></i>
                    </span>
                    <span class="text-gray-500 text-[13px]">
                      Now
                    </span>
                  </div>
                  <div class="text-[12px] line-clamp-4">
                    {{ review.content }}
                  </div>

                </div>
              </div>


            </div>


            <div v-else>
              <div class="flex flex-col gap-4 justify-center items-center h-75">
                <div>
                  <i class="fa fa-comment text-[50px]"></i>
                </div>
                <div>
                  There are no ratings yet. Give your first impression of the course
                </div>
              </div>
            </div>

            <div class="mt-auto">
              <textarea placeholder="Type in your review"
                class="outline-1 outline-gray-100 p-2 focus:outline-green-500 hover:outline-green-500 hover:outline-2 rounded-lg mt-auto w-full "></textarea>
              <button class=" p-2 w-full rounded-full bg-green-500 font-semibold  "> Send</button>
            </div>


          </div>

          <div class="mt-7 flex flex-col " v-if="active === 'Instructor'">

          </div>
        </div>
        <div class="md:w-auto   p-2">
          <div class="shadow-sm bg-gray-100 rounded-lg md:w-90  h-auto text-black mt-4">
            <div class="p-5 font-bold text-2xl">{{ course.price }} $</div>
            <div class="flex flex-col justify-center p-7 items-center gap-2">
              <button @click="addToCart"
                class="bg-white border p-4 rounded-lg w-full border-green-500 text-green-500 cursor-pointer">
                Add To Cart
              </button>
              <button class="bg-green-500 p-4 rounded-lg w-full text-white cursor-pointer">
                Check out now!
              </button>
            </div>

            <p class="text-sm text-center">35-day Money-Back guarantee</p>

            <div class="p-3">
              <span class="font-semibold"> This course includes: </span>

              <div class="flex justify-between items-center">
                <div>
                  <i class="fa-solid fa-video text-green-400 text-sm mr-2 py-4 px-2">
                  </i>
                  Lectures
                </div>
                <div class="text-gray-80 font-semibold">
                  30
                </div>
              </div>

              <div class="flex justify-between items-center">
                <div>
                  <i class="fa-solid fa-clock text-green-400 text-sm mr-2 py-4 px-2">
                  </i>
                  Duration
                </div>
                <div class="text-gray-80 font-semibold">
                  19h12
                </div>
              </div>

              <div class="flex justify-between items-center">
                <div>
                  <i class="fa-solid fa-keyboard text-green-400 text-sm mr-2 py-4 px-2">
                  </i>
                  Access
                </div>
                <div class="text-gray-80 font-semibold">
                  Lifetime
                </div>
              </div>

              <div>
                <i class="fa-solid fa-certificate text-sm mr-2 text-green-400 py-4 px-2"></i>
                Certificate after completion
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>
<!-- <div class="w-screen  max-h-full  mb-8">
      <div class="font-bold text-lg mb-2">Instructor</div>
      <RouterLink to="/profile">
      <div class="mr-5 flex shadow-2xl rounded-lg max-w-100 w-auto p-2">
        <img
          src="/images/students/blonde.jpg"
          alt=""
          class="w-15 h-15 rounded-full inline mr-1"
        />
        <div class="font-bold">
          Maria Johansson <span class="fi fi-se"></span>
          <p class="font-medium">University of Pennsylvania</p>
        </div>
     
      </div>
         </RouterLink>
      <div class="text-green-500 underline cursor-pointer hover:text-green-700">
        More course by Maria
      </div>
    </div> -->