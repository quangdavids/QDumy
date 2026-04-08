<script setup>
import { PolarArea, Pie, Doughnut, Bar, Line } from "vue-chartjs";

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
  Filler
} from "chart.js";
import { onMounted, ref } from "vue";
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
  Filler
);

const lineData = ref({ labels: [], datasets: [] });
const barDataUsers = ref({ labels: [], datasets: [] });
const barDataEnrollments = ref({ labels: [], datasets: [] });
const pendingCourses = ref("");
const publishedCourses = ref("");
const rejectedCourses = ref("");

const doughnutDataCourse = ref({ labels: [], datasets: [] });
const getCourses = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/admin/courses");
    pendingCourses.value = response.data.pendingCourses;
    publishedCourses.value = response.data.publishedCourses;
    rejectedCourses.value = response.data.rejectedCourses;

    doughnutDataCourse.value = {
      labels: ["Published", "Rejected", "Pending"],
      datasets: [
        {
          backgroundColor: ["green", "red", "yellow"],
          hoverOffset: 15, // Pops the segment out slightly on hover
          data: [
            publishedCourses.value.length,
            rejectedCourses.value.length,
            pendingCourses.value.length,
          ],
        },
      ],
    };
  } catch (err) {
    console.log(err);
  }
};

const numberOfUsers = ref(0);
const getNumberOfUsers = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/user/total");
    numberOfUsers.value = response.data.users;
    console.log(numberOfUsers.value);
  } catch (err) {
    console.log(err);
  }
};

const formatDay = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
};


const getDailyRevenue = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/daily-revenue");
    console.log(response.data);
    lineData.value = {
      labels: response.data.dailyRevenue.map((item) => item._id),
      datasets: [
        {
          label: "Daily Revenue",
          borderColor: "green",
          backgroundColor:"#77d171",
          fill: true,
         
          data: response.data.dailyRevenue.map((item) => item.totalRevenue),
          tension: 0.4,
        },
      ],
    };
  } catch (err) {
    console.log(err);
  }
};

const totalRevenue = ref("")
const getTotalRevenue = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/total-revenue");
    console.log(response.data.totalRevenue);
    totalRevenue.value = response.data.totalRevenue
  } catch (err) {
    console.log(err)
  }
}

const getUserGrowth = async () => {
  const response = await axios.get("http://localhost:3000/api/admin/user-growth")
barDataUsers.value = {
  labels: response.data.dailyUsers.map(label =>label._id),
  datasets: [
    {
      label: "Users",
      backgroundColor: "blue", 
      borderRadius: 4, // Modern rounded corners
      data: response.data.dailyUsers.map(data => data.dailyUser),
    },
  ],
};
}

const getWeeklyEnrollments = async () => {
  const response = await axios.get("http://localhost:3000/api/admin/weekly-enrollments")
barDataEnrollments.value = {
  labels: response.data.weeklyEnrollments.map(label => formatDay(label._id)),
  datasets: [
    {
      label: "User",
      backgroundColor: "#50C878", // blue-500
      borderRadius: 4,
      data: response.data.weeklyEnrollments.map(data => data.totalEnrollments),
    },
  ],
};
}

const revenueLineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
  
};
const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true, // Crucial for bar charts to prevent misleading visuals
      grid: {
        display: false,
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};



const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "0%", // Controls the thickness of the ring (0% = Pie Chart)
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        usePointStyle: true, // Circles instead of boxes in legend
        padding: 20,
      },
    },
  },
};

onMounted(() => {
  getCourses();
  getNumberOfUsers();
  getDailyRevenue();
  getTotalRevenue();
  getUserGrowth()
  getWeeklyEnrollments()
});
</script>

<template>
  <div>
    <div class="p-3">
      <p class="text-[30px] font-bold uppercase">Platform Overview</p>
    </div>

    <div class="grid lg:grid-cols-2 sm:grid-cols-1 gap-6 p-3">
      <div class="bg-gray-100 py-4 px-3 items-center flex gap-2 rounded-lg">
        <div>
          <i class="fa fa-users p-3 rounded-lg text-blue-500 bg-blue-200"></i>
        </div>

        <div>
          <p class="font-bold tracking-widest text-xs text-gray-700">
            User Management
          </p>
          <p class="font-bold text-xs text-blue-500">
            Manage user status of the platform
          </p>
        </div>
      </div>

      <div class="bg-gray-100 py-4 px-3 items-center flex gap-2 rounded-lg">
        <div>
          <i
            class="fa fa-users p-3 rounded-lg text-yellow-500 bg-yellow-200"
          ></i>
        </div>

        <div>
          <p class="font-bold tracking-widest text-xs text-gray-700">
            Course Catalog
          </p>
          <p class="font-bold text-xs text-yellow-500">
            Manage user status of the platform
          </p>
        </div>
      </div>

      <!-- <div class="bg-gray-100 p-3 items-center flex gap-2 rounded-lg">
            <div>
              <i
                class="fa fa-dashboard p-3 rounded-lg text-blue-500 bg-blue-200"
              ></i>
            </div>

            <div>
              <p class="font-bold tracking-widest text-xs text-gray-700">
                Check Dashboard
              </p>
              <p class="font-bold text-xs text-blue-500">
                Witness Dashboard
              </p>
            </div>
          </div> -->
    </div>

    <div class="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 p-3">
      <div
        class="bg-gray-100 py-8 px-6 rounded-lg border-l-blue-400 border-l-4"
      >
        <div class="flex justify-between items-center">
          <p class="font-bold tracking-widest text-gray-700">Active Users</p>
          <div class="rounded-lg bg-blue-200 p-3">
            <i class="fa fa-users text-blue-700 text-lg"></i>
          </div>
        </div>
        <p class="font-bold text-[25px] text-blue-500">{{ numberOfUsers }}</p>
      </div>
      <div
        class="bg-gray-100 py-8 px-6 rounded-lg border-l-green-400 border-l-4"
      >
        <div class="flex justify-between items-center">
          <p class="font-bold tracking-wide text-gray-700">Platform Revenue</p>
          <div class="rounded-lg bg-green-200 p-3">
            <i class="fa fa-dollar text-green-700 text-lg"></i>
          </div>
        </div>

        <p class="font-bold text-[25px] text-green-500">{{ Math.floor(totalRevenue) }} $</p>

      </div>

      <div
        class="bg-gray-100 py-8 px-6 rounded-lg border-l-yellow-400 border-l-4"
      >
        <div class="flex justify-between items-center">
          <p class="font-bold tracking-wide text-sm text-gray-700">
            Pending Course Approval
          </p>

          <div class="rounded-lg bg-yellow-200 p-3">
            <i class="fa fa-book text-yellow-700 text-lg"></i>
          </div>
        </div>
        <p class="font-bold text-[25px] text-yellow-500">
          {{ pendingCourses.length }}
        </p>
      </div>
    </div>
  </div>

  <div class="flex flex-col md:flex-row p-3 gap-2">
    <div class="flex-1 w-full p-3 border rounded-lg border-gray-100 shadow">
      <div class="font-semibold mt-2 text-gray-700 mb-2"> Daily Revenue </div>
      <div class="min-h-[350px]">
        <Line :data="lineData" :options="revenueLineOptions" />
      </div>
    </div>

    <div class="flex-1 w-full p-3 border border-gray-100 shadow">
      <div class="font-semibold mt-2 text-gray-700 mb-2">Daily New User</div>
      <div class="min-h-[350px]">
        <Bar :data="barDataUsers" :options="barOptions" />
      </div>
    </div>
  </div>

  <div class="flex flex-col md:flex-row p-3 gap-2">
    <div class="flex-1 w-full p-3 border rounded-lg border-gray-100 shadow">
      <div class="font-semibold mt-2 text-gray-700 mb-2"> Daily Enrollments</div>
      <div class="min-h-[350px]">
        <Bar :data="barDataEnrollments" :options="barOptions" />
      </div>
    </div>

    <div
      class="flex-1 min-h-[350px] w-full p-3 border rounded-lg border-gray-100 shadow"
    >
      <div class="font-semibold mt-2 text-gray-700 mb-2">
        Course Status Distribution
      </div>
      <div class="min-h-[350px]">
        <Pie :data="doughnutDataCourse" :options="doughnutOptions" />
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped></style>
