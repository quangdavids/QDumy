<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "../../stores/auth.store";
import { storeToRefs } from "pinia";
import { Pie, Doughnut, Bar, Line } from "vue-chartjs";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
);
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const apiUrl = import.meta.env.VITE_API_URL;
const completedCourse = ref(0);
const ongoingCourse = ref(0);
const totalCourses = ref(0);
const donutData = ref({
  labels: [],
  datasets: [],
});

const barData = ref({
  labels: [],
  datasets: [],
});

const getAnalyticData = async () => {
  const response = await axios.get(
    `${apiUrl}/api/user/analytic/${user.value._id}`,
  );

  console.log(response);
  ongoingCourse.value = response.data.ongoing;
  completedCourse.value = response.data.completed;
  totalCourses.value = response.data.courseNumber;

  donutData.value = {
    labels: ["Ongoing", "Completed"],
    datasets: [
      {
        backgroundColor: ["green", "yellow"],
        data: [ongoingCourse.value, completedCourse.value],
      },
    ],
  };
};

const completed = ref(0);
const remaining = ref(0);
const progress = ref("");
const getCompletedAndRemainingLessonsData = async () => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/user/lesson-comparison/${user.value._id}`,
    );
    progress.value = response.data;
    completed.value = response.data.completed;
    remaining.value = response.data.remaining;
    console.log(response.data);

    barData.value = {
    labels: response.data.progress.map(item => item.courseTitle),
    datasets: [
      {
        label: "Completed",
        data: response.data.progress.map(item => item.completed),
        backgroundColor: "#22C55E",
        borderRadius: 2
      },
      {
        label: "Remaining",
        data: response.data.progress.map(item => item.remaining),
        backgroundColor: "#E5E7EB",
        borderRadius: 2
      }
    ]
    }
  } catch (error) {
    console.log(error);
  }
};

const lineData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Platform Access Time",
      backgroundColor: "green",
      data: [12, 4, 7, 6, 3, 4, 5, 8, 3],
      tension: 0.4,
    },
  ],
};

const barOptions = {
 
  indexAxis: 'y', 
  
  responsive: true,
  maintainAspectRatio: false,
  
  
  scales: {
    x: {
      beginAtZero: true,
      grid: {
        display: true, // Often helpful to have vertical lines for horizontal bars
      },
      title: {
        display: true,
        text: 'Total Value'
      },
      stacked: true
    },
    y: {
      grid: {
        display: true
      },
      stacked: true
    }
  },


  plugins: {
    legend: {
      display: false 
    }
  }
};
const options = {
  responsive: true,
  maintainAspectRatio: false, // Change to false to allow custom dimensions
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        boxWidth: 12,
        padding: 15,
        font: {
          size: 12,
        },
      },
    },
  },
};
onMounted(() => {
  (getAnalyticData(), getCompletedAndRemainingLessonsData());
});
</script>

<template>
  <div class="min-h-screen overflow-x-hidden">
    <div class="max-w-full">
      <p class="p-3 font-bold text-xl">
        Welcome back, Quang! What are you eager to learn today?
      </p>

      <div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 p-3">
        <div
          class="relative border-l-blue-500 border-l-4 rounded-lg flex-1 shrink bg-[#ececec] p-3 h-35 flex flex-col gap-4"
        >
          <span class="font-bold text-lg"> Course enrolled </span>
          <span class="text-[30px]">
            {{ totalCourses }}
          </span>
          <span class="absolute right-5 bottom-7">
            <img src="/images/online-course.svg" class="w-15 h-15" />
          </span>
        </div>

        <div
          class="relative rounded-lg flex-1 border-l-green-500 border-l-4 bg-[#ececec] p-3 h-auto flex flex-col gap-4"
        >
          <span class="font-bold text-lg"> Completed Course </span>
          <span class="text-[30px]">
            {{ completedCourse }}
          </span>
          <span class="absolute right-5 bottom-7">
            <img src="/images/course-1.webp" class="w-15 h-15" />
          </span>
        </div>

        <div
          class="relative rounded-lg flex-1 bg-[#ececec] border-l-red-500 border-l-4 p-3 h-35 flex flex-col gap-4"
        >
          <span class="font-bold text-lg"> Total hours studying</span>
          <span class="text-[30px]"> 34 hrs </span>
          <span class="absolute right-5 bottom-7">
            <img src="/images/course-1.webp" class="w-15 h-15" />
          </span>
        </div>
      </div>

      <!-- <div class="p-2  ">
                <span class="font-bold text-lg p-3 mt-2"> Continue Watching </span>
                <div class="shadow-md rounded-lg   max-h-[360px] ml-2 p-3">
                    <div class="flex justify-between">
                        <div class="p-4 flex flex-col gap-2">
                            <p class="text-2xl font-bold"> Learn Java from Beginning To Advanced </p>
                            <p class="text-md "> Lecturer: Akulay Fofana</p>
                             <p class="text-md "> Updated: 20/10/2019 - 110 Lectures - Beginner</p>
                            <button class="bg-green-500 mt-auto p-4 rounded-full  w-30 "> Continue </button>

                        </div>
                        <div class="max-w-[291px] max-h-[286px]">
                            <img src="/images/students/ebony4.jpg" class="shadow-lg rounded-lg">
                        </div>
                    </div>

                </div>
            </div> -->
    </div>

    <span class="font-bold p-3 text-xl mt-4"> Your Statistics </span>
    <div class="p-3 grid grid-cols-1 chart-container lg:grid-cols-2 gap-4">
      <div class="p-3 flex flex-col shadow-md rounded-lg bg-white">
        <p class="text-center font-semibold text-lg mb-4">Ongoing/Completed Course</p>
        <div class="h-[300px] w-full">
          <Doughnut :data="donutData" :options="options" />
        </div>
      </div>

      <div class="p-3 flex flex-col shadow-md rounded-lg bg-white">
        <p class="text-center font-semibold text-lg mb-4">Course Access Daily</p>
        <div class="h-[300px] w-full">
          <Line :data="lineData" :options="options" />
        </div>
      </div>
    </div>

    <div class="w-full p-3 chart-container shadow-md rounded-lg">
       <p class="text-center font-semibold text-lg mb-4">Course Lessons Completed vs. Remaining</p>
      <div class="h-[300px] w-full p-4 rounded-lg">
        <Bar :data="barData" :options="barOptions" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add these styles to ensure proper chart container behavior */
.chart-container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
