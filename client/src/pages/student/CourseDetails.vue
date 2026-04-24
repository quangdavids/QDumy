<script setup>
import { onMounted, ref, computed } from "vue";
import { getCourseAPI } from "../../helpers/api";
import { useRoute, useRouter } from "vue-router";
import dayjs from "dayjs";
import { useAuthStore } from "../../stores/auth.store";
import { storeToRefs } from "pinia";
import vue3StarRatings from "vue3-star-ratings";
import axios from "axios";
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const props = defineProps(["courseId"]);
import { useCartStore } from "../../stores/cart.store";
const cartStore = useCartStore();
const { courses } = storeToRefs(cartStore)

const apiUrl = import.meta.env.VITE_API_URL;
function toggleDescription(index) {
  lessons.value[index].show = !lessons.value[index].show;
}
console.log(user.value.role)
const course = ref({});
const route = useRoute();
const router = useRouter();
const courseId = route.params.id;
console.log(courseId);
const lecturer = ref("")
import {toast} from 'vue3-toastify'
const getCourseDetail = async () => {
  try {
    const response = await getCourseAPI(courseId);
    course.value = response.course;
    console.log(course);
    console.log(course.value);
    console.log(response);
    console.log(response.course.lecturerId);
    lecturer.value = response.course.lecturerId
    console.log(response.course.promotionalVideo);
  } catch (e) {
    console.log(`Error ${e}`);
  }
};



// const getInstructorDetail = async () => {
//   try {
//     const lecturer = await getCourseAPI(courseId);
//     console.log(lecturer.course.lecturerId._id)
//     const response = await axios.get(
//       `${apiUrl}/api/lecturer/${lecturer.course.lecturerId._id}`,
//     );
//     // lecturer.value = response.data.lecturer;
//     console.log(response.data.lecturer);
//     console.log(lecturer.value);
//   } catch (e) {
//     console.log(`Error ${e}`);
//   }
// };

const time = ref(0)
const getTotalTime = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/courses/total-time/${courseId}`)
    console.log(response.data.totalTime)
    time.value = response.data.totalTime
  } catch (err) {
    console.log(err)
  }
}


function formatToHoursMinutes(totalSeconds) {
  // Ensure we have a positive number
  const seconds = Math.max(0, totalSeconds);
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  // Pad numbers with leading zeros to ensure "00" format
  const h = String(hours).padStart(2, '0');
  const m = String(minutes).padStart(2, '0');

  return `${h}h${m}`;
}

const order = ref(0);

const active = ref(0);
const overviews = ref([
  { section: "Overview" },
  { section: "Curriculum" },
  { section: "Instructor" },
  { section: "Reviews" },

]);

const overviewClicked = function (index) {
  active.value = overviews.value[index].section;
  console.log(active.value);
};
const latestReviews = ref([]);
const overviewActive = computed(() => {
  return overviews.value[index].section
    ? "bg-black text-white w-full p-2 text-center "
    : "hover:bg-black duration-300 hover:text-white w-full p-2 text-center";
});


const getLatestReviews = async () => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/reviews/${courseId}`,
    );
    latestReviews.value = response.data.reviews;
  
    console.log(latestReviews.value);
  } catch (err) {
    console.log(err);
  }
};
const rating = ref(0)
const newReview = ref("")
const addReview = async () => {
  try{
    const response = await axios.post(`${apiUrl}/api/review/${courseId}/${user.value._id}`, 
    {content: newReview.value, rating: rating.value})
    newReview.value = response.data 
    console.log(newReview.value)
    newReview.value = ""
    getLatestReviews()
  } catch (e) {
    console.log(e)
  }
}

const userReview = ref("")
const isEditReview = ref(false)
const getUserReview = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/review/${courseId}/${user.value._id}`)
    userReview.value = response.data
    console.log(userReview.value)
    
  } catch (err) {
    console.log(err)
  }
}

const toVideoLearning = () => {

  router.push({
    name: "CourseLecture",
    params: { courseId: courseId },
  });
};

const showPurchasePrompt = () => {
  toast.warning("Please purchase this course to access lessons", {autoClose: 3000})
};

const courseBoughtStatus = ref(false);
const checkCourseBoughtStatus = async () => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/courses/bought/${user.value._id}/${courseId}`,
    );
    courseBoughtStatus.value = response.data.status
    console.log(courseBoughtStatus.value)
  } catch (err) {
    console.log(err)
  }
};


const formatDuration = (seconds) => {
    const totalSeconds = Math.round(seconds)

    const minutes = Math.floor(totalSeconds / 60)
    const remainingSeconds = totalSeconds % 60
     return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}
const isReview = ref(false);




const courseInCart = computed(() => {
  return courses.value.some(cartCourse => cartCourse._id === course.value._id)
})


const addToCart = () => {
  if (!courses.value.some(cartCourse => cartCourse._id === course.value._id)) {
  cartStore.addCourseToCart(courseId);
  toast.success("Add to cart", {autoClose: 2000})
  console.log(courseId);
  } else {
     toast.error("Already in cart", {autoClose: 2000})
  }
};

onMounted(() => {
  getCourseDetail();
  // getInstructorDetail();
  getLatestReviews();
  checkCourseBoughtStatus();
  getTotalTime();
  getUserReview()
  cartStore.fetchCourses();
});
console.log(courses.value)
</script>

<template>
  <div class="mx-auto sm:w-full overflow-x-hidden mb-12">
    <div class="bg-[#1fb562]">
      <div
        class="flex container flex-col-reverse md:flex-row mx-auto items-center text-white md:p-12 h-auto relative"
      >
        <div
          class="h-auto flex md:flex-col mr-auto cmx-auto ml-5 items-start flex-grow flex-row"
        >
          <div>
            <div class="mb-5">{{ course.category }}</div>

            <div class="text-3xl font-bold">
              {{ course.title }}
            </div>
            <div class="text-md font-light">
              {{ course.introduction }}
            </div>

            <div class="mt-5">
              {{ course.rating?.toFixed(2) }} <i class="fa-solid fa-star text-sm text-yellow-500"></i>
            </div>

            <div class="mt-5">
              Lectured by
              <u class="hover:text-black cursor-pointer">
                {{ lecturer.lecturerName }}
              </u>
            </div>
          </div>
        </div>
        <div
          class="lg:col-span-1 sm:w-screen p-3 md:w-[480px] h-auto right-8 top-5 bottom-9"
        >
          <video
            v-if="course.promotionalVideo"
            id="player"
            class="aspect-video w-full object-cover mx-auto"
            controls
            autoplay
            muted
          >
            <source :src="course.promotionalVideo" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>

    <div class="max-w-full mx-auto container">
      <div class="flex gap-3 justify-center flex-grow md:flex-row flex-col">
        <div class="md:w-150 w-full">
          <div
            class="flex justify-around cursor-pointer font-semibold bg-gray-100 mt-7 max-w-full items-center"
          >
            <div
              v-for="(overview, index) in overviews"
              :key="index"
              @click="overviewClicked(index)"
              :class="
                active === overview.section
                  ? `bg-black text-white w-full p-2 text-center `
                  : `hover:bg-black duration-300 hover:text-white w-full p-2 text-center`
              "
            >
              {{ overview.section }}
            </div>
          </div>
          <div class="mt-7 flex flex-col" v-if="active === 'Overview'">
            <div class="font-bold text-[23px]">Description</div>
            <div class="text-[16px] mt-2" v-html="course.description"></div>
            <div class="font-bold text-[23px] mt-2">Requirements</div>
            <ul
              class="text-[16px] mt-2 list-disc px-4 py-3"
              v-for="(requirement, index) in course.requirements"
            >
              <li>{{ requirement }}</li>
            </ul>
            <div class="font-bold text-[23px] mt-2">Learning Qualities</div>
            <div
              class="text-[16px] mt-2"
              v-for="(quality, index) in course.learningQualities"
            >
              {{ quality }}
            </div>
          </div>

          <div class="mt-7 flex flex-col" v-if="active === 'Curriculum'">
            <ul v-if="user.role !== `admin`" class="odd:bg-gray-100 even:bg-white" >
              <li
                class="flex px-2 py-4 justify-between odd:bg-gray-100 even:bg-white"
                :class="courseBoughtStatus ? 'cursor-pointer hover:bg-green-50' : 'cursor-not-allowed opacity-60'"
                @click="courseBoughtStatus ? toVideoLearning() : showPurchasePrompt()"
                
                v-for="(lesson, index) in course.lessons"
                :key="index"
              >
                <div>
                  <i class="fa-solid fa-book mr-3"></i>
                  {{ index + 1 }} - {{ lesson.title }}
                </div>
                <div class="flex items-center gap-2">
                  {{ formatDuration(lesson.duration) }}
                  <i  :class="courseBoughtStatus ? `` : `fa fa-lock`">
                  
                  </i>
                </div>
              </li>
            </ul>

             <ul v-else-if="user.role === `admin`" class="odd:bg-gray-100 even:bg-white" >
              <li
                class="flex px-2 py-4 justify-between odd:bg-gray-100 even:bg-white cursor-pointer hover:bg-green-50"
                @click=" toVideoLearning() "
                
                v-for="(lesson, index) in course.lessons"
                :key="index"
              >
                <div>
                  <i class="fa-solid fa-book mr-3"></i>
                  {{ index + 1 }} - {{ lesson.title }}
                </div>
                <div class="flex items-center gap-2">
                  {{ formatDuration(lesson.duration) }}
                 

                 
                </div>
              </li>
            </ul>
          </div>

          <div class="mt-7 flex flex-col" v-if="active === 'Instructor'">
            <div class="flex gap-3 max-w-full">
              <div class="max-w-50">
                <img
                  :src="course.lecturerId.profilePic"
                  class="object-cover rounded-lg w-50 h-50"
                />
              </div>
              <div>
                <div class="font-bold text-[23px]">
                  {{ lecturer.lecturerName }}
                </div>
                <div class="text-gray-800">Lecturer at QuangStudy</div>
                <div class="mt-2 flex justify-around gap-5">
                  <div>
                    <i
                      class="fa-brands text-lg outline-1 text-blue-500 fa-facebook-f border rounded-full w-13 h-13 text-center p-4 hover:text-white cursor-pointer hover:bg-blue-500"
                    ></i>
                  </div>
                  <div>
                    <i
                      class="fa-brands text-lg outline-1 text-purple-500 fa-square-instagram cursor-pointer hover:text-white border-gray-200 hover:bg-purple-500 border rounded-full w-13 h-13 text-center p-4"
                    ></i>
                  </div>
                  <div>
                    <i
                      class="fa-brands fa-github outline-1 border text-lg rounded-full cursor-pointer hover:text-white border-gray-200 hover:bg-black w-13 h-13 text-center p-4"
                    ></i>
                  </div>
                  <div>
                    <i
                      class="fa-brands fa-linkedin outline-1 text-blue-700 border text-lg rounded-full cursor-pointer hover:text-white border-gray-200 hover:bg-blue-700 w-13 h-13 text-center p-4"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-3">
              <p class="text-[23px] font-bold">About Instructor</p>
              <div class="mt-2">
                {{ lecturer.biography }}
              </div>
            </div>
          </div>

          <div
            class="mt-7 flex flex-col max-h-full gap-2"
            v-if="active === 'Reviews'"
          >

            <div v-if="latestReviews" class="flex flex-col gap-2">
            
              <div
                v-for="review in latestReviews"
                :key="review._id"
                class="rounded-lg gap-5 bg-gray-50 flex-grow flex p-2"
              >
                <div class="max-w-15">
                  <img :src="review.userId.profileImg" class="rounded-full" />
                </div>

                <div class="flex flex-col gap-2">
                  <div class="text-[18px] font-semibold">
                    {{ review.userId.username }}
                  </div>
                   <span class="text-gray-500 text-[13px]"> {{ dayjs(review.createdAt).format("MMMM D, YYYY") }} </span>
                  <div class="flex gap-3 items-center">
                    <span>
                      <i
                        v-for="star in Array.from({length: review.rating})"
                        :key="star"
                        class="fa-star fas filled text-yellow-500"
                      ></i>

             
                    </span>
                   
                  </div>
                  <div class="text-[16px] line-clamp-4">
                    {{ review.content }}
                  </div>
                </div>
              </div>

              <div class="font-semibold text-lg">
                Your Review
              </div>
                <div 
                class="rounded-lg gap-5 bg-gray-50 flex-grow justify-between flex p-2"
              >
              <div class="flex gap-4">
                <div class="max-w-15">
                  <img :src="userReview.userId.profileImg" class="rounded-full" />
                </div>

                <div class="flex flex-col gap-2">
                  <div class="flex w-full justify-between ">
                  <div class="text-[18px] font-semibold">
                    {{ userReview.userId.username }}
                  </div>
                  
                  </div>
                   <span class="text-gray-500 text-[13px]"> {{ dayjs(userReview.createdAt).format("MMMM D, YYYY") }} </span>
                  <div class="flex gap-3 items-center">
                    <span>
                      <i
                        v-for="star in Array.from({length: userReview.rating})"
                        :key="star"
                        class="fa-star fas filled text-yellow-500"
                      ></i>

             
                    </span>
                   
                  </div>
                  <div class="text-[16px] line-clamp-4">
                    {{ userReview.content }}
                  </div>
                </div>
              </div>
              <div class="flex gap-3">
                    <!-- <i class="fa fa-pen text-lg cursor-pointer hover:text-blue-500"></i>
                    <i class="fa fa-trash text-lg cursor-pointer hover:text-red-500"></i> -->
                  </div>
                </div>
            </div>

            <div v-else>
              <div class="flex flex-col gap-4 justify-center items-center h-75">
                <div>
                  <i class="fa fa-comment text-[50px]"></i>
                </div>
                <div>
                  There are no ratings yet. Give your first impression of the
                  course
                </div>
              </div>
            </div>

            <div class="mt-auto flex justify-end flex-col gap-3 w-full">
              <div class="font-semibold tracking-wide text-lg text-slate-400 "> Rating</div>
              <vue3-star-ratings v-model="rating"/>

              <div class="font-semibold tracking-wide text-lg mt-4 text-slate-400"> Review</div>
              <textarea
                placeholder="Type in your review"
                v-model="newReview"
                class="outline-1 outline-gray-100 p-2 focus:outline-green-500 hover:outline-green-500 hover:outline-2 rounded-lg mt-auto w-full"
              ></textarea>
              
              <button
                class="p-2 w-full rounded-full bg-green-500 font-semibold cursor-pointer duration-300 hover:text-white hover:bg-black" 
                @click="addReview"
              >
                Send
              </button>
            </div>
          </div>

          <div class="mt-7 flex flex-col" v-if="active === 'Instructor'"></div>
        </div>
        <div class="md:w-auto p-2">
          <div
            class="shadow-sm bg-gray-100 rounded-lg md:w-90 h-auto text-black mt-4"
          >
          <div>
            <div v-if="courseBoughtStatus" class="py-3 px-4 font-bold text-lg"> You bought this course </div>
            <div v-else-if="!courseBoughtStatus" class="py-3 px-4 font-bold text-2xl">{{ course.price }} $</div>
            </div>
            <div class="flex flex-col justify-center p-7 items-center gap-2">
              
              <div v-if="courseBoughtStatus" class="w-full">
                <button class="bg-green-500 border p-4 rounded-lg w-full  text-white font-semibold tracking-wide cursor-pointer"" >
                  Go To Course
                </button>
              </div>

              <div v-else class="flex flex-col gap-2 w-full">
              <button v-if="!courseInCart"
                @click="addToCart"
                class="bg-white border p-4 rounded-lg w-full border-green-500 text-green-500 cursor-pointer"
              >
                Add To Cart
              </button>
              <button v-else
                @click="addToCart"
                class="bg-white border p-4 rounded-lg w-full border-green-500 text-green-500 cursor-pointer"
              >
                Item already in cart
              </button>
              <button
                class="bg-green-500 p-4 rounded-lg w-full text-white cursor-pointer"
              >
                Check out now!
              </button>
              </div>
            </div>

            <p class="text-sm text-center">35-day Money-Back guarantee</p>

            <div class="p-3">
              <span class="font-semibold"> This course includes: </span>

              <div class="flex justify-between items-center">
                <div>
                  <i
                    class="fa-solid fa-video text-green-400 text-sm mr-2 py-4 px-2"
                  >
                  </i>
                  Lectures
                </div>
                <div class="text-gray-80 font-semibold">{{ course?.lessons?.length }}</div>
              </div>

              <div class="flex justify-between items-center">
                <div>
                  <i
                    class="fa-solid fa-clock text-green-400 text-sm mr-2 py-4 px-2"
                  >
                  </i>
                  Duration
                </div>
                <div class="text-gray-80 font-semibold">{{formatToHoursMinutes(time)}}</div>
              </div>

              <div class="flex justify-between items-center">
                <div>
                  <i
                    class="fa-solid fa-keyboard text-green-400 text-sm mr-2 py-4 px-2"
                  >
                  </i>
                  Access
                </div>
                <div class="text-gray-80 font-semibold">Lifetime</div>
              </div>

              <div>
                <i
                  class="fa-solid fa-certificate text-sm mr-2 text-green-400 py-4 px-2"
                ></i>
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
