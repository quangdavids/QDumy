<script setup>
import { ref } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
const showMore = ref(false);

const toggleMore = () => {
  showMore.value = !showMore.value;
};

const lecturerInfo = ref({
  fullName: "",
  email: "",
  jobTitle: "",
  description: "",
  facebook: "",
  linkedIn: "",
  Xlink: "",
  personalLink: "",
});
const error = ref("")
const imagePreview = ref("")
const isReplacingImage = ref(false)
const profilePic = ref(null)


const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Validate file type
    if (!file.type.includes('image/')) {
      error.value = 'Please upload a image file';
      return;
    }
    // Validate file size (max 100MB)
    if (file.size > 5 * 1024 * 1024) {
      error.value = 'Image must be less than 5MB';
      return;
    }
    profilePic.value = file;
    error.value = "";
    isReplacingImage.value = true;

    // Always reset both previews so only the latest is shown
    imagePreview.value = null;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const editLecturerInfo = async () => {
  try {
    const formData = new FormData()

    formData.append("fullName", lecturerInfo.value.fullName)
    formData.append("email", lecturerInfo.value.email)
    formData.append("jobTitle", lecturerInfo.value.jobTitle)
    formData.append("description", lecturerInfo.value.description)
    
  } catch (err) {
    console.log(err)
  }
}
</script>

<template>
  <div class="py-2 px-4">
    <div class="px-5 ml-4 py-4">
      <p class="font-bold text-[20px]">Edit Lecturer Info</p>
      <p class="text-gray-500 font-semibold mt-2">Update your personal info</p>
    </div>

    <div class="max-w-full p-4 rounded-lg ml-4 outline-1 outline-gray-300">
      <div class="font-bold p-2 text-lg">Personal Information</div>

      <div class="bg-gray-100 py-4 px-3 rounded-lg">
        <div class="w-full p-2 rounded-lg gap-3 flex items-center">
          <div class="p-3">
            <img
              :src="imagePreview"
              class="w-25 h-25 rounded-full"
            />
          </div>
          <div>
            <p class="font-bold text-lg">Profile Picture</p>
            <p class="font-semibold text-gray-400 text-sm tracking-wide">
              JPG, PNG or JPEG. Maximum 5MB
            </p>
          </div>
        </div>
        {{ error }}
        <div class="max-w-full flex gap-2">
          <input
            id="profilePicInput"
            class="hidden"
            @change="handleFileChange"
            accept="image/*"
            type="file"
            >
          <label
            for="profilePicInput"
            class="bg-green-500 font-semibold p-3 w-full rounded-lg text-white cursor-pointer text-center"
          >
            Change Photo
          </label>
          <button
            class="bg-gray-50 font-semibold p-3 w-full cursor-pointer rounded-lg outline-1 outline-gray-300"
          >
            Remove
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 items-center mt-6 gap-7">
        <div class="flex flex-col gap-2">
          <label for="fullname" class="font-bold"> Full Name</label>
          <input
            type="text"
            v-model="lecturerInfo.fullName"
            class="outline-1 rounded-lg outline-gray-300 p-2 bg-gray-100"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="email" class="font-bold"> Email Address</label>
          <input
            type="text"
            class="outline-1 rounded-lg outline-gray-300 p-2 bg-gray-100"
          />
        </div>
      </div>

      <div class="flex flex-col gap-2 w-full mt-2">
        <label for="Job title" class="font-bold"> Job Title</label>
        <input
          type="text"
          class="outline-1 rounded-lg outline-gray-300 p-2 bg-gray-100"
        />
      </div>
    </div>

    <div class="max-w-full p-4 rounded-lg ml-4 outline-1 outline-gray-300 mt-7">
      <div class="font-semibold text-lg py-2">Detailed Description</div>
      <QuillEditor
        theme="snow"
        content-type="html"
        v-model="lecturerInfo.description"
        toolbar="full"
        style="min-height: 200px; border-radius: 5px; background-color: #faf9f5"
      />
    </div>

    <div class="flex h-auto items-start">
      <div
        class="p-4 rounded-lg w-full flex flex-col gap-2 ml-4 outline-1 outline-gray-300 mt-7"
      >
        <div class="text-lg font-bold">Social Links</div>

        <div
          class="p-3 w-full mt-2 bg-gray-100 rounded-lg flex items-center gap-4 outline-1 outline-gray-200"
        >
          <i class="fa-brands fa-facebook text-[30px] text-blue-600"></i>
          <input
            type="text"
            v-model="lecturerInfo.facebook"
            class="outline-1 outline-gray-200 rounded-lg hover:outline-gray-400 w-full py-2 px-2"
          />
        </div>

        <div
          class="p-3 w-full mt-2 bg-gray-100 rounded-lg flex items-center gap-4 outline-1 outline-gray-200"
        >
          <i class="fa-brands fa-linkedin text-[30px] text-blue-700"></i>
          <input
            type="text"
             v-model="lecturerInfo.linkedIn"
            class="outline-1 outline-gray-200 rounded-lg hover:outline-gray-400 w-full py-2 px-2"
          />
        </div>

        <div
          class="p-3 w-full mt-2 bg-gray-100 rounded-lg flex items-center gap-4 outline-1 outline-gray-200"
        >
          <i class="fa-brands fa-x-twitter text-[30px]"></i>
          <input
            type="text"
             v-model="lecturerInfo.Xlink"
            class="outline-1 outline-gray-200 rounded-lg hover:outline-gray-400 w-full py-2 px-2"
          />
        </div>

        <div
          class="p-3 w-full mt-2 bg-gray-100 rounded-lg flex items-center gap-4 outline-1 outline-gray-200"
        >
          <i class="fa-solid fa-link text-[30px] text-green-600"></i>
          <input
            type="text"
             v-model="lecturerInfo.personalLink"
            class="outline-1 outline-gray-200 rounded-lg hover:outline-gray-400 w-full py-2 px-2"
          />
        </div>
      </div>

      <div
        class="p-4 rounded-lg w-full h-auto flex flex-col gap-2 ml-4 outline-1 outline-gray-300 mt-7"
      >
        <div class="flex justify-between items-center">
          <div class="text-lg font-bold">Qualifications & Certifications</div>
          <div
            class="text-sm hover:text-green-400 cursor-pointer text-gray-400 font-semibold"
          >
            Add new
          </div>
        </div>

        <div
          class="p-3 w-full mt-2 bg-gray-100 rounded-lg flex items-center gap-4 outline-1 outline-gray-200"
        >
          <div class="p-3 rounded-lg bg-green-200">
            <i class="fa fa-graduation-cap text-[20px] text-green-700"></i>
          </div>

          <div class="flex flex-col">
            <div class="font-bold text-sm">Oh where do we begin</div>
            <div class="font-semibold text-gray-400 text-sm tracking-wide">
              Greenwich Uni 2022-2026
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end p-3">
      <button
        class="px-5 py-3 flex gap-4 items-center hover:border-green-500 hover:text-green-500 hover:bg-white hover:border-1 cursor-pointer duration-300 rounded-lg bg-green-500 shadow-md text-white"
      >
        <i class="fa fa-save"></i>
        Save Changes
      </button>
    </div>
  </div>
</template>

<style lang="css" scoped>
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