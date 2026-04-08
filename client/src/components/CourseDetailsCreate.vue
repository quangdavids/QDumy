<script setup>
import { ref, reactive, watch } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import { useAuthStore } from "../stores/auth.store";
import { storeToRefs } from "pinia";
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
import {useRoute, useRouter} from 'vue-router'

const router = useRouter();
const route = useRoute();

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

const props = defineProps({ 
  modelValue: {
    type: Object,
    default: () => ({
      title: "",
      introduction: "",
      category: "",
      level: "",
      requirements: [],
      learningQualities: [],
      description: "<p>Hello, this is Quill</p>"
    })
  }
});
const emit = defineEmits(["update:modelValue"]);

const selectedLevel = ref("");
const selectedCategory = ref("");

const addQualities = function () {
  const updatedValue = { ...props.modelValue}
  updatedValue.learningQualities.push("");
  emit("update:modelValue", updatedValue);
};

const deleteQuality = function (index) {
  const updatedValue = { ...props.modelValue };
  updatedValue.learningQualities.splice(index, 1);
  emit("update:modelValue", updatedValue);
}
const addRequirements = function () {
  // Create a new object to avoid mutating props directly
  const updatedValue = { ...props.modelValue };
  // Add new empty requirement to the array
  updatedValue.requirements.push("");
  // Emit the update
  emit("update:modelValue", updatedValue);
};

const deleteRequirement = function (index) {
  const updatedValue = { ...props.modelValue };
  updatedValue.requirements.splice(index, 1);
  emit("update:modelValue", updatedValue);
};

const handleDescriptionUpdate = (newContent) => {
  // Create a new object to avoid directly mutating the prop
  const updatedValue = { ...props.modelValue, description: newContent };
  // Emit the update to the parent component
  emit("update:modelValue", updatedValue);
};

// const addCourse = async () => {
//   try{
//      const courseData = {
//       title: title.value,
//       introduction: intro.value,
//       lecturerId: user.value._id,
//       requirements: requirements.value,
//       learningQualities: qualities.value,
//       level: selectedLevel.value,
//       category: selectedCategory.value
//     }
//     const response = await axios.post("http://localhost:3000/api/courses", courseData)
//     console.log(response.data)
//   } catch (e) {
//     console.log(e)
//   }
// }
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Course Details</h2>
      <p class="mt-1 text-sm text-gray-500">Provide the basic information about your course.</p>
    </div>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
        <input
          type="text"
          placeholder="e.g., Complete Python Bootcamp: Go from zero to hero in Python 3"
          v-model="props.modelValue.title"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Short Introduction</label>
        <textarea
          rows="3"
          placeholder="Briefly describe what your course is about..."
          v-model="props.modelValue.introduction"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
        ></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <div class="relative">
            <select
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none bg-white transition-colors"
              v-model="props.modelValue.category"
            >
              <option value="" disabled>Select a category</option>
              <option
                v-for="category in categories"
                :key="category.value"
                :value="category.value"
              >
                {{ category.text }}
              </option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <i class="fas fa-chevron-down text-xs"></i>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Level</label>
          <div class="relative">
            <select
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none bg-white transition-colors"
              v-model="props.modelValue.level"
            >
              <option value="" disabled>Select a level</option>
              <option
                v-for="level in levels"
                :key="level.value"
                :value="level.value"
              >
                {{ level.text }}
              </option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <i class="fas fa-chevron-down text-xs"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Requirements -->
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <label class="block text-sm font-medium text-gray-700">Course Requirements</label>
            <button
              class="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1 transition-colors"
              @click="addRequirements"
            >
              <i class="fa-solid fa-plus"></i> Add New
            </button>
          </div>
          <div class="space-y-2">
            <div 
              v-for="(requirement, index) in (props.modelValue?.requirements || [])" 
              :key="index"
              class="flex items-center gap-2 group"
            >
              <div class="flex-grow relative">
                <input
                  type="text"
                  v-model="props.modelValue.requirements[index]"
                  placeholder="e.g., Basic understanding of HTML"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors pr-8"
                />
              </div>
              <button
                class="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                @click="deleteRequirement(index)"
                title="Remove requirement"
              >
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
            <div v-if="!props.modelValue?.requirements || props.modelValue.requirements.length === 0" class="text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg text-center border border-dashed border-gray-300">
              No requirements added yet.
            </div>
          </div>
        </div>

        <!-- Learning Outcomes -->
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <label class="block text-sm font-medium text-gray-700">What will students learn?</label>
            <button
              class="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1 transition-colors"
              @click="addQualities"
            >
              <i class="fa-solid fa-plus"></i> Add New
            </button>
          </div>
          <div class="space-y-2">
            <div
              v-for="(quality, index) in (props.modelValue?.learningQualities || [])"
              :key="index"
              class="flex items-center gap-2 group"
            >
              <div class="flex-grow relative">
                <input
                  v-model="props.modelValue.learningQualities[index]"
                  type="text"
                  placeholder="e.g., Build full-stack web applications"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>
              <button
                class="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                @click="deleteQuality(index)"
                title="Remove outcome"
              >
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
            <div v-if="!props.modelValue?.learningQualities || props.modelValue.learningQualities.length === 0" class="text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg text-center border border-dashed border-gray-300">
              No learning outcomes added yet.
            </div>
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
        <div class="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500">
          <QuillEditor
            :content="props.modelValue.description"
            @update:content="handleDescriptionUpdate"
            theme="snow"
            content-type="html"
            toolbar="full"
            style="min-height: 200px;"
          />
        </div>
      </div>
    </div>
  </div>
</template>
