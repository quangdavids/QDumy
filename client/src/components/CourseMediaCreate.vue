<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({ modelValue: Object });
const emit = defineEmits(["update:modelValue"]);

// Initialize with existing media
const newImage = ref(props.modelValue?.courseImage || "");
const newVideo = ref(
  props.modelValue?.promotionalVideo
    ? {
        url: props.modelValue.promotionalVideo,
        type: "video/mp4", // Default type for existing videos
      }
    : ""
);

const clearVideoPreview = () => {
  newVideo.value = "";
  // Also clear the file in modelValue
  emit("update:modelValue", { ...props.modelValue, promotionalVideo: null });
};

const previewFiles = function (event, mediaType) {
  const file = event.target.files[0];
  if (!file) return;

  const updatedData = { ...props.modelValue };

  // Store both the File object and the existing URL
  if (mediaType === "image") {
    updatedData.courseImage = file;
    updatedData.existingImage = props.modelValue.courseImage;
  } else if (mediaType === "video") {
    updatedData.promotionalVideo = file;
    updatedData.existingVideo = props.modelValue.promotionalVideo;
    newVideo.value = ""; // Clear preview before setting new
  }

  emit("update:modelValue", updatedData);

  // Preview logic
  const theReader = new FileReader();
  theReader.onload = (e) => {
    if (mediaType === "image") {
      newImage.value = e.target.result;
    } else if (mediaType === "video") {
      newVideo.value = {
        url: e.target.result,
        type: file.type,
      };
    }
  };
  theReader.readAsDataURL(file);
};
</script>

<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Course Media</h2>
      <p class="mt-1 text-sm text-gray-500">Upload a thumbnail and an introductory video for your course.</p>
    </div>

    <!-- Thumbnail Upload -->
    <div class="space-y-4">
      <label class="block text-sm font-medium text-gray-700">Course Thumbnail</label>
      <div class="flex flex-col md:flex-row gap-6">
        <div class="flex-1">
          <div class="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-500 transition-colors bg-gray-50 hover:bg-green-50 group text-center cursor-pointer">
            <input
              accept="image/*"
              type="file"
              @change="previewFiles($event, 'image')"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div class="space-y-2">
              <div class="mx-auto h-12 w-12 text-gray-400 group-hover:text-green-500 transition-colors">
                <i class="fa-regular fa-image text-4xl"></i>
              </div>
              <div class="text-sm text-gray-600">
                <span class="font-medium text-green-600 hover:text-green-500">Upload a file</span>
                or drag and drop
              </div>
              <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>

        <!-- Image Preview -->
        <div class="flex-1">
          <div class="relative aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
            <img
              v-if="newImage"
              :src="typeof newImage === 'string' ? newImage : newImage.url"
              class="w-full h-full object-cover"
              alt="Course Thumbnail"
            />
            <div v-else class="text-center p-4 text-gray-400">
              <i class="fa-solid fa-image text-3xl mb-2"></i>
              <p class="text-sm">Preview will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Video Upload -->
    <div class="space-y-4">
      <label class="block text-sm font-medium text-gray-700">Promotional Video</label>
      <div class="flex flex-col md:flex-row gap-6">
        <div class="flex-1">
          <div class="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-500 transition-colors bg-gray-50 hover:bg-green-50 group text-center cursor-pointer">
            <input
              accept="video/*"
              type="file"
              @change="previewFiles($event, 'video')"
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
        </div>

        <!-- Video Preview -->
        <div class="flex-1">
          <div class="relative aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
            <video
              v-if="newVideo"
              class="w-full h-full object-cover"
              controls
            >
              <source
                :src="typeof newVideo === 'object' ? newVideo.url : newVideo"
                :type="newVideo.type || 'video/mp4'"
              />
              Your browser does not support the video tag.
            </video>
            <div v-else class="text-center p-4 text-gray-400">
              <i class="fa-solid fa-video text-3xl mb-2"></i>
              <p class="text-sm">Video preview will appear here</p>
            </div>
            <button v-if="newVideo" @click="clearVideoPreview" type="button" class="absolute top-2 right-2 bg-gray-700 text-white rounded px-2 py-1 text-xs">Clear Preview</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type="file"]::file-selector-button {
  background-color: rgb(40, 194, 119);
  padding: 10px;
  border-bottom-left-radius: 8px;
  border-top-left-radius: 8px;
  color: white;
  font-weight: 400;
  transition: 0.3s;
  cursor: pointer;
}

input[type="file"]::file-selector-button:hover {
  background-color: black;
}
</style>
