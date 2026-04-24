<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import dayjs from "dayjs"
import { useRouter } from "vue-router";


const users = ref("");
const totalUsers = ref("");
const router = useRouter()
const limit = ref(6);
const totalPages = ref(1)
const currentPage = ref(1)
const apiUrl = import.meta.env.VITE_API_URL;
const getAllUsers = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/user/all/?page=${currentPage.value}&limit=${limit.value}` );
    users.value = response.data.users;
    totalUsers.value = response.data.totalUsers;
    totalPages.value = response.data.totalPages
    currentPage.value = response.data.currentPage
    console.log(users.value)
    console.log(totalPages.value)
    console.log(currentPage.value)
  } catch (err) {
    console.log(err);
  }
};

const changePage = (newPage) => {
  try {
    if (newPage > 0 && newPage <= totalPages.value) {
      currentPage.value = newPage;
      console.log(currentPage.value);
      getAllUsers()
    }
  } catch (err) {
    console.log(err);
  }
};

const blockUser = async (userId) => {
  try {
    const response = await axios.put(`${apiUrl}/api/admin/block/${userId}`)
    console.log(response.data)
    getAllUsers()
  } catch (err) {
    console.log(err)
  }
}

const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${apiUrl}/api/admin/delete-user/${userId}`)
    console.log(response.data)
    getAllUsers()
  } catch (err) {
    console.log(err)
  }
}

const toUserProfile = async (userId) => {
    try {
      router.push({
        path: `/user/dashboard`,
        params: userId
      })
    } catch (err) {
      console.log(err)
    }
}
onMounted(() => {
  getAllUsers();
});
</script>

<template>
  <div class="p-3">
    <p class="text-[30px] font-bold uppercase mx-auto">Users Directory</p>
  </div>
  <div class="py-2 container mx-auto">
    

    <div class="p-3 mx-auto">
      <div class="p-3 rounded-t-lg border-slate-800/20 border-1 border-b-0">
        <div class="flex gap-3">
          <input
            type="text"
            placeholder="Search for student's name"
            class="text-xs outline-1 rounded-md outline-slate-400 focus:outline-3 p-2"
          />

          <select
            id="role"
            class="text-xs font-bold text-slate-700 outline-1 rounded-md outline-slate-400 focus:outline-3 p-2"
          >
            <option disabled selected hidden>All Roles</option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>

          <select
            id="status"
            class="text-xs font-bold text-slate-700 outline-1 rounded-md outline-slate-400 focus:outline-3 p-2"
          >
            <option disabled selected hidden>All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <table class="w-full" >
        <thead>
          <tr
            class="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide"
          >
            <th class="py-4 px-6 border-b border-slate-100 text-center">
              User
            </th>
            <th class="py-4 px-6 border-b border-slate-100 text-center">
              Role
            </th>
            <th class="py-4 px-6 border-b border-slate-100 text-center">
              Date Joined
            </th>
            <th class="py-4 px-6 border-b border-slate-100 text-center">
              Status
            </th>
            <th class="py-4 px-6 border-b border-slate-100 text-center">
              Actions
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-100" v-for="user in users" :key="user._id">
          <tr class="hover:bg-slate-50 border-slate-200 border-1">
            <td class="flex py-4 px-2 gap-4">
              <img
                :src="user.profileImg"
                class="w-15 h-15 outline-1 outline-gray-300 rounded-full"
              />
              <div>
                <p class="text-sm font-bold">{{ user.username }}</p>
                <p class="text-xs font-semibold text-slate-600">
                 {{ user.email }}
                </p>
              </div>
            </td>
            <td>
              <div class="bg-blue-200 rounded-lg text-center py-1">
                <p class="text-blue-700 font-semibold tracking-wide capitalize">{{ user.role }}</p>
              </div>
            </td>
            <td class="text-center">
              <p class="text-slate-600 text-sm font-semibold tracking-wide">
                {{ dayjs(user.dateJoined).format('MMMM D, YYYY') }}
              </p>
            </td>
            <td class="text-center">
              <div v-if="user.status === `Active`"
                class="text-green-500 flex gap-3 justify-center items-center text-sm font-semibold tracking-wide"
              >
                <div class="bg-green-500 w-3 h-3 rounded-full"></div>
                <p>Active</p>
              </div>

                 <div v-else
                class="text-red-500 flex gap-3 justify-center items-center text-sm font-semibold tracking-wide"
              >
                <div class="bg-red-500 w-3 h-3 rounded-full"></div>
                <p>Suspended</p>
              </div>
            </td>
            <td class="text-center">
              <div class="flex gap-5 justify-center">
                <i class="fa fa-eye text-lg hover:text-blue-500 cursor-pointer duration-200"
                @click="toUserProfile(user._id)"></i>
                <i class="fa fa-comments text-lg hover:text-green-500 cursor-pointer duration-200"></i>
                <i class="fa fa-ban text-lg hover:text-orange-500 cursor-pointer duration-200"
                @click="blockUser(user._id)"></i>
                 <i class="fa fa-trash text-lg hover:text-red-500 cursor-pointer duration-200"
                 @click="deleteUser(user._id)"></i>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="p-3 rounded-b-lg border-slate-800/20 border-1">
        <div class="flex gap-3 justify-end">
          <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
            class="outline-1 outline-gray-400 rounded-lg h-12 w-12 disabled:text-gray-300 cursor-pointer disabled:outline-gray-300"
          >
            <i class="fa fa-chevron-left"></i>
          </button>
          <button
            class="outline-1 outline-gray-400 bg-green-500 font-bold text-white rounded-lg h-12 w-12"
          >
            {{ currentPage  }}
          </button>
          <button
          @click ="changePage(currentPage + 1)"
          :disabled="currentPage  === totalPages"
            class="outline-1 outline-gray-400 rounded-lg h-12 w-12 disabled:text-gray-300 cursor-pointer disabled:outline-gray-300"
          >
            <i class="fa fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
