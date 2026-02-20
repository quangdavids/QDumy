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
            const authStore = useAuthStore();
            const userId = authStore.user ? authStore.user._id : null;
            const res = await axios.get(`http://localhost:3000/api/cart/items/${userId}`);
            this.courses = res.data.items || [];
       },
       async addCourseToCart(courseId) {
            const authStore = useAuthStore();
            const userId = authStore.user ? authStore.user._id : null;
            const res = await axios.post(`http://localhost:3000/api/cart/add/${courseId}`, { userId });
            this.courses.push(res.data.items[res.data.items.length -1]);
            console.log(res.data);
           
       },
       async removeCourseFromCart(courseId) {
            const authStore = useAuthStore();
            const userId = authStore.user ? authStore.user._id : null;
            const res = await axios.delete(`http://localhost:3000/api/cart/remove/${userId}`, { data: { courseId } });
            this.courses = res.data.items;
       }
    }
})