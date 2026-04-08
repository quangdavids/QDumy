<script setup>
import { ref, onMounted } from "vue";
import CourseCard from "../../components/CourseCard.vue";
import { useAuthStore } from "../../stores/auth.store";
import axios from "axios";
import { storeToRefs } from "pinia";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';


const authStore = useAuthStore();

const { user, token } = storeToRefs(authStore);
const username = ref("");
const email = ref("");
const showMore = ref(false);
const userData = ref({});
const getUserProfile = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/user/info/${user.value._id}`,
    );
    userData.value = response.data.userData;
    username.value = userData.value.username;
    email.value = userData.value.email;
    console.log(userData.value);
  } catch (err) {
    console.log(err);
  }
};
const error = ref("")
const profileImg = ref(null);
const isReplacingImg = ref(false);
const imgPreview = ref();
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Validate file type
    if (!file.type.includes("image/")) {
      error.value = "Please upload a image file";
      return;
    }
    // Validate file size (max 100MB)
    if (file.size > 5 * 1024 * 1024) {
      error.value = "Video must be less than 5MB";
      return;
    }
    profileImg.value = file;
    error.value = "";
    isReplacingImg.value = true;

    // Always reset both previews so only the latest is shown
    imgPreview.value = null;
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      imgPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const editUserProfile = async () => {
  try {
    const formData = new FormData();
    formData.append("username", username.value);
    formData.append("email", email.value);
    console.log(profileImg.value)
    if (profileImg.value) {
      formData.append("profileImg", profileImg.value);
    }
    const response = await axios.put(
      `http://localhost:3000/api/user/edit/${user.value._id}`,
      formData,
      {
        headers: {
          "Authorization": `Bearer ${token.value}`
        },
      }
    );
    console.log(response.data);
    
    // Update the auth store with new user data
    const updatedUserData = response.data.message;
    authStore.user = {
      ...authStore.user,
      username: updatedUserData.username,
      email: updatedUserData.email,
      profileImg: updatedUserData.profileImg
    };
    
    // Save updated user to localStorage
    localStorage.setItem("user", JSON.stringify(authStore.user));
    
    // Update local refs for display
    userData.value = updatedUserData;
    profileImg.value = null;
    imgPreview.value = null;
    
    toast.success("Profile updated successfully", { autoClose: 2000})
    getUserProfile()
  } catch (err) {
    console.log(err);
  }
};
onMounted(getUserProfile);
</script>

<template>
  <div class="min-h-screen">
    <div class="rounded-lg p-3 bg-[#f5f5f5]">
      <div class="p-4">
        <div
          class="flex gap-3 justify-between items-center border-b-1 border-gray-200"
        >
          <div class="p-3 flex items-center gap-2">
            <img
              :src="imgPreview || userData.profileImg"
              class="w-30 h-30 shadow-lg border-gray-200 border-1 rounded-full object-cover"
            />

            <p class="text-sm tracking-wide font-semibold">
              Max storage limit: 5MB. Accept JPG, PNG, JPEG
            </p>
          </div>

          <div class="flex gap-4 p-2">
            <input
              type="file"
              accept="image/*"
              @change="handleFileChange"
              id="profileImg"
              class="hidden"
            />
            <label
              for="profileImg"
              class="p-3 bg-blue-500 rounded-lg text-sm text-white font-semibold hover:bg-white hover:text-blue-500 cursor-pointer hover:outline-blue-500 hover:outline-1 duration-300"
              >Upload Image</label
            >
            <button
              class="p-3 bg-red-500 rounded-lg text-sm text-white font-semibold hover:bg-white hover:text-red-500 cursor-pointer hover:outline-red-500 hover:outline-1 duration-300"
            >
              Remove
            </button>
          </div>
        </div>
        <div v-if="error" class="text-red-500 text-sm ml-4">
          {{ error.value }}
        </div>
      </div>
      <div class="p-4 border-b-1 border-gray-200">
        <form class="flex flex-col gap-4 mb-3">
          <div>
            <label for="username" class="font-semibold"> Your username </label>
            <input
              type="text"
              v-model="username"
              placeholder="Edit your username here"
              class="rounded-md w-full py-2 px-2 mt-2 outline-1 outline-gray-300 bg-white"
            />
          </div>

          <div>
            <label for="email" class="font-semibold"> Email Address </label>
            <input
              type="text"
              v-model="email"
              placeholder="Edit your email here"
              class="rounded-md w-full py-2 px-2 mt-2 outline-1 outline-gray-300 bg-white"
            />
          </div>
        </form>
      </div>

      <div class="p-4">
        <div class="flex justify-end gap-4">
          <button
            class="p-3 bg-red-500 rounded-lg text-sm text-white font-semibold hover:bg-white hover:text-red-500 cursor-pointer hover:outline-red-500 hover:outline-1 duration-300"
          >
            Cancel
          </button>
          <button
            class="p-3 bg-blue-500 rounded-lg text-sm text-white font-semibold hover:bg-white hover:text-blue-500 cursor-pointer hover:outline-blue-500 hover:outline-1 duration-300"
            @click="editUserProfile"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
