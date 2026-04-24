<script setup>
import Banner from "../../components/Banner.vue";
import StudentSidebar from "../../components/StudentSidebar.vue";
import HelpSupport from "../other/HelpSupportPage.vue";
import StudentAnalytics from "./StudentAnalyticsPage.vue";
import { useAuthStore } from "../../stores/auth.store";
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import axios from "axios";
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const route = useRoute();
const id = route.params.userId;
const userInfo = ref();
console.log(id)
const apiUrl = import.meta.env.VITE_API_URL;
const getUserInfo = async () => {
  try {
    if (id) {
      const response = await axios.get(
        `${apiUrl}/api/user/info/${id}`,
      );
      userInfo.value = response.data.userData;
      console.log(userInfo.value);
    } else {
      userInfo.value = user.value;
    }
  } catch (err) {
    console.log(err);
  }
};

onMounted(() => {
  getUserInfo();
});
</script>

<template>
  <div class="min-h-screen container mx-auto">
    <div
      class="max-w-6xl mt-5 rounded-lg h-auto mx-auto max-h-full py-5 bg-green-300"
    >
      <div class="flex mr-auto ml-10 gap-5 p-2">
        <div class="max-w-30">
          <img :src="userInfo?.profileImg" class="rounded-full w-30 h-30 shadow outline-1" />
        </div>
        <div class="flex flex-col gap-2 mb-4">
          <div class="flex gap-3 text-2xl">
            <span class="font-bold max-w-80 mt-10">{{
              userInfo?.username
            }}</span>
            <!-- <i class="fi fi-gh mt-10"></i> -->
          </div>

          <div>Learner</div>
        </div>
      </div>
    </div>

    <div class="flex max-w-6xl mx-auto md:flex-row md:justify-center">
      <StudentSidebar />
      <div class="mx-auto mt-4 w-full rounded-lg">
        <RouterView></RouterView>
      </div>
    </div>
    <!-- <div class="mt-2 flex justify-around">
      <div>
        <i
          class="fa-brands fa-facebook-f border rounded-full w-10 h-10 text-center p-3 hover:text-white cursor-pointer hover:bg-blue-500"
        ></i>
      </div>
      <div>
        <i
          class="fa-brands fa-square-instagram border rounded-full w-10 h-10 text-center p-3"
          style="color: purple"
        ></i>
      </div>
      <div>
        <i
          class="fa-brands fa-github border rounded-full w-10 h-10 text-center p-3"
        ></i>
      </div>
      <div>
        <i
          class="fa-brands fa-linkedin border rounded-full w-10 h-10 text-center p-3"
        ></i>
      </div>
    </div> -->
  </div>
</template>
