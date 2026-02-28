<script setup>
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import { onMounted, ref, computed } from "vue";
import { nextTick } from "vue";
import axios from "axios";
import { useRoute } from 'vue-router'
import { useAuthStore } from "../../stores/auth.store";
import { storeToRefs } from "pinia";

onMounted(() => {
  const player = new Plyr("#player");
});


const courseLessons = ref([]);
let courseJSON = ref("");
const route = useRoute()
const courseId = route.params.courseId
const getLessonData = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/courses/${courseId}/lessons`
    );
    console.log(response);
    courseLessons.value = response.data.lessonsList;
    console.log(courseLessons.value);
    courseJSON.value = JSON.parse(JSON.stringify(courseLessons.value));

    console.log(courseJSON);
  } catch (e) {
    console.log(e);
  }
};
onMounted(() => {
  getLessonData();
});

let playingIndex = ref(0);
let videoRef = ref(null);
function selectVideo(index) {
  playingIndex.value = index;

  nextTick(() => {
    if (videoRef.value) {
      videoRef.value.load();
      videoRef.value.play();
    }
  });
}


const progressPercent = ref("")
const authStore = useAuthStore();
const { user } = storeToRefs(authStore)
const handleVideoEnded = async () => {
  try{
    const response = await axios.post(`http://localhost:3000/api/progress/mark-complete/${user.value._id}`,
      { 
        courseId: courseId,
        lessonId: courseLessons.value[playingIndex.value]._id 
      },
    )
    progressPercent.value = response.data.progressPercent
  } catch (err) {
    console.log("Error in marking completion", err)
  }
}

const videoPlaying = computed(() => {
  if (courseLessons.value.length > 0) {
    
    return courseLessons.value[playingIndex.value]?.videoUrl || "";
  }
  return "";
});


const formatDuration = (seconds) => {
    const totalSeconds = Math.round(seconds)

    const minutes = Math.floor(totalSeconds / 60)
    const remainingSeconds = totalSeconds % 60
     return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

console.log(playingIndex.value);

</script>

<template>
  <div class="w-full flex flex-row min-h-screen">
    <div class="md:w-2/3 mx-auto border mr-auto">
      <div
        class="bg-black text-white p-3 text-xl font-semibold border-r-0 flex gap-4 cursor-pointer items-center"
      >
        <i class="fa-solid fa-chevron-left text-xl"></i>
        <span> Dance With Kha Banh </span>
      </div>
      <div class="w-full max-w-4xl mx-auto">
      <video
        ref="videoRef"
        id="player"
        @ended="handleVideoEnded"
        class=" aspect-video w-full object-cover mx-auto"
        preload="auto"
        autoplay
        controls
      >
       <source :src="videoPlaying" type="video/webm" />
        <source :src="videoPlaying" type="video/mp4" />
      </video>
      </div>
      <div v-if="courseLessons.length > 0" class="p-4 bg-[#3d3d3d]  text-white">
        <h2 class="text-xl font-semibold">
          {{ courseLessons[playingIndex].title }}
        </h2>
       
      </div>
 <div v-if="courseLessons.length > 0"  class="bg-white p-4 text-black">
         <p class=" ">
          {{ courseLessons[playingIndex].content }}
        </p>
        </div>

      
    </div>
    <div class="w-1/3 mx-auto md:block container sm:hidden ">
      <div class="overflow-y-auto w-full min-h-screen ">
        <p class="p-2.5 border-l-0 md:w-full text-xl font-semibold">
          Lesson contents
        </p>

        <div class="max-w-full border p-3 bg-gray-100">
          Part I. Introductory Dances
          <div>
            <i class="fa-solid fa-book mr-2"></i>
            10 titles
          </div>
        </div>

        <div
          v-for="(lesson, index) in courseJSON"
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
