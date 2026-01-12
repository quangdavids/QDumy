<script setup>
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import InstructorCourseList from './InstructorCourseList.vue';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul','Aug', "Sep", "Oct", "Nov", "Dec"],
  datasets: [{
    label: 'Monthly Revenue',
    backgroundColor: '#f87979',
    data: [140, 139, 200, 140, 100,154,200,129,210, 382,710,690]
  }]
};


const options = {
  responsive: true,
  maintainAspectRatio: false, // Change to false to allow custom dimensions
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        boxWidth: 20,
        padding: 15,
        font: {
          size: 12
        }
      }
    }
  }
};

</script>

<template>
  <div class="min-h-screen mx-auto ">
    <p class="text-lg  mt-10 md:mx-auto text-center font-semibold 
    text-[30px]">Dashboard</p>

    <div class="grid lg:grid-cols-3  grid-cols-1 gap-2
         md:grid-cols-2 mx-auto px-4 py-3">
    <!-- <div
      class="flex gap-2 p-3 flex-wrap"
    > -->
      <div class="border mx-auto flex-1  border-gray-300 w-75 rounded-lg p-5">
        <div class="flex  gap-5">
          <div
            class="border border-gray-300 bg-green-200 w-15 h-15 flex justify-center items-center rounded-full"
          >
            <i
              class="fa-solid fa-graduation-cap text-green-500 text-[30px]"
            ></i>
          </div>

          <div class="flex flex-col">
            <div>Total Course</div>
            <div class="font-semibold text-xl">0</div>
          </div>
        </div>
      </div>

      <div class="border mx-auto flex-1 border-gray-300 w-75 rounded-lg p-5">
        <div class="flex gap-5">
          <div
            class="border border-gray-300 bg-purple-200 w-15 h-15 flex justify-center items-center rounded-full"
          >
            <i class="fa-solid fa-user text-purple-500 text-[30px]"></i>
          </div>

          <div class="flex flex-col">
            <div>Total Students</div>
            <div class="font-semibold text-xl">0</div>
          </div>
        </div>
      </div>

      <div class="border mx-auto flex-1 border-gray-300 w-75 rounded-lg p-5">
        <div class="flex  gap-5 mx-auto">
          <div
            class="border border-gray-300 bg-blue-200 w-15 h-15 flex justify-center items-center rounded-full"
          >
            <i class="fa-solid fa-dollar text-blue-500 text-[30px]"></i>
          </div>

          <div class="flex flex-col">
            <div>Revenue</div>
            <div class="font-semibold text-xl">0 $</div>
          </div>
        </div>
      </div>
        
    </div>
 
    <div class="chart-wrapper">
      <Bar :data="chartData" :options="options" />
    </div>

    <InstructorCourseList/>
  

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

<style lang="css" scoped>
.chart-wrapper {
  display: flex;
  justify-content: center; /* Centers horizontally */
  align-items: center;     /* Centers vertically (optional, depending on parent height) */
  /* Define a size for the wrapper to control chart dimensions (e.g., max-width) */
  width: 100%;
  max-width: 950px; 
  height: 200px;
  margin: 0 auto; /* Also helps center the wrapper itself if its parent is wider */
}
</style>
