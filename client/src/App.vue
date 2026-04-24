<script setup>
import { useRoute } from 'vue-router';
import { onMounted, onUnmounted, ref } from 'vue';
import { useAuthStore } from './stores/auth.store';
import { useNotificationStore } from './stores/notification.store';

const route = useRoute();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue';

import { RouterView } from 'vue-router';
import ChatbotTab from './components/ChatbotTab.vue';
import OverviewPage from './pages/admin/OverviewPage.vue';
import ConfirmationDialog from './components/ConfirmationDialog.vue';


onMounted(async () => {
  await authStore.loadUser();
  if (authStore.user) {
    notificationStore.initSocket();
  }
});

onUnmounted(() => {
  notificationStore.disconnectSocket();
});
const isOpen = ref(false)
const openChatbot = function () {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <Navbar v-if="!route.meta.hideNavbar" />

  <RouterView></RouterView>



  <div v-if="route.meta.showChatbot" class="fixed z-2000 bottom-15 right-10  flex flex-col items-end">

    <ChatbotTab />

  </div>

  <Footer v-if="!route.meta.hideFooter" />

</template>

<style lang="css" scoped></style>