<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import dayjs from 'dayjs';
import { useRouter } from "vue-router";
const pendingCourses = ref("");
const publishedCourses = ref("")
const rejectedCourses = ref("")

const pendingClicked = ref(true)
const publishedClicked = ref(false)
const rejectedClicked = ref(false)

const router = useRouter()

const handlePendingClicked = function() {
    pendingClicked.value = !pendingClicked.value
    publishedClicked.value = false 
    rejectedClicked.value = false
}

const handlePublishedClicked = function() {
    publishedClicked.value = !publishedClicked.value
    pendingClicked.value = false 
    rejectedClicked.value = false
}

const handleRejectedClicked = function() {
    rejectedClicked.value = !rejectedClicked.value
    publishedClicked.value = false 
    pendingClicked.value = false
}

const viewCourseDetails = function(courseId) {
      router.push({
        path: `/course/${courseId}`
      })
}
const getCourses = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/admin/courses");
    pendingCourses.value = response.data.pendingCourses;
    publishedCourses.value = response.data.publishedCourses;
    rejectedCourses.value = response.data.rejectedCourses
    console.log(pendingCourses.value);
  } catch (err) {
    console.log(err);
  }
};

const publishCourse = async (courseId) => {
  try {
    const response = await axios.put(`http://localhost:3000/api/admin/publish/${courseId}`)
    console.log(response.data)
    getCourses()
  } catch (err) {
    console.log(err)
  }
}

const rejectCourse = async (courseId) => {
  try {
    const response = await axios.put(`http://localhost:3000/api/admin/reject/${courseId}`)
    console.log(response.data)
    getCourses()
  } catch (err) {
    console.log(err)
  }
}
onMounted(() => {
  getCourses();
});
</script>

<template>
  <div class="w-full p-3 max-w-screen-xl mx-auto">
    <div>
      <div class="py-3 px-2 mx-auto">
        <p class="text-[30px] font-bold font-serif">
          Course Publication Requests
        </p>

        <p class="text-[16px] font-semibold text-slate-400 font-serif">
          Review and manage course submissions coming from instructors. Ensure
          the quality of the course before approving publication to the public
        </p>
      </div>
    </div>

    <div class="py-3 px-2">
      <div
        class="flex border-b-1 font-semibold border-slate-400 gap-10 text-slate-500 w-full"
      >
        <div
         @click="handlePendingClicked()"
          :class="pendingClicked ? 
          `border-green-500 flex gap-3 items-center hover:border-green-500 text-black cursor-pointer border-b-3 py-3`
          : `active:border-green-500 flex gap-3 items-center hover:border-green-500 hover:text-black cursor-pointer hover:border-b-3 py-3` "
        >
          Pending 
          <div
            class="text-green-500 font-bold bg-green-200 py-1 text-xs rounded-lg px-3"
          >
            {{ pendingCourses.length }}
          </div>
        </div>

       
        <div
           @click="handlePublishedClicked()"
          :class="publishedClicked ? 
          `border-green-500 flex gap-3 items-center hover:border-green-500 text-black cursor-pointer border-b-3 py-3`
          : `active:border-green-500 flex gap-3 items-center hover:border-green-500 hover:text-black cursor-pointer hover:border-b-3 py-3` "
        >
          Published 

          <div
            class="text-green-500 font-bold bg-green-200 py-1 text-xs rounded-lg px-3"
          >
            {{ publishedCourses.length }}
          </div>
        </div>

      
        <div
          @click="handleRejectedClicked()"
          :class="rejectedClicked ? 
          `border-green-500 flex gap-3 items-center hover:border-green-500 text-black cursor-pointer border-b-3 py-3`
          : `active:border-green-500 flex gap-3 items-center hover:border-green-500 hover:text-black cursor-pointer hover:border-b-3 py-3` "
        >
          Rejected 
          
          <div
            class="text-green-500 font-bold bg-green-200 py-1 text-xs rounded-lg px-3"
          >
            {{ rejectedCourses.length }}
          </div>
        </div>
      </div>
    </div>

    <div
    v-if="pendingClicked"
      class="p-4 w-full overflow-hidden h-auto flex flex-col rounded-lg bg-gray-100 mt-5 mb-3"
      v-for="course in pendingCourses"
      :key="course.id"
    >
      <div class="flex justify-between p-3 min-w-0">
        <div class="flex gap-4">
          <div class="border border-gray-300 py-2 px-3">
            <img :src="course.courseImage" class="w-30 h-30 object-cover" />
          </div>

          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <p
                v-if="course.status === `pending`"
                class="uppercase text-yellow-700 font-bold bg-yellow-200 text-xs p-2 rounded-lg"
              >
                {{ course.status }}
              </p>


           

              <p
                class="uppercase text-green-700 font-bold bg-green-200 text-xs p-2 rounded-lg"
              >
                {{ course.category }}
              </p>
              <div class="w-2 h-2 rounded-full bg-slate-400"></div>
              <p class="text-sm text-slate-600 font-semibold">
                Created on {{ dayjs(course.createdAt).format('DD/MM/YYYY') }}
              </p>
            </div>

            <div>
              <p class="font-bold text-[19px]">{{ course.title }}</p>
              <p class="text-sm line-clamp-1" v-html="course.description"></p>
            </div>

            <div class="mt-auto mb-2 flex gap-4 text-slate-500">

               <div class="flex gap-2 items-center">
               <div class="max-w-10 max-h-10">
                <img :src="course.lecturerId.profilePic" class="object-cover rounded-full w-7 h-7">
               </div>
                <span class="text-black font-bold text-xs"> {{ course.lecturerId.lecturerName }} </span>
              
              </div>


              <div class="flex gap-2 items-center">
                <i class="fa fa-users"></i>
                <span class="text-black font-bold text-xs"> 0 </span>
                <span class="text-slate-500 text-xs"> students</span>
              </div>

              <div class="flex gap-2 items-center">
                <i class="fa fa-star text-yellow-600"></i>
                <span class="text-black text-xs font-bold"> N/A </span>
                <span class="text-slate-500 text-xs"> (0 reviews)</span>
              </div>

              <!-- <div class="flex gap-2 items-center">
                <i class="fa fa-money-bill text-green-500"></i>
                <span class="text-black font-bold text-xs"> $ 0 </span>
                <span class="text-slate-500 text-xs"> earned</span>
              </div> -->
            </div>
          </div>
        </div>
        <div class="border-l-1 flex flex-col gap-2 border-gray-400 py-3 px-4">
          <button
            @click="viewCourseDetails(course._id)"
            class="bg-blue-500 cursor-pointer text-white py-2 flex gap-3 items-center text-xs px-3 rounded-lg font-bold"
          >
            <i class="fa fa-eye text-white text-lg"></i>
            <span>View </span>
          </button>

          <button
          
            @click="publishCourse(course._id)"
            class="bg-green-500 cursor-pointer text-white py-2 flex gap-3 items-center text-xs px-3 rounded-lg font-bold"
          >
            <i class="fa fa-upload text-white text-lg"></i>
            <span>Publish </span>
          </button>

          <button
            @click="rejectCourse(course._id)"
            class="bg-red-500 text-white cursor-pointer w-full mx-auto py-2 flex gap-4 items-center text-xs px-3 rounded-lg font-bold"
          >
            <i class="fa fa-book text-lg"></i>
            <span>Reject </span>
          </button>
        </div>
      </div>
    </div>

     <div
       v-if="publishedClicked"
      class="p-4 w-full overflow-hidden h-auto flex flex-col rounded-lg bg-gray-100 mt-5 mb-3"
      v-for="course in publishedCourses"
      :key="course.id"
    >
  
      <div  class="flex justify-between p-3 min-w-0">
        <div class="flex gap-4">
          <div class="border border-gray-300 py-2 px-3">
            <img :src="course.courseImage" class="w-30 h-30 object-cover" />
          </div>

          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <p
                v-if="course.status === `pending`"
                class="uppercase text-yellow-700 font-bold bg-yellow-200 text-xs p-2 rounded-lg"
              >
                {{ course.status }}
              </p>


              <p
                v-else-if="course.status === `published`"
                class="uppercase text-green-700 font-bold bg-green-200 text-xs p-2 rounded-lg"
              >
                {{ course.status }}
              </p>

              <p
                v-else-if="course.status === `rejected`"
                class="uppercase text-red-700 font-bold bg-red-200 text-xs p-2 rounded-lg"
              >
                {{ course.status }}
              </p>

              <p
                class="uppercase text-green-700 font-bold bg-green-200 text-xs p-2 rounded-lg"
              >
                {{ course.category }}
              </p>
              <div class="w-2 h-2 rounded-full bg-slate-400"></div>
              <p class="text-sm text-slate-600 font-semibold">
                Created on {{ dayjs(course.createdAt).format('DD/MM/YYYY') }}
              </p>
            </div>

            <div>
              <p class="font-bold text-[19px]">{{ course.title }}</p>
              <p class="text-sm line-clamp-1" v-html="course.description"></p>
            </div>

            <div class="mt-auto mb-2 flex gap-4 text-slate-500">

               <div class="flex gap-2 items-center">
               <div class="max-w-10 max-h-10">
                <img :src="course.lecturerId.profilePic" class="object-cover rounded-full w-7 h-7">
               </div>
                <span class="text-black font-bold text-xs"> {{ course.lecturerId.lecturerName }} </span>
              
              </div>


              <div class="flex gap-2 items-center">
                <i class="fa fa-users"></i>
                <span class="text-black font-bold text-xs"> 0 </span>
                <span class="text-slate-500 text-xs"> students</span>
              </div>

              <div class="flex gap-2 items-center">
                <i class="fa fa-star text-yellow-600"></i>
                <span class="text-black text-xs font-bold"> N/A </span>
                <span class="text-slate-500 text-xs"> (0 reviews)</span>
              </div>

              <!-- <div class="flex gap-2 items-center">
                <i class="fa fa-money-bill text-green-500"></i>
                <span class="text-black font-bold text-xs"> $ 0 </span>
                <span class="text-slate-500 text-xs"> earned</span>
              </div> -->
            </div>
          </div>
        </div>
        <div class="border-l-1 flex flex-col gap-2 border-gray-400 py-3 px-4">
          <button
            @click="viewCourseDetails(course._id)"
            class="bg-blue-500 cursor-pointer text-white py-2 flex gap-3 items-center text-xs px-3 rounded-lg font-bold"
          >
            <i class="fa fa-eye text-white text-lg"></i>
            <span>View </span>
          </button>

          <button
          v-if="course.status !== `published`"
            @click="publishCourse(course._id)"
            class="bg-green-500 cursor-pointer text-white py-2 flex gap-3 items-center text-xs px-3 rounded-lg font-bold"
          >
            <i class="fa fa-upload text-white text-lg"></i>
            <span>Publish </span>
          </button>

          <button
        
            @click="rejectCourse(course._id)"
            class="bg-red-500 text-white cursor-pointer w-full mx-auto py-2 flex gap-4 items-center text-xs px-3 rounded-lg font-bold"
          >
            <i class="fa fa-book text-lg"></i>
            <span>Reject </span>
          </button>
        </div>
      </div>
    </div>

     <div
    v-if="rejectedClicked"
      class="p-4 w-full overflow-hidden h-auto flex flex-col rounded-lg bg-gray-100 mt-5 mb-3"
      v-for="course in rejectedCourses"
      :key="course.id"
    >
      <div class="flex justify-between p-3 min-w-0">
        <div class="flex gap-4">
          <div class="border border-gray-300 py-2 px-3">
            <img :src="course.courseImage" class="w-30 h-30 object-cover" />
          </div>

          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
             


              <p
                v-if="course.status === `published`"
                class="uppercase text-green-700 font-bold bg-green-200 text-xs p-2 rounded-lg"
              >
                {{ course.status }}
              </p>

              <p
                v-else-if="course.status === `rejected`"
                class="uppercase text-red-700 font-bold bg-red-200 text-xs p-2 rounded-lg"
              >
                {{ course.status }}
              </p>

              <p
                class="uppercase text-green-700 font-bold bg-green-200 text-xs p-2 rounded-lg"
              >
                {{ course.category }}
              </p>
              <div class="w-2 h-2 rounded-full bg-slate-400"></div>
              <p class="text-sm text-slate-600 font-semibold">
                Created on {{ dayjs(course.createdAt).format('DD/MM/YYYY') }}
              </p>
            </div>

            <div>
              <p class="font-bold text-[19px]">{{ course.title }}</p>
              <p class="text-sm line-clamp-1" v-html="course.description"></p>
            </div>

            <div class="mt-auto mb-2 flex gap-4 text-slate-500">

               <div class="flex gap-2 items-center">
               <div class="max-w-10 max-h-10">
                <img :src="course.lecturerId.profilePic" class="object-cover rounded-full w-7 h-7">
               </div>
                <span class="text-black font-bold text-xs"> {{ course.lecturerId.lecturerName }} </span>
              
              </div>


              <div class="flex gap-2 items-center">
                <i class="fa fa-users"></i>
                <span class="text-black font-bold text-xs"> 0 </span>
                <span class="text-slate-500 text-xs"> students</span>
              </div>

              <div class="flex gap-2 items-center">
                <i class="fa fa-star text-yellow-600"></i>
                <span class="text-black text-xs font-bold"> N/A </span>
                <span class="text-slate-500 text-xs"> (0 reviews)</span>
              </div>

              <!-- <div class="flex gap-2 items-center">
                <i class="fa fa-money-bill text-green-500"></i>
                <span class="text-black font-bold text-xs"> $ 0 </span>
                <span class="text-slate-500 text-xs"> earned</span>
              </div> -->
            </div>
          </div>
        </div>
        <div class="border-l-1 flex flex-col gap-2 border-gray-400 py-3 px-4">
          <button
            @click="viewCourseDetails(course._id)"
            class="bg-blue-500 cursor-pointer text-white py-2 flex gap-3 items-center text-xs px-3 rounded-lg font-bold"
          >
            <i class="fa fa-eye text-white text-lg"></i>
            <span>View </span>
          </button>

          <button
            @click="publishCourse(course._id)"
            class="bg-green-500 cursor-pointer text-white py-2 flex gap-3 items-center text-xs px-3 rounded-lg font-bold"
          >
            <i class="fa fa-upload text-white text-lg"></i>
            <span>Publish </span>
          </button>

          <button
            @click="rejectCourse(course._id)"
              v-if="course.status !== `rejected`"
            class="bg-red-500 text-white cursor-pointer w-full mx-auto py-2 flex gap-4 items-center text-xs px-3 rounded-lg font-bold"
          >
            <i class="fa fa-book text-lg"></i>
            <span>Reject </span>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
