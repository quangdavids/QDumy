<script setup>
import CourseCard from "../../components/CourseCard.vue";
import { RouterLink, useRouter } from "vue-router";
import axios from "axios";
import { onMounted, reactive, ref } from "vue";
import { useAuthStore } from "../../stores/auth.store";
import { storeToRefs } from "pinia";
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const courses = ref([]);
const lecturer = ref([])
const router = useRouter()
const apiUrl = import.meta.env.VITE_API_URL;
const getEnrolledCourses = async () => {
  
  const response = await axios.get(
    `${apiUrl}/api/courses/owned/${user.value._id}`,
  );
  courses.value = response.data.ownedCourses;

  console.log(courses.value);
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

const searchQuery = ref("")
const isSearched = ref(false)

const queryCourses = ref([])
const searchCourse = async (req, res) => {
  try {
    const response = await axios.get(`${apiUrl}/api/courses/search/${user.value._id}?courseQuery=${searchQuery.value}`,
    )
    queryCourses.value = response.data.courses
    if (searchQuery.value.length === 0) {
      isSearched.value = false
    } else {
      isSearched.value = true
    }
    console.log(response.data)
  } catch (err) {
    console.log(err)
  }
}

onMounted(getEnrolledCourses);
</script>

<template>
  <div class="h-30 flex items-center max-w-full justify-start w-auto bg-gray-800 text-white">
    <div class="ml-20 text-3xl font-bold">My Courses</div>
  </div>

  <div class="container mx-auto p-4 flex justify-center items-center">
    <div class="flex w-full max-w-lg items-center gap-4">
      <label for="search-courses" class="hidden sm:block font-medium text-gray-700">Search Course</label>
      <div class="relative flex-grow">
        <input id="search-courses" type="text" placeholder="Search..."
        v-model="searchQuery"
          class="border-2 border-gray-300 p-2 pl-4 pr-10 w-full rounded-full focus:outline-none focus:border-green-500" />
        <i @click="searchCourse" class="hover:text-green-500 cursor-pointer fa-solid fa-magnifying-glass text-gray-400 absolute right-4 top-1/2 -translate-y-1/2"></i>
      </div>
    </div>
  </div>

  <div
    v-if = "!isSearched"
    class="grid lg:grid-cols-3 grid-cols-2 sm:grid-cols-1 max-[640px]:grid-cols-1 container mx-auto justify-between p-3 space-y-2 space-x-3">
    <CourseCard v-for="course in courses" :key="course._id" 
      :title=course.title
      :lecturer="course.lecturerId?.lecturerName" 
      :images=course.courseImage 
      owned-status="true" 
      :progress="course.progressPercent"
      @click="handleNavigation(course._id)" />
  </div>

   <div
    v-else-if = "isSearched"
    class="grid lg:grid-cols-3 grid-cols-2 sm:grid-cols-1 max-[640px]:grid-cols-1 container mx-auto justify-between p-3 space-y-2 space-x-3">
    <CourseCard v-for="course in queryCourses" :key="course._id" :title=course.title
      :lecturer="course.lecturerId?.lecturerName" :images=course.courseImage owned-status="true" :progress="course.progressPercent"
      @click="handleNavigation(course._id)" />
  </div>
</template>
