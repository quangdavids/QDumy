import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./auth.store";
// const authStore = useAuthStore();
// const userId = authStore.user ? authStore.user._id : null;


export const useCartStore = defineStore("cart", {
    state:() => ({
        courses:  [],
    }),
  
    actions: {
       async fetchCourses() {
          const apiUrl = import.meta.env.VITE_API_URL;
            const authStore = useAuthStore();
            const userId = authStore.user ? authStore.user._id : null;
            const res = await axios.get(`${apiUrl}/api/cart/items/${userId}`);
            this.courses = res.data.items || [];
       },
       async addCourseToCart(courseId) {
          const apiUrl = import.meta.env.VITE_API_URL;
            const authStore = useAuthStore();
            const userId = authStore.user ? authStore.user._id : null;
            const res = await axios.post(`${apiUrl}/api/cart/add/${courseId}`, { userId });
            this.courses.push(res.data.items[res.data.items.length - 1]);
            console.log(res.data);
           
       },
       async removeCourseFromCart(courseId) {
          const apiUrl = import.meta.env.VITE_API_URL;
            const authStore = useAuthStore();
            const userId = authStore.user ? authStore.user._id : null;
            const res = await axios.delete(`${apiUrl}/api/cart/remove/${userId}`, { data: { courseId } });
            this.courses = res.data.items;
       }
    }
})