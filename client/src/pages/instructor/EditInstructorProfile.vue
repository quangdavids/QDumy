<script setup>
import { ref, onMounted } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import { useAuthStore } from "../../stores/auth.store";
import axios from "axios";

const authStore = useAuthStore();
const showMore = ref(false);
const isLoading = ref(false);
const successMessage = ref("");
const error = ref("");
const originalProfilePic = ref("");

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

const imagePreview = ref("");
const isReplacingImage = ref(false);
const profilePic = ref(null);

// Load lecturer data on mount
onMounted(async () => {
  try {
    isLoading.value = true;
    const userId = authStore.user?._id;
    
    if (!userId) {
      error.value = "User not authenticated";
      return;
    }

    const response = await axios.get(
      `http://localhost:3000/api/lecturer-data/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    if (response.data.lecturer) {
      const lecturer = response.data.lecturer;
      lecturerInfo.value = {
        fullName: lecturer.lecturerName || "",
        email: lecturer.email || "",
        jobTitle: lecturer.jobTitle || "Instructor at QDumy",
        description: lecturer.biography || "",
        facebook: lecturer.socialLinks?.facebook || "",
        linkedIn: lecturer.socialLinks?.linkedin || "",
        Xlink: lecturer.socialLinks?.twitter || "",
        personalLink: lecturer.socialLinks?.link || "",
      };
      originalProfilePic.value = lecturer.profilePic || "";
      imagePreview.value = lecturer.profilePic || "";
    }
  } catch (err) {
    console.error("Failed to load lecturer data:", err);
    error.value = "Failed to load profile data";
  } finally {
    isLoading.value = false;
  }
});

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Validate file type
    if (!file.type.includes("image/")) {
      error.value = "Please upload an image file";
      return;
    }
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      error.value = "Image must be less than 5MB";
      return;
    }
    profilePic.value = file;
    error.value = "";
    isReplacingImage.value = true;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const removeProfilePic = () => {
  profilePic.value = null;
  imagePreview.value = originalProfilePic.value;
  isReplacingImage.value = false;
};

const editLecturerInfo = async () => {
  try {
    error.value = "";
    successMessage.value = "";
    isLoading.value = true;

    const userId = authStore.user?._id;
    if (!userId) {
      error.value = "User not authenticated";
      return;
    }

    const formData = new FormData();
    formData.append("lecturerName", lecturerInfo.value.fullName);
    formData.append("email", lecturerInfo.value.email);
    formData.append("jobTitle", lecturerInfo.value.jobTitle);
    formData.append("biography", lecturerInfo.value.description);
    formData.append("facebook", lecturerInfo.value.facebook);
    formData.append("linkedin", lecturerInfo.value.linkedIn);
    formData.append("twitter", lecturerInfo.value.Xlink);
    formData.append("personalLink", lecturerInfo.value.personalLink);

    if (profilePic.value) {
      formData.append("profilePic", profilePic.value);
    }

    const response = await axios.put(
      `http://localhost:3000/lecturer/${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    if (response.data) {
      successMessage.value = "Profile updated successfully!";
      profilePic.value = null;
      isReplacingImage.value = false;
      
      // Refresh the original profile pic
      if (response.data.lecturer?.profilePic) {
        originalProfilePic.value = response.data.lecturer.profilePic;
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        successMessage.value = "";
      }, 3000);
    }
  } catch (err) {
    console.error("Failed to update profile:", err);
    error.value =
      err.response?.data?.message || "Failed to update profile. Please try again.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="py-2 px-4">
    <div class="px-5 ml-4 py-4">
      <p class="font-bold text-[20px]">Edit Lecturer Info</p>
      <p class="text-gray-500 font-semibold mt-2">Update your personal info</p>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="ml-4 mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
      {{ successMessage }}
    </div>

    <!-- Error Message -->
    <div v-if="error" class="ml-4 mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
      {{ error }}
    </div>

    <div class="max-w-full p-4 rounded-lg ml-4 outline-1 outline-gray-300">
      <div class="font-bold p-2 text-lg">Personal Information</div>

      <div class="bg-gray-100 py-4 px-3 rounded-lg">
        <div class="w-full p-2 rounded-lg gap-3 flex items-center">
          <div class="p-3">
            <img
              :src="imagePreview || 'https://media.istockphoto.com/id/469962702/photo/blonde-teacher-smiling-in-front-of-blurred-class-background.jpg?s=612x612&w=0&k=20&c=ZyXhvpHtlRnuecENnacaHgu4pOuE-Zg-U_LftX0P1CU='"
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
        <div class="max-w-full flex gap-2">
          <input
            id="profilePicInput"
            class="hidden"
            @change="handleFileChange"
            accept="image/*"
            type="file"
          />
          <label
            for="profilePicInput"
            class="bg-green-500 font-semibold p-3 w-full rounded-lg text-white cursor-pointer text-center"
          >
            Change Photo
          </label>
          <button
            @click="removeProfilePic"
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
            type="email"
            v-model="lecturerInfo.email"
            class="outline-1 rounded-lg outline-gray-300 p-2 bg-gray-100"
          />
        </div>
      </div>

      <div class="flex flex-col gap-2 w-full mt-2">
        <label for="jobTitle" class="font-bold"> Job Title</label>
        <input
          type="text"
          v-model="lecturerInfo.jobTitle"
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
            placeholder="Facebook profile URL"
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
            placeholder="LinkedIn profile URL"
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
            placeholder="Twitter profile URL"
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
            placeholder="Personal website URL"
            class="outline-1 outline-gray-200 rounded-lg hover:outline-gray-400 w-full py-2 px-2"
          />
        </div>
      </div>
    </div>

    <div class="flex justify-end p-3">
      <button
        @click="editLecturerInfo"
        :disabled="isLoading"
        class="px-5 py-3 flex gap-4 items-center hover:border-green-500 hover:text-green-500 hover:bg-white hover:border-1 cursor-pointer duration-300 rounded-lg bg-green-500 shadow-md text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i :class="isLoading ? 'fa fa-spinner fa-spin' : 'fa fa-save'"></i>
        {{ isLoading ? "Saving..." : "Save Changes" }}
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