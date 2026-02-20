<script setup>
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
import { ref } from "vue";
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

const lineData = ref(null)
const barDataEnrollments = ref(null)
const barDataRevenue = ref(null)
const doughnutDataCourse = ref(null)

lineData.value = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    datasets: [
        {
            label: "Login Daily",
            borderColor: "green",
            data: [40, 39, 10, 40, 39, 80,33],
            tension: 0.4 
        }
    ]
}


barDataEnrollments.value = {
  labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  datasets: [
    {
      label: 'Enrollments',
      backgroundColor: '#50C878', // blue-500
      borderRadius: 4,           // Modern rounded corners
      data: [120, 85, 45, 90, 60, 12.3, 1.2]
    }
  ]
};

barDataRevenue.value = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: 'Revenue ($)',
      backgroundColor: '#50C878', // blue-500
      borderRadius: 4,           // Modern rounded corners
      data: [120, 85, 45, 90, 60, 12.3, 1.2, 33, 45, 90,21,21]
    }
  ]
};

doughnutDataCourse.value = {
  labels: ['Published', 'Draft', 'Rejected', "Pending"],
  datasets: [
    {
      backgroundColor: ['green', 'gray', "red" ,'yellow'], // Green, Blue, Amber
      hoverOffset: 15, // Pops the segment out slightly on hover
      data: [300, 150, 11, 50]
    }
  ]
};

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true, // Crucial for bar charts to prevent misleading visuals
      grid: {
        display: false
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '50%', // Controls the thickness of the ring (0% = Pie Chart)
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true, // Circles instead of boxes in legend
        padding: 20
      }
    }
  }
};
</script>

<template>
    <div class="flex flex-col mx-auto">
      <div class="px-2">
        <div class="flex justify-between">
          <div class="p-3 border-b-gray-200 w-full relative border-b-1">
            <input
              type="text"
              class="w-60 p-2 text-sm rounded-md bg-gray-100"
              placeholder="Global search"
            />
          </div>
          <div class="flex self-center p-3 bg-gray-200 rounded-full">
            <i class="fa fa-bell text-xl"></i>
          </div>
        </div>
      </div>

      <div>
        <div class="p-3">
          <p class="text-[30px] font-bold uppercase">Platform Overview</p>
        </div>

        <div class="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 p-3">
          <div class="bg-gray-100 p-3 items-center flex gap-2 rounded-lg">
            <div>
              <i
                class="fa fa-users p-3 rounded-lg text-purple-500 bg-blue-200"
              ></i>
            </div>

            <div>
              <p class="font-bold tracking-widest text-xs text-gray-700">
                User Management
              </p>
              <p class="font-bold text-xs text-purple-500">
                Manage user status of the platform
              </p>
            </div>
          </div>

          <div class="bg-gray-100 p-3 items-center flex gap-2 rounded-lg">
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

          <div class="bg-gray-100 p-3 items-center flex gap-2 rounded-lg">
            <div>
              <i
                class="fa fa-dashboard p-3 rounded-lg text-blue-500 bg-purple-200"
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
          </div>
        </div>

        <div class="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 p-3">
          <div
            class="bg-gray-100 py-8 px-6 rounded-lg border-l-blue-400 border-l-4"
          >
            <p class="font-bold tracking-widest text-gray-700">Active Users</p>
            <p class="font-bold text-[25px] text-blue-500">20</p>
          </div>
          <div
            class="bg-gray-100 py-8 px-6 rounded-lg border-l-green-400 border-l-4"
          >
            <p class="font-bold tracking-widest text-gray-700">
              Platform Revenue
            </p>
            <p class="font-bold text-[25px] text-green-500">50,200 $</p>
            <p class="text-sm text-green-400">+ 13.5%</p>
          </div>

          <div
            class="bg-gray-100 py-8 px-6 rounded-lg border-l-yellow-400 border-l-4"
          >
            <p class="font-bold tracking-wide text-sm text-gray-700">
              Pending Course Approval
            </p>
            <p class="font-bold text-[25px] text-yellow-500">32</p>
          </div>
        </div>
      </div>

      <div class="flex flex-col md:flex-row p-3 gap-2  ">
      
        <div class=" flex-1  w-full p-3 border rounded-lg border-gray-100 shadow">
          <div class="font-semibold mt-2 text-gray-700 mb-2">  Login Daily</div>
          <div class="min-h-[350px]">
          <Line :data="lineData" :options="lineOptions"/>
          </div>
        </div>

        <div class=" flex-1  w-full p-3 border border-gray-100 shadow ">
          <div class="font-semibold mt-2 text-gray-700 mb-2">  New Enrollments</div>
          <div class="min-h-[350px]">
          <Bar :data="barDataEnrollments" :options="barOptions"/>
          </div>
        </div>
      </div>

      <div class="flex flex-col md:flex-row p-3 gap-2">
        <div class=" flex-1  w-full p-3 border rounded-lg border-gray-100 shadow">
         <div class="font-semibold mt-2 text-gray-700 mb-2">  Weekly Revenue</div>
         <div class="min-h-[350px]">
         <Bar :data="barDataRevenue" :options="barOptions"/>
         </div>
          </div>

          <div class=" flex-1 min-h-[350px] w-full p-3 border rounded-lg border-gray-100 shadow">
            <div class="font-semibold mt-2 text-gray-700 mb-2">  Course Status Distribution</div>
            <div class="min-h-[350px]">
            <Doughnut :data="doughnutDataCourse" :options="doughnutOptions"/>
            </div>
          </div>  
      </div>
    </div>

</template>

<style lang="css" scoped></style>
