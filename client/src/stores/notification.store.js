import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./auth.store";
import { io } from "socket.io-client";
export const useNotificationStore = defineStore("notification", {
  state: () => ({
    notifications: [],
    unreadCount: 0,
    socket: null,
    isConnected: false,
  }),
  getters: {},
  actions: {
    initSocket() {
      if (this.socket) return;
      
      const authStore = useAuthStore();
      if (!authStore.user) return;

      this.socket = io("${apiUrl}", {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        transports: ["websocket"],
      });

      this.socket.on('connect', () => {
        console.log('Socket connected');
        this.isConnected = true;
        // Join user's notification room
        this.socket.emit('join-room', authStore.user._id);
        // Fetch notifications after socket is connected
        this.fetchNotfications();
      });

      // Listen for new notifications
      this.socket.on('new-notification', (notification) => {
        // Check if notification already exists to prevent duplicates
        const exists = this.notifications.some((n) => n._id === notification._id);
        if (!exists) {
          this.notifications.unshift(notification);
          this.updateUnreadCount();
          console.log('New notification received:', notification);
        }
      });

      // Listen for read notifications
      this.socket.on('notification-read', (updatedNotification) => {
        const index = this.notifications.findIndex((n) => n._id === updatedNotification._id);
        if (index !== -1) {
          this.notifications[index] = updatedNotification;
          this.updateUnreadCount();
        }
      });

      // Listen for deleted notifications
      this.socket.on('notification-deleted', ({ notificationId }) => {
        this.notifications = this.notifications.filter((n) => n._id !== notificationId);
        this.updateUnreadCount();
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
        this.isConnected = false;
      });
    },

    disconnectSocket() {
      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
        this.isConnected = false;
      }
    },

    updateUnreadCount() {
      this.unreadCount = this.notifications.filter((n) => !n.isRead).length;
    },

    async fetchNotfications() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const authStore = useAuthStore();
        const response = await axios.get(
          `${apiUrl}/api/notification/${authStore.user._id}`,
        );
        this.notifications = response.data.notification;
        this.updateUnreadCount();
        console.log(this.unreadCount);
      } catch (err) {
        console.log(err);
      }
    },
    async fetchLecturerNotifications() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const authStore = useAuthStore();
        const response = await axios.get(
          `${apiUrl}/api/notification/lecturer/${authStore.user._id}`,
        );
        this.notifications = response.data.notification;
        this.updateUnreadCount();
        console.log(this.unreadCount);
      } catch (err) {
        console.log(err);
      }
    },
    async readNotification(notificationId) {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.put(
          `${apiUrl}/api/notification/read/${notificationId}`,
        );
        console.log(response.data);
      } catch (err) {
        console.log(err);
      }
    },

    async deleteNotification(notificationId) {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.delete(
          `${apiUrl}/api/notification/${notificationId}`,
        );
        console.log(response.data);
        this.notifications = this.notifications.filter((n) => n._id !== notificationId);
        this.updateUnreadCount();
      } catch (err) {
        console.log(err);
      }
    },
  },
});
