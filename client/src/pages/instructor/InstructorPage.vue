<script setup>
import { RouterLink, RouterView, useRoute } from "vue-router";
import { onMounted, ref, computed } from "vue";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import InstructorSidebar from "../../components/InstructorSidebar.vue";
import { useNotificationStore } from "../../stores/notification.store";
import { storeToRefs } from "pinia";
import axios from "axios";
import { useAuthStore } from "../../stores/auth.store";

const notificationStore = useNotificationStore();
const { notifications, unreadCount } = storeToRefs(notificationStore);
const route = useRoute();
const isActive = (path) => route.path === path;
console.log(route.path);
const unread = computed(() => unreadCount.value || 0);
const isOpen = ref(false);

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const lecturerData = ref("");
const apiUrl = import.meta.env.VITE_API_URL;
const getLecturer = async () => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/lecturer-data/${user.value._id}`,
    );
    lecturerData.value = response.data.lecturer;
    console.log(response.data);
    console.log(lecturerData.value);
  } catch (err) {
    console.log(err);
  }
};

onMounted(() => {
    getLecturer();
    if (!notificationStore.isConnected) {
    // Fallback: fetch if socket isn't connected within a timeout
    setTimeout(() => {
      if (!notificationStore.isConnected) {
        notificationStore.fetchLecturerNotifications()
      }
    }, 2000);
  }
});
</script>

<template>
  <div class="min-h-screen container max-w-screen overflow-x-hidden">
    <div class="flex w-screen">
      <InstructorSidebar v-if="!route.meta.hideSidebar" />
      <div class="mx-auto container">
        <div class="px-2">
          <div class="flex justify-between mb-2">
            <div class="p-3 border-b-gray-200 w-full relative border-b-1">
              <input
                type="text"
                class="w-60 p-2 text-sm rounded-md bg-gray-100"
                placeholder="Global search"
              />
            </div>

            <div class="flex self-center gap-3 py-2 px-5">
              <div
                class="flex items-center justify-center w-16 h-12 rounded-full cursor-pointer duration-200 hover:text-green-500"
              >
                <Menu as="div" class="relative z-1000">
                  <MenuButton
                    class="flex gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <div>
                      <i class="fa-solid fa-bell  text-lg"></i>
                      <span
                        v-if="unreadCount > 0"
                        class="absolute -top-4 -right-5 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-semibold"
                      >
                        {{ unread }}
                      </span>
                    </div>
                  </MenuButton>

                  <!-- Dropdown Menu -->
                  <transition-group
                    enter-active-class="transition ease-out duration-100"
                    enter-from-class="transform opacity-0 scale-95"
                    enter-to-class="transform opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-75"
                    leave-from-class="transform opacity-100 scale-100"
                    leave-to-class="transform opacity-0 scale-95"
                  >
                    <MenuItems
                      class="absolute bg-white text-black -right-20 mt-2 w-90 rounded-lg shadow-lg border divide-y divide-gray-100 overflow-hidden"
                    >
                      <p
                        class="text-lg font-bold p-2 border-b-1 border-slate-200"
                      >
                        Notifications
                      </p>
                      <div>
                        <MenuItem
                          v-if="notifications.length > 0"
                          v-for="notification in notifications"
                          :key="notification._id"
                          v-slot="{ active }"
                        >
                          <RouterLink :to="notification.link">
                            <div
                              @click="
                                notificationStore.readNotification(
                                  notification._id,
                                )
                              "
                              :class="
                                notification.isRead
                                  ? `border-b-1 w-full bg-slate-100 border-gray-400 p-6  flex justify-between items-center gap-3 `
                                  : `border-b-1 w-full hover:bg-slate-100 border-gray-400 p-6 items-center flex justify-between gap-3`
                              "
                            >
                              <div class="p-2 rounded-full">
                                <i
                                  class="fa-solid fa-bell text-xl text-green-600"
                                ></i>
                              </div>
                              <div class="text-sm w-full">
                                {{ notification.message }}
                              </div>

                              <div
                                class="flex items-start"
                                @click="
                                  notificationStore.deleteNotification(
                                    notification._id,
                                  )
                                "
                              >
                                <i
                                  class="fa fa-x text-md hover:text-red-500 duration-200 cursor-pointer"
                                ></i>
                              </div>
                            </div>
                          </RouterLink>
                        </MenuItem>

                        <MenuItem class="py-5 px-4" v-else>
                          <div class="flex justify-center text-sm">
                            You have no notifications
                          </div>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </transition-group>
                </Menu>
              </div>
              <img
                :src="lecturerData.profilePic || 'https://media.istockphoto.com/id/469962702/photo/blonde-teacher-smiling-in-front-of-blurred-class-background.jpg?s=612x612&w=0&k=20&c=ZyXhvpHtlRnuecENnacaHgu4pOuE-Zg-U_LftX0P1CU='"
                class="w-12 h-12 rounded-full"
              />
            </div>
          </div>
        </div>
        <RouterView></RouterView>
      </div>
    </div>
  </div>
</template>
