<script setup>
import { VueDraggable } from "vue-draggable-plus";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
const list = ref([]);

const route = useRoute()
const router = useRouter()
const apiUrl = import.meta.env.VITE_API_URL;
const courseId = route.params.courseId
const getLessons = async () => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/courses/${courseId}/lessons`,
    );
    list.value = response.data.lessonsList;
    console.log(list.value)
  } catch (err) {
    console.log(err);
  }
};
console.log(courseId)
const handleNavigationToAddLesson = () => {
  router.push({
    path: `/instructor/course/add-lesson/${courseId}`
  })
}

const handleNavigationToEditLesson = (lessonId) => {
  router.push({
    path: `/instructor/course/edit-lesson/${lessonId}`
  })
}


const formatDuration = (seconds) => {
    const totalSeconds = Math.round(seconds)

    const minutes = Math.floor(totalSeconds / 60)
    const remainingSeconds = totalSeconds % 60
     return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}
onMounted(() => {
  getLessons()
} 
);
</script>

<template>
  <div>
    <div class="py-6 px-4 ml-3 flex justify-between">
      <div>
        <div class="text-gray-600 text-sm flex items-center gap-4">
          Courses <i class="fa fa-chevron-right text-[9px]"></i> Course Name
        </div>
        <div class="font-bold text-[20px] tracking-wide">Course Content</div>
      </div>
      <div>
      
          <button @click="handleNavigationToAddLesson"
            class="bg-green-500 flex items-center gap-2 font-bold text-[13px] text-white p-4 py-3 outline-1 shadow-md rounded-lg hover:bg-black cursor-pointer duration-300"
          >
            <i class="fa fa-plus"></i>
            Add New Lesson
          </button>
      

        <button></button>
      </div>
    </div>
  </div>

  <div class="p-3 ml-3">
    Showing <span class="font-bold"> {{ list.length }} lesson(s) </span> in the course
  </div>
  <VueDraggable v-model="list" item-key="id">
    <div v-for="lesson in list" :key="lesson._id" class="flex p-4 max-w-full mx-auto">
      <div
        class="flex justify-between items-center gap-5 bg-gray-100 shadow rounded-lg w-full outline-1 outline-gray-400 p-3 cursor-grab"
      >
        <div class="flex gap-3">
          <div class="flex items-center gap-2">
            <i class="fas fa-grip-vertical text-lg p-3 text-gray-400"></i>
            <div class="rounded-lg bg-green-200 text-center py-4 px-5">
              <i class="fa fa-book text-lg text-green-800"></i>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <p class="font-bold tracking-normal">
             {{ lesson.title }}
            </p>

            <div class="text-sm text-slate-400 line-clamp-1">
              {{ lesson.content }}
            </div>
            <div
              class="text-sm text-gray-600 font-semibold flex gap-2 items-center"
            >
              <i class="fa fa-clock"></i>
              <span> {{ formatDuration(lesson.duration) }}</span>
            </div>
          </div>
        </div>

        <div class="flex gap-5 p-4 text-[20px]">
          <button @click="handleNavigationToEditLesson(lesson._id)" 
          class="text-blue-600 font-semibold tracking-wide p-3 cursor-pointer hover:bg-blue-500 hover:text-white duration-300 text-sm bg-blue-200 rounded-lg">Edit</button>
          <button class="text-red-600 font-semibold tracking-wide p-3 text-sm hover:bg-red-500 cursor-pointer hover:text-white duration-300 bg-red-200 rounded-lg">Delete</button>
        </div>
      </div>
    </div>
  </VueDraggable>
</template>
