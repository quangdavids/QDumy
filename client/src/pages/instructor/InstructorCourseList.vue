<script setup>
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth.store";
import { storeToRefs } from "pinia";
import axios from "axios";
import { ref, onMounted } from "vue";
import CreateCoursePage from "./CreateCoursePage.vue";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const router = useRouter();
const route = useRoute();
const isVisible = false;
const handleNavigation = function () {
  router.push("/instructor/course/manage/");
};

const handleNavigationToEdit = function (courseId) {
  router.push({
    path: `/instructor/course/edit/${courseId}/`,
    params: courseId,
  });
};

const lecturer = ref({});
const currentPage = ref(1)
const totalPages = ref(1)
const totalCourse = ref(0)
const limit = ref(5)
const getLecturerCourseInfo = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/courses/list/${user.value._id}?&page=${currentPage.value}&limit=${limit.value}`
    );
    lecturer.value = response.data.courses;
    totalCourse.value = response.data.totalCourse
    totalPages.value = response.data.totalPages
    currentPage.value = response.data.currentPage
    console.log(response.data);
    console.log(lecturer.value);
  } catch (e) {
    console.log(e);
  }
};
onMounted(() => {
  getLecturerCourseInfo();
});



const changePage = (newPage) => {
  try{
      if (newPage > 0  && newPage <= totalPages.value) {
          currentPage.value = newPage
          console.log(currentPage.value)
          getLecturerCourseInfo()
      }
    } catch (err) {
      console.log(err)
    }
}
</script>

<template>
  <div class="  min-h-screen  p-5 overflow-x-hidden">
    <div class="w-full max-w-screen-xl mx-auto">
      <div class=" font-semibold mt-5  ml-5 text-[30px]">Courses</div>
      <div class="mt-5 sm:mr-auto ml-5">
        <button
          @click="handleNavigation"
          class="hover:text-white cursor-pointer p-3 rounded-full hover:bg-black text-black hover:text0white transform duration-200 font-semibold text-sm bg-green-500"
        >
          Create Course
        </button>
      </div>
      <div v-if="lecturer.ownedCourses == 0" class="md:ml-20 sm:mr-auto mt-5">
        You have no courses yet, please create a course
      </div>
      <div
        v-else
        class="w-full overflow-hidden max-w-full h-auto px-3  py-3 flex flex-col rounded-lg bg-gray-100  mt-5 mb-3"
        v-for="course in lecturer"
        :key="course._id"
      >
      
        <div class="flex gap-3 flex-wrap justify-around  p-3 min-w-0 ">
          <div class="border border-gray-300 py-2 px-3">
            <img :src="course.courseImage" class="w-30 h-30 object-cover" />
          </div>
          <div class="flex flex-col gap-2">
            <div class="font-bold">
              {{ course.title }}
            </div>
            <div class="text-sm">Last updated: 10/2021</div>
            <div class="mt-auto">
              <button
                @click="handleNavigationToEdit(course._id)"
                class="font-semibold hover:bg-black active:ml-[2px] active:mt-[2px] hover:text-white transform duration-200 cursor-pointer text-sm rounded-full bg-green-500 px-2 py-3"
              >
                View Course
              </button>
              <CreateCoursePage v-if="isVisible" :course-id="course._id" />
            </div>
          </div>

          <div class="flex md:w-1/2 w-full md:p-2 min-w-0  gap-5">
              <div class=" bg-green-200 flex-1 min-w-0 w-full rounded-lg gap-2 p-2 flex flex-col justify-center">
                 <div class="text-[13px] text-green-900"> Earned </div>
                 <div class="font-bold text-green-700"> 0 $</div>
              </div>
               <div class=" bg-blue-200 w-full flex-1  rounded-lg min-w-0  gap-2 p-2 flex flex-col justify-center">
                 <div class="text-[13px] text-blue-900">  Enrollments </div>
                 <div class="font-bold text-blue-700"> 0</div>
              </div>
               <div class=" bg-orange-200 w-full flex-1 min-w-0 rounded-lg gap-2  p-2 flex flex-col justify-center">
                 <div class="text-[13px] text-orange-900"> Rating </div>
                 <div class="font-bold text-[12px] text-orange-700">  No rating yet 
                   <i class="fa fa-star"></i>
                  </div>
              </div>
          </div>

          <div class="flex self-center">
               <button class="rounded-lg px-4 py-3 bg-red-500 sm:w-full">
                    <i class="fa fa-trash text-white"></i>    
                </button>
          </div>


        </div>
      </div>
       <div class="flex mx-auto justify-center items-center space-y-2 mb-2">
      <div class="flex justify-evenly gap-3">
        <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1" 
        class=" bg-green-500 w-12 h-12
         hover:bg-white hover:text-green-500
         disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer transition duration-300 text-white outline-1 outline-green-300 p-3 rounded-full">
            <i class="fa fa-arrow-left"></i>
        </button>
         <span class="flex self-center">
          {{ currentPage }}
         </span>
          <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class=" bg-green-500 hover:bg-white
          disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none hover:text-green-500 cursor-pointer transition duration-300 text-white w-12 h-12 outline-1 outline-green-300 p-3 rounded-full">
            <i class="fa fa-arrow-right"></i>
        </button>
      </div>
    </div>
    </div>
  </div>
</template>
