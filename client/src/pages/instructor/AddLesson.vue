<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

// Video recording state
const isRecording = ref(false);
const recordedChunks = ref([]);
const mediaRecorder = ref(null);
const stream = ref(null);
const recordingPreview = ref(null);

const startRecording = async () => {
  error.value = "";
  try {
    // Use getDisplayMedia for screen capture and getUserMedia for mic
    const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    let audioStream = null;
    try {
      audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      // Mic not available or permission denied
    }
    if (audioStream) {
      // Combine screen and mic audio tracks
      const combinedTracks = [
        ...screenStream.getVideoTracks(),
        ...screenStream.getAudioTracks(),
        ...audioStream.getAudioTracks()
      ];
      stream.value = new MediaStream(combinedTracks);
    } else {
      stream.value = screenStream;
    }
    mediaRecorder.value = new MediaRecorder(stream.value, { mimeType: 'video/webm' });
    recordedChunks.value = [];
    mediaRecorder.value.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunks.value.push(e.data);
    };
    mediaRecorder.value.onstop = () => {
      const blob = new Blob(recordedChunks.value, { type: 'video/webm' });
      // Always reset both previews so only the latest is shown
      videoPreview.value = null;
      recordingPreview.value = URL.createObjectURL(blob);
      lessonVideo.value = blob;
      isReplacingVideo.value = true;
    };
    mediaRecorder.value.start();
    isRecording.value = true;
  } catch (e) {
    error.value = 'Could not access screen or microphone for recording.';
  }
};

const stopRecording = () => {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop();
    stream.value.getTracks().forEach(track => track.stop());
    isRecording.value = false;
  }
};

const clearPreview = () => {
  videoPreview.value = null;
  recordingPreview.value = null;
  lessonVideo.value = null;
  isReplacingVideo.value = false;
  // Don't clear the original video when in edit mode
};

const route = useRoute();
const router = useRouter();

const lessonTitle = ref("");
const lessonDescription = ref("");
const lessonVideo = ref(null);
const isUploading = ref(false);
const uploadProgress = ref(0);
const error = ref("");

let courseId = route.params.courseId;
const lessonId = route.params.lessonId;
const isEditMode = ref(false);
const isReplacingVideo = ref(false);

const videoPreview = ref(null);
const lessonDetail = ref({
    title: "",
    content: "",
    videoUrl: "",
    duration: 0,
});

const getLessonDetails = async () => {
  if (!lessonId) {
    isEditMode.value = false;
    return;
  }
  
  try {
    isEditMode.value = true;
    const response = await axios.get(`http://localhost:3000/api/courses/${lessonId}/lessons/details`);
    lessonDetail.value = response.data.lesson;
    lessonTitle.value = lessonDetail.value.title;
    lessonDescription.value = lessonDetail.value.content;
    
    // Extract courseId from lesson details if not in route params
    if (!courseId && lessonDetail.value.courseId) {
      courseId = lessonDetail.value.courseId;
      console.log("Extracted courseId from lesson:", courseId);
    }
    console.log(lessonDetail.value);
  } catch (e) {
    console.error("Error fetching lesson details:", e);
    error.value = "Failed to load lesson details";
    isEditMode.value = false;
  }
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Validate file type
    if (!file.type.includes('video/')) {
      error.value = 'Please upload a video file';
      return;
    }
    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      error.value = 'Video must be less than 100MB';
      return;
    }
    lessonVideo.value = file;
    error.value = "";
    isReplacingVideo.value = true;

    // Always reset both previews so only the latest is shown
    recordingPreview.value = null;
    videoPreview.value = null;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      videoPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

onMounted(() => {
  getLessonDetails()
})

const addLesson = async () => {
  try {
    error.value = "";
    isUploading.value = true;

    if (!lessonTitle.value.trim() || !lessonDescription.value.trim()) {
      error.value = "Please fill in all fields";
      return;
    }

    const formData = new FormData();
    formData.append("title", lessonTitle.value.trim());
    formData.append("content", lessonDescription.value.trim());
    
    if (lessonVideo.value) {
      formData.append("video", lessonVideo.value);
    }

    let response;
    
    if (isEditMode.value && lessonId && courseId) {
      // Update existing lesson
      response = await axios.put(
        `http://localhost:3000/api/${courseId}/lessons/${lessonId}`,
        formData,
        {
          headers: { 
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: (progressEvent) => {
            uploadProgress.value = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
          },
        }
      );
      console.log('Update response:', response.data);
      alert('Lesson updated successfully!');
    } else {
      // Create new lesson
      response = await axios.post(
        `http://localhost:3000/api/courses/${courseId}/lessons`,
        formData,
        {
          headers: { 
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: (progressEvent) => {
            uploadProgress.value = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
          },
        }
      );
      console.log('Create response:', response.data);
      alert('Lesson added successfully!');
    }
    
    // Reset form
    lessonTitle.value = "";
    lessonDescription.value = "";
    lessonVideo.value = null;
    videoPreview.value = null;
    recordingPreview.value = null;
    isReplacingVideo.value = false;
    
    // Navigate back to lesson list
    router.push(`/instructor/course/view-lessons/${courseId}`);
  } catch (e) {
    console.error('Upload error:', e);
    error.value = e.response?.data?.message || "Failed to save lesson";
  } finally {
    isUploading.value = false;
    uploadProgress.value = 0;
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6">{{ isEditMode ? 'Edit Lesson' : 'Add New Lesson' }}</h2>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- Upload Form -->
    <form @submit.prevent="addLesson" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Lesson Title</label>
        <input
          v-model="lessonTitle"
          type="text"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter lesson title"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Lesson Description</label>
        <textarea
          v-model="lessonDescription"
          required
          rows="4"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter lesson description"
        ></textarea>
      </div>
<!-- 
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Video</label>
        <input
          type="file"
          accept="video/*"
          @change="handleFileChange"
          class="w-full"
        />
        <p class="text-sm text-gray-500 mt-1">Maximum file size: 100MB</p>
      </div> -->

       <div class="space-y-4">
        <label class="block text-sm font-medium text-gray-700">Lesson Video</label>
        <div class="flex flex-col md:flex-row gap-6">
          <div class="flex-1 space-y-2">
            <div class="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-500 transition-colors bg-gray-50 hover:bg-green-50 group text-center cursor-pointer mb-2">
              <input
                accept="video/*"
                type="file"
                @change="handleFileChange"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div class="space-y-2">
                <div class="mx-auto h-12 w-12 text-gray-400 group-hover:text-green-500 transition-colors">
                  <i class="fa-solid fa-video text-4xl"></i>
                </div>
                <div class="text-sm text-gray-600">
                  <span class="font-medium text-green-600 hover:text-green-500">Upload a video</span>
                  or drag and drop
                </div>
                <p class="text-xs text-gray-500">MP4, WebM up to 100MB</p>
              </div>
            </div>
            <div class="flex gap-2">
              <button type="button" @click="startRecording" :disabled="isRecording" class="bg-green-600 text-white px-3 py-1 rounded disabled:bg-gray-400">Start Recording</button>
              <button type="button" @click="stopRecording" :disabled="!isRecording" class="bg-red-600 text-white px-3 py-1 rounded disabled:bg-gray-400">Stop Recording</button>
              <button type="button" @click="clearPreview" v-if="recordingPreview || videoPreview || (isEditMode && lessonDetail.videoUrl && !isReplacingVideo)" class="bg-gray-500 text-white px-3 py-1 rounded">Clear Preview</button>
              <span v-if="isRecording" class="text-red-600 font-semibold ml-2">● Recording...</span>
            </div>
          </div>
          <!-- Video Preview -->
          <div class="flex-1">
            <div class="relative aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
              <video
                v-if="recordingPreview || videoPreview || (isEditMode && lessonDetail.videoUrl && !isReplacingVideo)"
                class="w-full h-full object-cover"
                controls
              >
                <source
                  v-if="recordingPreview"
                  :src="recordingPreview"
                  type="video/webm"
                />
                <source
                  v-else-if="videoPreview"
                  :src="videoPreview"
                  type="video/mp4"
                />
                <source
                  v-else-if="isEditMode && lessonDetail.videoUrl && !isReplacingVideo"
                  :src="lessonDetail.videoUrl"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <div v-else class="text-center p-4 text-gray-400">
                <i class="fa-solid fa-video text-3xl mb-2"></i>
                <p class="text-sm">Video preview will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Upload Progress -->
      <div v-if="uploadProgress > 0 && isUploading" class="mt-4">
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div
            class="bg-blue-600 h-2.5 rounded-full"
            :style="{ width: `${uploadProgress}%` }"
          ></div>
        </div>
        <p class="text-sm text-gray-600 mt-1">Uploading: {{ uploadProgress }}%</p>
      </div>

      <button
        type="submit"
        :disabled="isUploading"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
      >
        {{ isUploading ? 'Saving...' : (isEditMode ? 'Update Lesson' : 'Add Lesson') }}
      </button>
    </form>
  </div>
</template>
