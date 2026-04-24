<script setup>
import { ref, reactive, shallowRef, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "../../stores/auth.store";
import { storeToRefs } from "pinia";
import CourseDetailsCreate from "../../components/CourseDetailsCreate.vue";
import CourseMediaCreate from "../../components/CourseMediaCreate.vue";
import Pricing from "../../components/Pricing.vue";
import { useRoute, useRouter } from "vue-router";
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
let index = 0;
const router = useRouter();
const route = useRoute();

const isActiveRoute = (path) => route.path === path;
console.log(route.path);
const props = defineProps(["editedCourse", "courseId"]);
const steps = shallowRef([
  { id: 1, title: "Course Details", component: CourseDetailsCreate },
  { id: 2, title: "Course Media", component: CourseMediaCreate },
  { id: 3, title: "Pricing", component: Pricing },
]);

// const currentStep = ref('CourseDetailsCreate')
// const setActiveComponent = function(component) {
//   currentStep.value = component
// }
// console.log(currentStep.value)

const apiUrl = import.meta.env.VITE_API_URL;
let currentStep = ref(1);
const categories = ref([
  { text: "Computer Science", value: "Computer Science" },
  { text: "Finance", value: "Finance" },
  { text: "Musical", value: "Musical" },
]);

const levels = ref([
  { text: "Beginner", value: "Beginner" },
  { text: "Intermediate", value: "Intermediate" },
  { text: "Advanced", value: "Advanced" },
]);

const nextStep = function () {
  if (currentStep.value < steps.value.length) {
    currentStep.value++;
  }
};

const prevStep = function () {
  if (currentStep.value !== 0) {
    currentStep.value--;
  }
};
const course = ref({});
const editCourseData = ref({});
console.log(route.params.courseId);

const getCourse = async () => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/courses/${route.params.courseId}`,
    );
    console.log(response.data.course);
    course.value = response.data.course;
    editCourseData.value = {
      title: course.value.title || "",
      introduction: course.value.introduction || "",
      lecturerId: user.value._id,
      requirements: course.value.requirements || [],
      learningQualities: course.value.learningQualities || [],
      level: course.value.level || "",
      category: course.value.category || "",
      description: course.value.description || "",
      promotionalVideo: course.value.promotionalVideo || null,
      courseImage: course.value.courseImage || null,
      price: course.value.price || 0,
    };

    console.log(editCourseData.value);
    return course.value;
  } catch (e) {
    console.log(e);
  }
};


const loading = ref(false);
const uploadProgress = ref(0);

const courseData = ref({
  title: "",
  introduction: "",
  requirements: [],
  learningQualities: [],
  level: "",
  category: "",
  description: "",
  promotionalVideo: null,
  courseImage: null,
  price: 0,
});
const instructor = ref("")
const getInstructorDetail = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/lecturer/${user.value._id}`);
    instructor.value = response.data.lecturer
    console.log(instructor.value)
  } catch (error) {
    console.error("Error fetching instructor details:", error);
  }
};


onMounted(async () => {
  if (route.params.courseId) {
    const courseData = await getCourse();
    console.log("Fetch course:", courseData);
  }
  getInstructorDetail()
});


const addCourse = async () => {
  try {
    loading.value = true;
    
    // Debug logging
    console.log("Current user:", user.value);
    console.log("User ID:", user.value._id);
    
    const formData = new FormData();
    formData.append("title", courseData.value.title);
    formData.append("introduction", courseData.value.introduction);
    formData.append("lecturerId", instructor.value);
    formData.append("level", courseData.value.level);
    formData.append("category", courseData.value.category);
    formData.append("description", courseData.value.description);
    formData.append("price", courseData.value.price);

    // Log FormData contents
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }

    courseData.value.requirements.forEach((req, index) => {
      formData.append(`requirements[${index}]`, req);
    });

    courseData.value.learningQualities.forEach((quality, index) => {
      formData.append(`learningQualities[${index}]`, quality);
    });

    if (courseData.value.promotionalVideo) {
      formData.append(`promotionalVideo`, courseData.value.promotionalVideo);
    }

    if (courseData.value.courseImage) {
      formData.append(`courseImage`, courseData.value.courseImage);
    }

    const response = await axios.post(
      `${apiUrl}/api/courses`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          uploadProgress.value = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
        },
      },
    );
    console.log(response.data);
    router.push("/instructor/course");
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
    uploadProgress.value = 0;
  }
};

const updateCourse = async () => {
  try {
    const formData = new FormData();
    formData.append("title", editCourseData.value.title);
    formData.append("introduction", editCourseData.value.introduction);
    formData.append("lecturerId", user.value._id);
    formData.append("level", editCourseData.value.level);
    formData.append("category", editCourseData.value.category);
    formData.append("description", editCourseData.value.description);
    formData.append("price", editCourseData.value.price);
    console.log(user.value._id);
    editCourseData.value.requirements.forEach((req, index) => {
      formData.append(`requirements[${index}]`, req);
    });

    editCourseData.value.learningQualities.forEach((quality, index) => {
      formData.append(`learningQualities[${index}]`, quality);
    });

    if (editCourseData.value.promotionalVideo) {
      formData.append(
        "promotionalVideo",
        editCourseData.value.promotionalVideo,
      );
    }

    if (editCourseData.value.courseImage) {
      formData.append("courseImage", editCourseData.value.courseImage);
    }

    // FIX: Send formData directly as the request body
    const response = await axios.put(
      `${apiUrl}/api/courses/${route.params.courseId}`,
      formData, // Send formData directly
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          uploadProgress.value = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
        },
      },
    );

    console.log(response.data);
    router.push("/instructor/course");
  } catch (e) {
    console.error("Update error:", e);
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Stepper -->
      <div class="mb-8">
        <div class="flex items-center justify-between relative">
          <div
            class="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"
          ></div>
          <div
            v-for="(step, index) in steps"
            :key="step.id"
            class="relative flex flex-col items-center group"
            :class="{ 'cursor-pointer': index < currentStep }"
            @click="index < currentStep ? (currentStep = index + 1) : null"
          >
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-200 bg-white"
              :class="[
                currentStep > index + 1
                  ? 'border-green-500 bg-green-500 text-white'
                  : currentStep === index + 1
                    ? 'border-green-500 text-green-500'
                    : 'border-gray-300 text-gray-400',
              ]"
            >
              <i v-if="currentStep > index + 1" class="fa-solid fa-check"></i>
              <span v-else>{{ step.id }}</span>
            </div>
            <div
              class="absolute top-12 text-xs font-medium whitespace-nowrap transition-colors duration-200"
              :class="[
                currentStep >= index + 1 ? 'text-gray-900' : 'text-gray-400',
              ]"
            >
              {{ step.title }}
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div
        class="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100"
      >
        <div class="p-6 sm:p-8">
          <component
            v-if="!route.params.courseId"
            :is="steps[currentStep - 1].component"
            v-model="courseData"
          />
          <component
            v-else
            :is="steps[currentStep - 1].component"
            v-model="editCourseData"
          />

          <!-- Upload Progress -->
          <div v-if="uploadProgress > 0 && loading" class="mt-6">
            <div class="flex justify-between mb-1">
              <span class="text-sm font-medium text-green-700"
                >Uploading...</span
              >
              <span class="text-sm font-medium text-green-700"
                >{{ uploadProgress }}%</span
              >
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div
                class="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                :style="{ width: `${uploadProgress}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Navigation Footer -->
        <div
          class="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-100"
        >
          <button
            @click="prevStep"
            :disabled="currentStep === 1"
            class="px-6 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div class="flex gap-3">
            <button
              v-if="currentStep < steps.length"
              @click="nextStep"
              class="px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              Next
            </button>

            <button
              v-if="
                currentStep === steps.length &&
                !isActiveRoute(
                  `/instructor/course/edit/${route.params.courseId}/`,
                )
              "
              @click="addCourse"
              :disabled="loading"
              class="px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors disabled:opacity-70"
            >
              <span v-if="loading"
                ><i class="fas fa-spinner fa-spin mr-2"></i>Creating...</span
              >
              <span v-else>Create Course</span>
            </button>

            <button
              v-if="
                currentStep === steps.length &&
                isActiveRoute(
                  `/instructor/course/edit/${route.params.courseId}/`,
                )
              "
              @click="updateCourse"
              :disabled="loading"
              class="px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors disabled:opacity-70"
            >
              <span v-if="loading"
                ><i class="fas fa-spinner fa-spin mr-2"></i>Updating...</span
              >
              <span v-else>Update Course</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
