<script setup>
import axios from "axios";
import { onMounted, ref, watch } from "vue";
import { useAuthStore } from "../../stores/auth.store";
import { storeToRefs } from "pinia";
import dayjs from "dayjs";

const authStore = useAuthStore();
const courses = ref([]);

const selectedCourseId = ref("");
const { user } = storeToRefs(authStore);
const isLoading = ref(false)
const getLecturerCourseInfo = async () => {
  try {
    const lecturerInfo = await axios.get(
      `${apiUrl}/api/lecturer/${user.value._id}`,
    );
    const response = await axios.get(
      `${apiUrl}/api/courses/list/${lecturerInfo.data.lecturer}`,
    );
    courses.value = response.data.courses;
    console.log(response.data.courses);
  } catch (e) {
    console.log(e);
  }
};

const students = ref([]);
const currentPage = ref(1);
const limit = ref(6);
const totalStudents = ref("");
const totalPages = ref(1);
const apiUrl = import.meta.env.VITE_API_URL;
const getStudentsByCourse = async () => {
  if (!selectedCourseId.value) return;
  isLoading.value = true
  try {
    const response = await axios.get(
      `${apiUrl}/api/lecturer/students-by-courses/${selectedCourseId.value}?page=${currentPage.value}&limit=${limit.value}`,
    );
    students.value = response.data.students;
    // currentPage.value = response.data.currentPage;
    
    console.log(response.data);
  } catch (err) {
    console.log(err);
  } finally {
    isLoading.value = false
  }
};

const changePage = (newPage) => {
  try {
    if (newPage > 0 && newPage <= totalPages.value) {
      currentPage.value = newPage;
      console.log(currentPage.value);
      // getLecturerCourseInfo();
    }
  } catch (err) {
    console.log(err);
  }
};

watch(selectedCourseId, () => {
  currentPage.value = 1;
  getStudentsByCourse();
});

watch(selectedCourseId, () => {
  getStudentsByCourse();
});
onMounted(() => {
  getLecturerCourseInfo();
});
</script>

<template>
  <div class="py-3 px-4">
    <div class="px-2 ml-4 py-4">
      <p class="font-bold text-[20px]">List of Enrolled Students</p>
    </div>
    <div class="py-2">
      <div>
        <div class="p-3 rounded-t-lg border-slate-800/20 border-1 border-b-0">
          <div class="flex gap-3">
            <input
              type="text"
              placeholder="Search for student's name"
              class="text-xs outline-1 rounded-md outline-slate-400 focus:outline-3 p-2"
            />

            <select
              id="course"
              v-model="selectedCourseId"
              class="text-xs font-bold text-slate-700 outline-1 rounded-md outline-slate-400 focus:outline-3 p-2"
            >
              <option value="" disabled>Select Course</option>
              <!-- <option value="student">Student</option>
              <option value="instructor">Instructor</option> -->
              <option
                v-for="course in courses"
                :key="course._id"
                :value="course._id"
              >
                {{ course.title }}
              </option>
            </select>
          </div>
        </div>
        <table class="w-full">
          <thead>
            <tr
              class="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide"
            >
              <th class="py-4 px-6 border-b border-slate-100 text-center">
                User
              </th>
              <th class="py-4 px-6 border-b border-slate-100 text-center">
                Progress
              </th>
              <th class="py-4 px-6 border-b border-slate-100 text-center">
                Enrollment Date
              </th>
              <th class="py-4 px-6 border-b border-slate-100 text-center">
                Status
              </th>
              <th class="py-4 px-6 border-b border-slate-100 text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100" :class="{'opacity-50': isLoading}" >
            <tr v-if="students.length === 0 && !isLoading">
              <td colspan="5" class="py-10 text-center text-gray-400">
                No students found for this course.
              </td>
            </tr>
            <tr
              v-for="student in students"
              :key="student._id"
              class="hover:bg-slate-50 border-slate-200 border-1"
            >
              <td class="flex py-4 px-2 gap-4">
                <img
                  :src="student.profileImg"
                  class="w-15 h-15 outline-1 outline-gray-300 rounded-full"
                />
                <div>
                  <p class="text-sm font-bold">{{ student.username }}</p>
                  <p class="text-xs font-semibold text-slate-600">
                    {{ student.email }}
                  </p>
                </div>
              </td>
              <td>
                <div
                  v-if="student.progressPercent <= 25"
                  class="flex items-center gap-2.5"
                >
                  <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      class="bg-red-600 h-2.5 rounded-full"
                      :style="{ width: student.progressPercent }"
                    ></div>
                  </div>
                  <div class="text-md text-red-500 font-semibold">
                    {{ `${student.progressPercent}%` }}
                  </div>
                </div>

                <div
                  v-else-if="
                    student.progressPercent >= 25 &&
                    student.progressPercent <= 75
                  "
                  class="flex items-center gap-2.5"
                >
                  <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      class="bg-yellow-600 h-2.5 rounded-full"
                      :style="{ width: student.progressPercent }"
                    ></div>
                  </div>
                  <div class="text-md text-yellow-500 font-semibold">
                    {{ `${student.progressPercent}%` }}
                  </div>
                </div>

                <div v-else class="flex items-center gap-2.5">
                  <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      class="bg-green-600 h-2.5 rounded-full"
                      :style="{ width: student.progressPercent }"
                    ></div>
                  </div>
                  <div class="text-md text-green-500 font-semibold">
                    {{ `${student.progressPercent}%` }}
                  </div>
                </div>
              </td>
              <td class="text-center">
                <p class="text-slate-600 text-sm font-semibold tracking-wide">
                  {{ dayjs(student.dateEnrolled).format("MMMM D, YYYY") }}
                </p>
              </td>
              <td class="text-center">
                <div
                  class="text-green-500 flex gap-3 justify-center items-center text-sm font-semibold tracking-wide"
                >
                  <div class="bg-green-500 w-3 h-3 rounded-full"></div>
                  <p>{{ student.status }}</p>
                </div>
              </td>
              <td class="text-center">
                <div class="flex gap-5 justify-center">
                  <button
                    class="py-3 hover:bg-black duration-200 cursor-pointer px-2 flex gap-3 rounded-lg bg-green-500 text-white font-semibold"
                  >
                    <i class="fa fa-comments text-lg"></i>
                    <p class="text-sm">Chat</p>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="p-3 rounded-b-lg border-slate-800/20 border-1">
          <div class="flex gap-3 justify-end">
            <button
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
              class="outline-1 outline-gray-400 rounded-lg h-12 w-12 disabled:opacity-60 disabled:text-gray-300 cursor-pointer disabled:outline-gray-300"
            >
              <i class="fa fa-chevron-left"></i>
            </button>
            <button
              class="outline-1 outline-gray-400 bg-green-500 font-bold text-white rounded-lg h-12 w-12"
            >
              {{ currentPage }}
            </button>
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage  == totalPages"
              class="outline-1 outline-gray-400 rounded-lg h-12 w-12 disabled:text-gray-300 cursor-pointer disabled:outline-gray-300"
            >
              <i class="fa fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
