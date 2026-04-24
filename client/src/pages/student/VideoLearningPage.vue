<script setup>
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import { onMounted, ref, computed } from "vue";
import { nextTick } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../../stores/auth.store";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import axios from "axios";
onMounted(() => {
  const player = new Plyr("#player");
});
const router = useRouter()
const courseLessons = ref([]);
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const route = useRoute();
const open = ref(true);
const apiUrl = import.meta.env.VITE_API_URL;
const toggleLessonSection = function(){
  open.value = !open.value
}
const courseId = route.params.courseId;
const getLessonData = async () => {
  try {
    const userId = user.value?._id;
    const url = userId 
      ? `${apiUrl}/api/courses/${courseId}/${userId}/lessons`
      : `${apiUrl}/api/courses/${courseId}/lessons`;
    
    const response = await axios.get(url);
    console.log(response);
    courseLessons.value = response.data.lessonsList;
    console.log(courseLessons.value);

  } catch (e) {
    console.error(e);
    if (e.response?.status === 403) {
      console.warn("Access denied: Course not purchased");
      router.push({
        path: `/course/${courseId}`,
        query: { accessDenied: 'true' }
      });
    } else {
      console.log(e);
    }
  }
};

const course = ref("")
const getCourseData = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/courses/${courseId}`)
    course.value = response.data.course
    console.log(response.data)
  } catch (err) {
    console.log(err)
  }
}

const time = ref("")
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

onMounted(() => {
  getLessonData();
  getCourseData();
  getTotalTime()
});

let playingIndex = ref(0);
let videoRef = ref(null);
function selectVideo(index) {
  playingIndex.value = index;
    if (videoRef.value) {
      videoRef.value.load();
      videoRef.value.play();
    }
  
}

const backToCourseDetails = function() {
  router.push({
    path: `/course/${courseId}`
  })
}

const overviewClicked = ref(true)
const courseContent = ref(false)

const toggleOverview = function() {
    overviewClicked.value = true  
    courseContent.value = false
}

const toggleCourseContentSection= function() {
    overviewClicked.value = false
    courseContent.value = true
}

const progressPercent = ref("");
const handleVideoEnded = async () => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/progress/mark-complete/${user.value._id}`,
      {
        courseId: courseId,
        lessonId: courseLessons.value[playingIndex.value]._id,
      },
    );
    progressPercent.value = response.data.progressPercent;
  } catch (err) {
    console.log("Error in marking completion", err);
  }
};

const videoPlaying = computed(() => {
  if (courseLessons.value.length > 0) {
    return courseLessons.value[playingIndex.value]?.videoUrl || "";
  }
  return "";
});

const formatDuration = (seconds) => {
  const totalSeconds = Math.round(seconds);

  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};

console.log(playingIndex.value);
</script>

<template>
  <div class="w-full flex flex-row min-h-screen">
    <div class="md:w-full bg-black mx-auto border mr-auto">
      <div
        class="bg-black text-white p-3 text-xl font-semibold border-r-0 flex gap-4 cursor-pointer items-center"
      >
        <i class="fa-solid fa-chevron-left hover:text-green-500 duration-200 text-lg" @click="backToCourseDetails"></i>
        <span> {{ course.title }} </span>
      </div>
      <div class="w-full max-w-4xl mx-auto">
        <video
          ref="videoRef"
          id="player"
          class="aspect-video w-full relative  mx-auto"
          preload="auto"
          autoplay
          controls
          @ended="handleVideoEnded"
        >
          <source :src="videoPlaying" type="video/webm" />
          <source :src="videoPlaying" type="video/mp4" />
        </video>


        <div @click="toggleLessonSection" v-if="open" class=" cursor-pointer  absolute top-30 text-lg  text-white right-0">
          <div class="border rounded-l-lg text-center hover:bg-white hover:text-green-500 duration-250 bg-green-500 w-12 p-3">
            <i class="fa fa-chevron-left"></i>
          </div>
        </div>
      </div>

      <div v-if="courseLessons.length > 0" class="p-4 bg-[#3d3d3d] text-white">
        <h2 class="text-xl font-semibold">
          {{ courseLessons[playingIndex].title }}
        </h2>
      </div>
      <div
        v-if="courseLessons.length > 0"
        class="bg-slate-200 p-4 border-b border-gray-400 text-black"
      >
        <p class=" text-md font-semibold">
          {{ courseLessons[playingIndex].content }}
        </p>
      </div>

      <div class="flex items-start px-4 gap-3 bg-white border-b border-gray-400">
        <div @click="toggleOverview" :class=" overviewClicked ? 'text-lg p-3 border-b-2 border-green-500 font-semibold text-green-700 cursor-pointer'
          : `text-lg p-3 hover:border-b-2 hover:border-green-500 hover:font-semibold hover:text-green-700 cursor-pointer`">
          Overview
        </div>

        <div  @click="toggleCourseContentSection" 
        :class=" courseContent ? 'text-lg p-3 border-b-2 border-green-500 font-semibold text-green-700 cursor-pointer'
        : 'text-lg p-3 hover:border-b-2 hover:border-green-500 hover:font-semibold hover:text-green-700 cursor-pointer'">
          Course Content
        </div>
        <div>

        </div>
      </div>

      <div v-if="overviewClicked" class="bg-white px-5 mx-auto    py-4">
        <div class="flex justify-center flex-col items-center">
          <p class="text-[21px] p-2 ">
            The modern JavaScript course for everyone! Master JavaScript with
            projects, challenges and theory. Many courses in one!
          </p>
        
        <div class="flex p-2  w-full  items-start  gap-6">
          <div class="flex items-center   gap-2 "> 
            <p class="font-semibold text-yellow-700 text-lg">{{ course.rating?.toFixed(1) }}</p>
            <div>
            <i class="fa fa-star text-yellow-700"></i>
            </div>
          </div>
          <div class="text-lg flex  gap-2 items-center">
            <span class="font-semibold">{{ course?.studentsEnrolled?.length }}</span> 
            <p class="text-sm">students</p> <i class="fa-solid fa-stars"></i>
          </div>

          <div class="text-lg flex gap-2 items-center">
            <span class="font-semibold"> {{formatToHoursMinutes(time)}}</span> 
            <p class="text-sm">hours</p></div>
        </div>
      </div>
      </div>

      <div v-if="courseContent" class="flex bg-white p-6 w-full justify-center items-center">
         <ul class="odd:bg-gray-100 even:bg-white w-full">
              <li
                :class=" playingIndex === index 
                ? `flex px-2 py-4 justify-between bg-green-500 font-semibold text-white cursor-pointer` 
                : `flex px-2 py-4 justify-between odd:bg-gray-100 font-semibold even:bg-white cursor-pointer`"
                 @click="selectVideo(index)"
                v-for="(lesson, index) in course.lessons"
                :key="index"
              >
                <div>
                  <i class="fa-solid fa-book mr-3"></i>
                  {{ index + 1 }} - {{ lesson.title }}
                </div>
                <div>{{ formatDuration(lesson.duration) }}</div>
              </li>
            </ul>
      </div>


    </div>
    <div v-if="!open" class="w-1/3 mx-auto md:block container sm:hidden">
      <div class="overflow-y-auto w-full min-h-screen">
        <div class="flex items-center">
        <p class="p-2.5 border-l-0 md:w-full text-lg font-semibold">
          Lesson contents
        </p>
        <button @click="toggleLessonSection" class="hover:shadow-md cursor-pointer p-2 rounded-lg duration-200 hover:bg-gray-200">
        <i class="fa fa-x text-sm text-slate-400"></i>
        </button>
        </div>


        <div
          v-for="(lesson, index) in courseLessons"
          :key="lesson._id"
          @click="selectVideo(index)"
          :class="
            playingIndex === index
              ? 'w-auto border p-3 bg-green-500 cursor-pointer text-white'
              : 'w-auto border p-3 bg-gray-100 cursor-pointer hover:text-white hover:bg-green-500'
          "
        >
          <i
            :class="
              playingIndex === index
                ? 'fa-solid fa-pause mr-2'
                : 'fa-solid fa-play mr-2'
            "
          ></i>
          {{ lesson.title }}
          <div>
            <i class="fa-solid fa-tv mr-2"></i>
            {{ formatDuration(lesson.duration) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
