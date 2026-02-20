<script setup>
import { ref } from 'vue';

const props = defineProps({ modelValue: Object });
const emit = defineEmits(['update:modelValue']);

// Helper to ensure curriculum structure exists
const ensureCurriculum = () => {
  if (!props.modelValue.curriculum) {
    const updated = { ...props.modelValue, curriculum: [] };
    emit('update:modelValue', updated);
  }
};

const addSection = () => {
  ensureCurriculum();
  const updated = { ...props.modelValue };
  updated.curriculum.push({
    title: '',
    lessons: []
  });
  emit('update:modelValue', updated);
};

const removeSection = (index) => {
  const updated = { ...props.modelValue };
  updated.curriculum.splice(index, 1);
  emit('update:modelValue', updated);
};

const addLesson = (sectionIndex) => {
  const updated = { ...props.modelValue };
  updated.curriculum[sectionIndex].lessons.push({
    title: '',
    type: 'video', // video, text, quiz
    content: ''
  });
  emit('update:modelValue', updated);
};

const removeLesson = (sectionIndex, lessonIndex) => {
  const updated = { ...props.modelValue };
  updated.curriculum[sectionIndex].lessons.splice(lessonIndex, 1);
  emit('update:modelValue', updated);
};
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Curriculum</h2>
      <p class="mt-1 text-sm text-gray-500">Structure your course into sections and lessons.</p>
    </div>

    <div class="space-y-6">
      <div 
        v-for="(section, sIndex) in props.modelValue.curriculum" 
        :key="sIndex"
        class="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
      >
        <!-- Section Header -->
        <div class="bg-gray-50 p-4 border-b border-gray-200 flex items-center gap-4">
          <div class="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full text-gray-600 font-bold text-sm">
            S{{ sIndex + 1 }}
          </div>
          <div class="flex-grow">
            <input
              v-model="section.title"
              type="text"
              placeholder="Enter section title (e.g., Introduction)"
              class="w-full bg-transparent border-none focus:ring-0 font-medium text-gray-900 placeholder-gray-400 p-0"
            />
          </div>
          <button 
            @click="removeSection(sIndex)"
            class="text-gray-400 hover:text-red-500 transition-colors"
            title="Delete Section"
          >
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>

        <!-- Lessons List -->
        <div class="p-4 space-y-3">
          <div 
            v-for="(lesson, lIndex) in section.lessons" 
            :key="lIndex"
            class="flex items-center gap-3 pl-4 border-l-2 border-gray-100"
          >
            <div class="w-6 h-6 flex items-center justify-center bg-green-100 text-green-600 rounded text-xs">
              <i class="fa-solid fa-play" v-if="lesson.type === 'video'"></i>
              <i class="fa-solid fa-file-text" v-else></i>
            </div>
            <input
              v-model="lesson.title"
              type="text"
              placeholder="Lesson title"
              class="flex-grow px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
            <button 
              @click="removeLesson(sIndex, lIndex)"
              class="text-gray-400 hover:text-red-500 transition-colors text-sm"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <button
            @click="addLesson(sIndex)"
            class="ml-4 text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1 mt-2"
          >
            <i class="fa-solid fa-plus"></i> Add Lesson
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div 
        v-if="!props.modelValue.curriculum || props.modelValue.curriculum.length === 0"
        class="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
      >
        <div class="text-gray-400 mb-3">
          <i class="fa-solid fa-list-check text-4xl"></i>
        </div>
        <p class="text-gray-500">No sections added yet.</p>
        <button
          @click="addSection"
          class="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
        >
          Start Adding Content
        </button>
      </div>

      <!-- Add Section Button -->
      <button
        v-if="props.modelValue.curriculum && props.modelValue.curriculum.length > 0"
        @click="addSection"
        class="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-all font-medium flex items-center justify-center gap-2"
      >
        <i class="fa-solid fa-plus"></i> Add New Section
      </button>
    </div>
  </div>
</template>
