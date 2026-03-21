import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./auth.store";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    notifications: [],
    unreadCount: 0,
  }),
  getters: {},
  actions: {
    async fetchNotfications() {
      try {
        const authStore = useAuthStore();
        const response = await axios.get(
          `http://localhost:3000/api/notification/${authStore.user._id}`,
        );
        this.notifications = response.data.notification;
        this.unreadCount = this.notifications.filter((n) => !n.isRead).length;
        console.log(this.unreadCount);
      } catch (err) {
        console.log(err);
      }
    },
    async fetchLecturerNotifications() {
      try {
        const authStore = useAuthStore();
        const response = await axios.get(
          `http://localhost:3000/api/notification/lecturer/${authStore.user._id}`,
        );
        this.notifications = response.data.notification;
        this.unreadCount = this.notifications.filter((n) => !n.isRead).length;
        console.log(this.unreadCount);
      } catch (err) {
        console.log(err);
      }
    },
    async readNotification(notificationId) {
      try {
        const response = await axios.put(
          `http://localhost:3000/api/notification/read/${notificationId}`,
        );
        console.log(response.data);
      
      } catch (err) {
        console.log(err);
      }
    },

    async deleteNotification(notificationId) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/api/notification/${notificationId}`,
        );
        console.log(response.data);
        this.fetchNotfications();
      } catch (err) {
        console.log(err);
      }
    },
  },
});
