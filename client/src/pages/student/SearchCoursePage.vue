<script setup>
import { ref, computed, watchEffect, onMounted } from "vue";
import CourseCard from "../../components/CourseCard.vue";
import { useRoute, useRouter } from "vue-router";
import { searchCourseAPI } from "../../helpers/api";
import axios from "axios";
const showAll = ref(false);
const route = useRoute();

const router = useRouter();
const languages = ref([
  { lang: "English", flag: "gb" },
  { lang: "Brazilian Portuguese", flag: "br" },
  { lang: "Chinese", flag: "cn" },
  { lang: "Spanish", flag: "es" },
  { lang: "French", flag: "fr" },
  { lang: "German", flag: "de" },
  { lang: "Japanese", flag: "jp" },
  { lang: "Korean", flag: "kr" },
  { lang: "Russian", flag: "ru" },
  { lang: "Arabic", flag: "sa" },
  { lang: "Hindi", flag: "in" },
  { lang: "Vietnamese", flag: "vn" },
  { lang: "Italian", flag: "it" },
  { lang: "Turkish", flag: "tr" },
  { lang: "Dutch", flag: "nl" },
  { lang: "Thai", flag: "th" },
  { lang: "Polish", flag: "pl" },
  { lang: "Swedish", flag: "se" },
  { lang: "Greek", flag: "gr" },
  { lang: "Hebrew", flag: "il" },
]);

const displayedLanguages = computed(() => {
  return showAll.value ? languages.value : languages.value.slice(0, 4);
});
const api = "http://localhost:3000/api/"
const searchResults = ref([]);
const level = ref([]);
const priceType = ref("");
const currentPage = ref(1)
const totalPages = ref(1)
const totalProducts = ref(0)
const limit = ref(9)
const displaySearch = async () => {
  let q = `${api}courses/search?query=${route.query.query}&page=${currentPage.value}&limit=${limit.value}`
  if (!route.query.query) return;
  try {
    if (level.value !== "") {
       q = q + `&level=${level.value}`
    }
    if (priceType.value !== "") {
      q = q + `&priceType=${priceType.value}`
    }
    
    console.log(priceType.value)
    console.log(level.value)
    const response = await axios.get(q)
    totalPages.value = response.data.totalPages
    currentPage.value = response.data.currentPage
    totalProducts.value = response.data.totalCourse
    console.log("Total pages: " + totalPages.value )
    console.log("Current page: " + currentPage.value )
    console.log("Total products " + totalProducts.value)
    
    console.log(q)

    searchResults.value = response.data.course;
    console.log(response);
    console.log(searchResults.value);
  } catch (e) {
    console.log(e);
  }
};

const changePage = (newPage) => {
  try{
      if (newPage > 0  && newPage <= totalPages.value) {
          currentPage.value = newPage
          console.log(currentPage.value)
           displaySearch()
      }
    } catch (err) {
      console.log(err)
    }
}

const handleNavigation = function (id) {
  // courseId.value = id
  // console.log(courseId.value)
  try {
    router.push({
      path: `/course/${id}`,
    });
  } catch (e) {
    console.error(`Error ${e}`);
  }
};

watchEffect((route.query.query, displaySearch));

onMounted(() => {
  displaySearch();
});


const open = ref(false);

const openFilter = function () {
  open.value = !open.value;
};
</script>

<template>
  <button
    @click="openFilter"
    class="bg-green-500 mx-auto  rounded-full hover:bg-black cursor-pointer text-white p-3 mt-5 ml-4"
  >
    Filter
  </button>
  <div class="w-full  flex relative mx-auto ">
    <Transition name="slide-in"
    enter-from-class="-translate-x-full opacity-0"
    enter-active-class="transition duration-500 ease-out"
    leave-to-class="-translate-x-full opacity-100"
    leave-active-class="transition duration-500 ease-out">
    <div
      v-if="open"
      class="md:w-1/4  absolute bottom-0.5 z-1000 modal-overlay   p-8 max-[900px]:hidden 
      md:block shadow-xl overflow-auto  "
    >
    <div class="flex justify-between items-center">
      <p class="font-bold text-lg">Filter By</p>
      <i class="fa-solid fa-x hover:text-red-500 cursor-pointer" @click="openFilter"></i>
      </div>
      <br />
      <div class="flex flex-col">
        <p class="font-bold text-lg mb-2">Rating</p>
        <div class="flex flex-col">
          <div class="flex gap-3">
            <input type="radio" name="rating" value="over_5" />
            <label for="rating">
              Over 4.5 <i class="fa-solid fa-star text-yellow-300"></i>
            </label>
          </div>
          <div class="flex gap-3">
            <input type="radio" name="rating" value="over_4" />
            <label for="rating">
              Over 4 <i class="fa-solid fa-star text-yellow-300"></i>
            </label>
          </div>
          <div class="flex gap-3">
            <input type="radio" name="rating" value="over_3.5" />
            <label for="rating">
              Over 3.5 <i class="fa-solid fa-star text-yellow-300"></i>
            </label>
          </div>
        </div>
        <br />

        <p class="font-bold text-lg mb-2">Language</p>
        <div
          v-for="(language, index) in displayedLanguages"
          class="flex flex-col"
        >
          <div class="flex gap-3">
            <input type="checkbox" />
            <label for="language"
              >{{ language.lang }}
              <span :class="`fi fi-${language.flag}`"></span
            ></label>
          </div>
        </div>

        <button
          @click="showAll = !showAll"
          class="underline text-left cursor-pointer text-blue-600 hover:text-blue-700"
        >
          {{ showAll ? "Show Less" : "Show More" }}
        </button>

        <br />

        <p class="font-bold mb-2 text-lg">Level</p>
        <div class="flex gap-3">
          <input type="checkbox" id="beginner" v-model="level" value="Beginner"/>
          <label for="level" > Beginner </label>
        </div>
        <div class="flex gap-3">
          <input type="checkbox" id="intermediate" v-model="level" value = "Intermediate" />
          <label for="level"> Intermediate</label>
        </div>
        <div class="flex gap-3">
          <input type="checkbox" id="advanced" v-model="level"  value="Advanced" />
          <label for="level"> Advanced</label>
        </div>

        <br />
        <p class="font-bold mb-2 text-lg">Price</p>
        <div class="flex gap-3">
          <input type="radio" id="free" value="Free" v-model="priceType" name="priceType"/>
          <label for="level"> Free</label>
        </div>
        <div class="flex gap-3">
          <input type="radio" id="paid" value="Paid" v-model="priceType" name="priceType"/>
          <label for="level"> Paid</label>
        </div>

        <!-- <div>
          <button class=" p-2 px-4 mt-3 rounded-full font-semibold bg-green-500 shadow-lg"> Apply </button>
        </div> -->
      </div>
    </div>
    </Transition>

    <div class="max-w-screen p-8 mx-auto overflow-y-auto">
      <p class="font-bold text-lg">Result for "{{ route.query.query }}"</p>
      <p class="font-medium text-lg">
        Showing {{ totalProducts}} result(s)
      </p>
      <div
        v-if="searchResults.length > 0"
        class="grid md:grid-cols-3 sm:grid-cols-1 gap-4"
      >
        <CourseCard
        class="w-100 h-50"
          v-for="course in searchResults"
          :key="course._id"
          :price="course.price"
          :title="course.title"
          :description="course.description"
          :lecturer="course.lecturer"
          :images="course.courseImage"
          @click="handleNavigation(course._id)"
        />
      </div>

      <div v-else class="z-1">
        <p class="font-bold text-lg ">
          Sorry, we couldn’t find any results for "{{ `${route.query.query}` }}"
        </p>

        <ul class="p-3 list-disc">
          <li>Make sure all words are spelled correctly</li>
          <li>Try a different search term</li>
          <li>Try more general search terms</li>
        </ul>
      </div>
    </div>
    
  </div>
  <div class="flex mx-auto justify-center items-center space-y-2 mb-2">
      <div class="flex justify-evenly gap-3">
        <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1" 
        class=" bg-green-500 w-12 h-12 hover:bg-white hover:text-green-500 cursor-pointer transition duration-300 text-white outline-1 outline-green-300 p-3 rounded-full">
            <i class="fa fa-arrow-left"></i>
        </button>
         <span class="flex self-center">
          {{ currentPage }}
         </span>
          <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class=" bg-green-500 hover:bg-white hover:text-green-500 cursor-pointer transition duration-300 text-white w-12 h-12 outline-1 outline-green-300 p-3 rounded-full">
            <i class="fa fa-arrow-right"></i>
        </button>
      </div>
    </div>
</template>

<style lang="css" scoped>
.modal-overlay {
    position: fixed;
    top:0;
    left:0;
    background-color: rgb(255, 255, 255);
}
</style>