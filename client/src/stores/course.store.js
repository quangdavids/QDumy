import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useCourseStore = defineStore("course", {
  state: () => ({
   
    title: "",
    introduction: "",
    description: "",
    requirements: [],
    learningQualities: [],
    level: "",
    price: 0,
    lessons: [],
    
  }),
  persist: true,
  getters: {},
  actions: {
    getTitles(title, description) {
      this.title = title,
      this.description = description
    },

    buildFormData() {
        const formData = new FormData();

        formData.append("title", this.title)
        formData.append('description', this.description)
        formData.append('introduction', this.introduction)
        formData.append('price', this.price)
        formData.append('level', this.level)

        this.requirements.forEach((req, index) => {
          formData.append(`requirements[${index}]`, req)
        })

        this.learningQualities.forEach((quality, index) => {
          formData.append(`learningQualities[${index}]`, quality)
        })

        
    },

    loadCourseData() {
      console.log(this.course)
    },

    async createCourse() {
      try {
        const data = { ...this.course }
        console.log(data)
        const response = await axios.post(
          "http://localhost:3000/api/courses/",
          data,
          // {
          //   headers: {
          //     "Content-Type": "multipart/form-data",
          //   },
          // }
        );

        console.log(response.data);
      } catch (e) {
        console.log(e);
      }
    },
  },
});
