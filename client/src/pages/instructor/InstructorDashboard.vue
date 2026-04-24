<script setup>
import { Bar, Line, Doughnut } from "vue-chartjs";
import { onMounted, ref, computed } from "vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

import { useAuthStore } from "../../stores/auth.store";
import { storeToRefs } from "pinia";
import axios from "axios";
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

const apiUrl = import.meta.env.VITE_API_URL;
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const doughnutCourseCompletionData = ref({ labels: [], datasets: [] });
const barDataEnrollments = ref({ labels: [], datasets: [] });
const lineChartData = ref({ labels: [], datasets: [] });
const lecturerId = ref();

const lecturerData = ref("");
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
const totalStudentsEnrolled = ref()
const getTotalStudentsEnrolled = async () => {
  try {
    const findLecturer = await axios.get(
      `${apiUrl}/api/lecturer-data/${user.value._id}`,
    );
    const response = await axios.get(
      `${apiUrl}/api/lecturer/total-students/${findLecturer.data.lecturer._id}`,
    );
    totalStudentsEnrolled.value = response.data.totalStudent
    console.log(totalStudentsEnrolled.value)
  } catch (err) {
    console.log(err);
  }
};

const getLecturerDailyRevenue = async () => {
  try {
    const findLecturer = await axios.get(
      `${apiUrl}/api/lecturer-data/${user.value._id}`,
    );
    const response = await axios.get(
      `${apiUrl}/api/daily-revenue/${findLecturer.data.lecturer._id}`,
    );
    lineChartData.value = {
      labels: response.data.dailyRevenue.map((label) => label._id),
      datasets: [
        {
          label: "Monthly Revenue",
          backgroundColor: "#f87979",
          data: response.data.dailyRevenue.map((data) => data.totalRevenue),
        },
      ],
    };
  } catch (err) {
    console.log(err);
  }
};

const getCourseCompletion = async () => {
  try {
    const findLecturer = await axios.get(
      `${apiUrl}/api/lecturer-data/${user.value._id}`,
    );
    const response = await axios.get(
      `${apiUrl}/api/lecturer/completed-ongoing/${findLecturer.data.lecturer._id}`,
    );

    doughnutCourseCompletionData.value = {
      labels: ["Completed", "Ongoing"],
      datasets: [
        {
          backgroundColor: ["green", "yellow"], // Green, Blue, Amber
          hoverOffset: 15, // Pops the segment out slightly on hover
          data: [response.data.completed, response.data.ongoing],
        },
      ],
    };
  } catch (err) {
    console.log(err);
  }
};

const getDailyEnrollments = async () => {
  try {
    const findLecturer = await axios.get(
      `${apiUrl}/api/lecturer-data/${user.value._id}`,
    );
    const response = await axios.get(
      `${apiUrl}/api/lecturer/enrollments/${findLecturer.data.lecturer._id}`,
    );
    console.log(response.data);
    barDataEnrollments.value = {
      labels: response.data.dailyEnrollments.map((date) => date._id),
      datasets: [
        {
          label: "Daily Enrollments",
          backgroundColor: "#0BDA51", // blue-500
          borderRadius: 3, // Modern rounded corners
          data: response.data.dailyEnrollments.map(
            (data) => data.totalEnrollments,
          ),
        },
      ],
    };
  } catch (err) {}
};
const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: 20,
  },
  animation: {
    duration: 1200,
    easing: "easeOutQuart",
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#111827",
      titleColor: "#F9FAFB",
      bodyColor: "#F9FAFB",
      padding: 12,
      cornerRadius: 8,
      displayColors: false,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#6B7280" },
    },
    y: {
      grid: { color: "rgba(0,0,0,0.05)" },
      ticks: { color: "#6B7280" },
    },
  },
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
      barPercentage: 0.2, // 0.5 = 50% of the category width
      // Adjusts the width of the category (bar + space)
      categoryPercentage: 0.5,
    },
    x: {
      grid: {
        display: "bottom",
      },
    },
  },
  plugins: {
    // Or set a fixed maximum width in pixels
    maxBarThickness: 20,
  },
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "60%",
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        usePointStyle: true,
        padding: 20,
      },
    },
    tooltip: {
      backgroundColor: "#111827",
      padding: 10,
      cornerRadius: 8,
      displayColors: false,
    },
  },
};
onMounted(() => {
  getLecturer();
  getLecturerDailyRevenue();
  getCourseCompletion();
  getDailyEnrollments();
  getTotalStudentsEnrolled()
});
</script>

<template>
  <div class="min-h-screen mx-auto">
    <p
      class="text-lg mt-10 md:mx-auto text-center font-semibold text-[30px] mb-2"
    >
      Dashboard
    </p>

    <div class="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 p-3">
      <div
        class="bg-gray-100 py-8 px-6 rounded-lg border-l-blue-400 border-l-4"
      >
        <div class="flex justify-between items-center">
          <p class="font-bold tracking-widest text-gray-700">Total Students</p>
          <div class="rounded-lg bg-blue-200 p-3">
            <i class="fa fa-users text-blue-700 text-lg"></i>
          </div>
        </div>
        <p class="font-bold text-[25px] text-blue-500">{{ totalStudentsEnrolled}}</p>
      </div>
      <div
        class="bg-gray-100 py-8 px-6 rounded-lg border-l-green-400 border-l-4"
      >
        <div class="flex justify-between items-center">
          <p class="font-bold tracking-wide text-gray-700">Total Revenue</p>
          <div class="rounded-lg bg-green-200 p-3">
            <i class="fa fa-dollar text-green-700 text-lg"></i>
          </div>
        </div>

        <p class="font-bold text-[25px] text-green-500">
          {{ lecturerData?.revenue }} $
        </p>
      </div>

      <div
        class="bg-gray-100 py-8 px-6 rounded-lg border-l-yellow-400 border-l-4"
      >
        <div class="flex justify-between items-center">
          <p class="font-bold tracking-wide text-md text-gray-700">
            Total Courses
          </p>

          <div class="rounded-lg bg-yellow-200 p-3">
            <i class="fa fa-book text-yellow-700 text-lg"> </i>
          </div>
        </div>
        <p class="font-bold text-[25px] text-yellow-500">
          {{ lecturerData?.ownedCourses?.length }}
        </p>
      </div>
    </div>
    <div class="grid md:flex-row gap-3 p-8">
      <div class="flex-1 border rounded-lg p-2 shadow-md border-gray-100">
        <div class="font-semibold text-[18px] mt-2 py-2">Daily Revenue</div>
        <div class="min-h-[300px]">
          <Line :data="lineChartData" :options="lineOptions" />
        </div>
      </div>

      <div class="flex-1 border rounded-lg p-2 shadow-md border-gray-100">
        <div class="font-semibold text-[18px] mt-2 py-2">
          Course Completion Status
        </div>
        <div class="min-h-[300px]">
          <Doughnut
            :data="doughnutCourseCompletionData"
            :options="doughnutOptions"
          />
        </div>
      </div>

      <div class="border rounded-lg p-6 mb-2 border-gray-100 shadow-md">
        <div class="font-semibold text-[18px] mt-2 py-2">Daily Enrollments</div>
        <div class="min-h-[300px]">
          <Bar :data="barDataEnrollments" :options:="barOptions" />
        </div>
      </div>
    </div>

    <!-- <div class="w-full  mx-auto px-7 py-4 overflow-x-auto "> -->

    <!-- <p class=" text-lg  mt-10 md:mx-auto text-center font-semibold 
    text-[30px] ">My Courses List</p>
        <div class="max-w-full overflow-x-auto  mx-auto  px-12 py-5">
             
      <table class="border-b-1 min-w-full divide-y  mx-auto border-gray-300  table-fixed border-collapse">
        <thead class=" rounded-full  bg-black text-white">
        <tr  class="rounded-full">
          <td class="px-4 py-2 tracking-wider">Course Title</td>
          <td class="px-4 py-2 tracking-wider">Total Lectures</td>
          <td class="px-4 py-2 tracking-wider">Category</td>
          <td class="px-4 py-2 tracking-wider">Price</td>
          <td class="px-4 py-2 ml-4 tracking-wider">Action</td>
        </tr>
        </thead>
<tbody class="bg-white divide-y divide-gray-200">
        <tr>
          <td class="px-4 py-2 whitespace-nowrap">
            <div class="flex justify-center items-center gap-3">
              
                <img src="/images/students/trish.jpeg" class="w-18 h-18 rounded-lg flex-shrink-0" />
              
              <div class="text-sm font-semibold">
                Learn Python with Trish Stratus
              </div>
            </div>
          </td>

          <td class="px-4 py-2 whitespace-nowrap">
            <div class="text-left text-[17px] ">
                25
            </div>
          </td>

          <td class="px-4 py-2 whitespace-nowrap">
            <div class="text-left text-[17px] ">
                Programming
            </div>
          </td>

          <td class="px-4 py-2 whitespace-nowrap">
            <div class="text-left text-[17px] ">
                12 $
            </div>
          </td>

            <td class="px-4 py-2 whitespace-nowrap">
            <div class=" flex gap-3 mr-8 ">
                 <button class="rounded-lg px-4 py-3 bg-blue-500 "> 
                    <i class="fa fa-pencil text-white"></i> </button>
                 <button class="rounded-lg px-4 py-3 bg-red-500">
                    <i class="fa fa-trash text-white"></i>    
                </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div> -->
  </div>

  <!-- </div> -->
</template>

<style lang="css" scoped></style>
