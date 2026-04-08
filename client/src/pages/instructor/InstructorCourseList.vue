<script setup>
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth.store";
import { storeToRefs } from "pinia";
import axios from "axios";
import { ref, onMounted } from "vue";
import CreateCoursePage from "./CreateCoursePage.vue";
import ConfirmationDialog from "../../components/ConfirmationDialog.vue";
import dayjs from "dayjs";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const showDialog = ref(false);
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
const currentPage = ref(1);
const totalPages = ref(1);
const totalCourse = ref(0);
const limit = ref(5);

console.log(user.value._id);
const getLecturerCourseInfo = async () => {
  try {
    const lecturerInfo = await axios.get(
      `http://localhost:3000/api/lecturer/${user.value._id}`,
    );
    const response = await axios.get(
      `http://localhost:3000/api/courses/list/${lecturerInfo.data.lecturer}?&page=${currentPage.value}&limit=${limit.value}`,
    );
    console.log(lecturerInfo.data);
    lecturer.value = response.data.courses;
    totalCourse.value = response.data.totalCourse;
    totalPages.value = response.data.totalPages;
    currentPage.value = response.data.currentPage;
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
  try {
    if (newPage > 0 && newPage <= totalPages.value) {
      currentPage.value = newPage;
      console.log(currentPage.value);
      getLecturerCourseInfo();
    }
  } catch (err) {
    console.log(err);
  }
};

const courseId = ref("");
const openDialog = function (id) {
  courseId.value = id;
  showDialog.value = true;
  console.log(showDialog.value);
};

const closeDialog = function () {
  showDialog.value = false;
  console.log(showDialog.value);
};
const submitCourse = async () => {
  try {
    const response = axios.put(
      `http://localhost:3000/api/courses/submission/${courseId.value}`,
    );
    console.log(response.data);
    getLecturerCourseInfo();
    showDialog.value = false;
  } catch (err) {
    console.log(err);
    alert("Error in submission");
  }
};

const showDeleteDialog = ref(false);
const openDeleteDialog = function (id) {
  courseId.value = id;
  showDeleteDialog.value = true;
  console.log(showDialog.value);
};

const closeDeleteDialog = function () {
  showDeleteDialog.value = false;
  console.log(showDialog.value);
};
const deleteCourse = async () => {
  try {
    const response = axios.delete(
      `http://localhost:3000/api/courses/${courseId.value}`,
    );
    console.log(response.data);
    showDeleteDialog.value = false;
    getLecturerCourseInfo();
  } catch (err) {
    console.log(err);
  }
};

const handleNavigationToLessons = async (courseId) => {
  router.push({
    path: `/instructor/course/view-lessons/${courseId}/`,
    params: courseId,
  });
};
</script>

<template>
  <div class="min-h-screen p-5 overflow-x-hidden">
    <div class="w-full max-w-screen-xl mx-auto">
      <div class="px-5 ml-4 py-4">
        <p class="font-bold text-[20px]">Your Courses</p>
      </div>
      <div class="mt-5 sm:mr-auto ml-6">
        <button
          @click="handleNavigation"
          class="hover:text-white cursor-pointer p-4 rounded-full hover:bg-black text-black hover:text0white transform duration-200 font-semibold text-sm bg-green-500"
        >
          Create Course
        </button>
      </div>
      <div v-if="lecturer.ownedCourses == 0" class="md:ml-20 sm:mr-auto mt-5">
        You have no courses yet, please create a course
      </div>

      <div
        v-else
        class="w-full overflow-hidden max-w-full h-auto px-3 py-3 flex flex-col rounded-lg bg-gray-100 mt-5 mb-3"
        v-for="course in lecturer"
        :key="course._id"
      >
        <div class="flex justify-between p-3 min-w-0">
          <div class="flex gap-4">
            <div class="border border-gray-300 max-w-40 max-h-40 py-2 px-3">
              <img :src="course.courseImage" class="object-cover" />
            </div>

            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <p
                  v-if="course.status === `pending`"
                  class="uppercase text-yellow-700 font-bold bg-yellow-200 text-xs p-2 rounded-lg"
                >
                  {{ course.status }}
                </p>

                <p
                  v-else-if="course.status === `draft`"
                  class="uppercase text-gray-600 font-bold bg-gray-200 text-xs p-2 rounded-lg"
                >
                  {{ course.status }}
                </p>

                <p
                  v-else-if="course.status === `published`"
                  class="uppercase text-green-700 font-bold bg-green-200 text-xs p-2 rounded-lg"
                >
                  {{ course.status }}
                </p>

                <p
                  v-else-if="course.status === `rejected`"
                  class="uppercase text-red-700 font-bold bg-red-200 text-xs p-2 rounded-lg"
                >
                  {{ course.status }}
                </p>

                <div class="w-2 h-2 rounded-full bg-slate-400"></div>
                <p class="text-sm text-slate-600 font-semibold">
                  Created on
                  {{ dayjs(course.createdAt).format("MMMM D, YYYY") }}
                </p>
              </div>

              <div>
                <p class="font-bold text-[19px]">{{ course.title }}</p>
                <p class="text-sm line-clamp-1" v-html="course.description"></p>
              </div>

              <div class="mt-auto mb-2 flex gap-4 text-slate-500">
                <div class="flex gap-2 items-center">
                  <i class="fa fa-users"></i>
                  <span class="text-black font-bold text-xs"> {{ course.studentsEnrolled.length }} </span>
                  <span class="text-slate-500 text-xs"> students</span>
                </div>

                <div class="flex gap-2 items-center">
                  <i class="fa fa-star text-yellow-600"></i>
                  <span class="text-black text-xs font-bold"> {{ course.rating }}</span>
                  <span class="text-slate-500 text-xs"> ({{ course.review.length }} reviews)</span>
                </div>

                <!-- <div class="flex gap-2 items-center">
                  <i class="fa fa-money-bill text-green-500"></i>
                  <span class="text-black font-bold text-xs"> $ {{ course.studentsEnrolled.length * course.price }} </span>
                  <span class="text-slate-500 text-xs"> earned</span>
                </div> -->
              </div>
            </div>
          </div>
          <div class="border-l-1 flex flex-col gap-2 border-gray-400 py-3 px-4">
            <button
              v-if="course.status !== `draft` && course.status !== `rejected`"
              class="bg-green-500 cursor-pointer text-center text-white py-2 flex gap-3 items-center text-xs px-3 rounded-lg font-bold"
            >
              <i class="fa fa-paper-plane text-white text-md"></i> Course has
              been submitted
            </button>
            <button
              v-else
              @click="openDialog(course._id)"
              class="bg-green-500 cursor-pointer text-center text-white py-2 flex gap-3 items-center text-xs px-3 rounded-lg font-bold"
            >
              <i class="fa fa-paper-plane text-white text-md"></i> Submit Course
            </button>
            <ConfirmationDialog
              color="bg-green-500"
              :show="showDialog"
              message="Do you want to submit your course"
              header="Course Submission Confirmation"
              @confirm="submitCourse()"
              @cancel="closeDialog()"
            />
            <button
              @click="handleNavigationToEdit(course._id)"
              class="bg-blue-500 cursor-pointer text-center text-white py-2 flex gap-3 items-center text-xs px-3 rounded-lg font-bold"
            >
              <i class="fa fa-pencil text-white text-md"></i> 
              <p class="mx-auto">Edit Course </p>
            </button>

            <button
              @click="handleNavigationToLessons(course._id)"
              class="bg-gray-200 cursor-pointer w-full text-center mx-auto py-2 flex gap-3 items-center text-xs px-3 rounded-lg font-bold"
            >
              <i class="fa fa-book text-md"></i> 
              <p class="mx-auto">View Lesson </p>
            </button>

            <button
              v-if="course.status === `published`"
              
                     >
              <!-- <i class="fa fa-trash text-white text-md"></i>
              <p class="mx-auto">Your course is published</p> -->
            </button>
            <button
              v-else
              @click="openDeleteDialog(course._id)"
              class="bg-red-500 text-white cursor-pointer py-2 flex gap-1 items-center text-xs px-3 rounded-lg font-bold"
            >
              <i class="fa fa-trash text-white text-md"></i>
              <p class="mx-auto">Delete</p>
            </button>
            <ConfirmationDialog
              color="bg-red-500"
              :show="showDeleteDialog"
              message="Do you want to delete your course"
              header="Course Deletion Confirmation"
              @confirm="deleteCourse()"
              @cancel="closeDeleteDialog()"
            />
          </div>
        </div>
      </div>

      <div class="flex mx-auto justify-center items-center space-y-2 mb-2">
        <div class="flex justify-evenly gap-3">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="bg-green-500 w-12 h-12 hover:bg-white hover:text-green-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer transition duration-300 text-white outline-1 outline-green-300 p-3 rounded-lg"
          >
            <i class="fa fa-arrow-left"></i>
          </button>
          <span class="flex self-center">
            {{ currentPage }}
          </span>
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="bg-green-500 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none hover:text-green-500 cursor-pointer transition duration-300 text-white w-12 h-12 outline-1 outline-green-300 p-3 rounded-lg"
          >
            <i class="fa fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
