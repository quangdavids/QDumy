<script setup>




</script>

<template>
  
<div class="relative w-full h-100 overflow-hidden">
  <!-- Background Video -->
  <img src="/images/students/blonde.jpg" class="w-auto object-cover brightness-50">
  <!-- Overlay Content -->
  <div class="absolute inset-0 flex flex-col items-center justify-center gap-5 text-white text-center z-10">
    <h1 class="text-[30px] font-bold leading-tight">Our Vision</h1>
    <p class="text-[40px] leading-snug max-[700px]:text-[30px] sm:text-sm md:text-3xl">
        "Our vision is to make learning easy, fun, and possible for everyone — anytime, anywhere. We’re here to help you grow, chase your dreams, and become the best version of yourself." </p>
  </div>
</div>

<div class="flex  ">
<div class="text-center font-medium flex self-center mx-auto p-5 justify-center items-center max-w-150">
At QuangStudy, we team up with trusted universities and forward-thinking companies to make learning more accessible, engaging, and impactful. Whether you're exploring a new interest, building practical skills, or preparing for your dream job, we offer guided courses, hands-on projects, and career-focused programs designed to fit your life — and fuel your future.
</div>
<div class="max-w-full max-h-full max-[640px]:hidden   bg-gray-50">
<img src="/images/universities/uni.png" class="w-full h-auto object-center">
</div>
</div>

<div class="w-full  text-white">
    <div class="grid items-center max-[640px]:grid-cols-1  
    md:flex w-full gap-3 h-auto  font-bold text-3xl justify-around 
    p-15">
    <div class="border rounded-lg shadow bg-gray-50 text-green-500  p-10 max-[640px]:border-b-1 ">
        75+ Million Learners
    </div>

    <div class="border rounded-lg text-center text-green-500 bg-white  p-10 max-[640px]:border-b-1">
        31000+ Programs
    </div>

    <div class=" border rounded-lg text-center text-green-500 bg-white  p-10 ">
        50+ Partners 
    </div>
    </div>
</div>

<!-- <div class="w-full h-full flex sm:flex-col md:flex-row">
    <div class="w-1/2  sm:w-full flex flex-col items-center justify-center">
      <div class="flex flex-col justify-center items-center ">
        <span class="text-lg font-bold text-left">
          Our Story
        </span>
        <br />
        <span class="max-w-120 text-lg text-left w-full sm:w-screen">
            Driven by our mission to make quality education accessible to every learner, QuangStudy has dedicated years to developing innovative technology and engaging content that delivers impactful learning experiences at scale. Since our founding, we have partnered with leading educators and industry experts to build a dynamic online learning platform that empowers millions of students across Vietnam and beyond.

Under the guidance of our leadership team, QuangStudy continues to expand its reach, offering affordable, career-focused courses that help learners achieve their goals and unlock new opportunities. We are committed to transforming education and supporting lifelong learning in a rapidly changing world.
        </span>
        <br />
      </div>
      <button
        class="w-80 text-3xl hover:bg-green-500 hover:text-white cursor-pointer font-light transform duration-300 border border p-3"
      >
        View Courses
      </button>
    </div>
    <div class="w-1/2 sm:w-screen">
      <img
        src="/images/students/blonde.jpg"
        class=" w-screen h-150 object-cover "
      />
    </div>
  </div>

  <div class="w-full h-full flex">

    <div class="w-1/2">
      <img
        src="/images/students/alexa.png"
        class=" w-screen h-150 object-cover object-top"
      />
    </div>

      <div class="w-1/2 flex flex-col items-center justify-center">
      <div class="flex flex-col justify-center items-center">
        <span class="text-lg font-bold text-left">
          Collaborations
        </span>
        <br />
        <span class="max-w-120 text-lg text-left w-full">
            QuangStudy collaborates closely with a diverse range of prestigious universities, colleges, and industry-leading corporations to design and deliver customized learning solutions that address the evolving needs of today’s workforce. By leveraging these strong partnerships, QuangStudy ensures its courses are aligned with current industry standards and emerging trends, providing learners with relevant skills that boost their career readiness. These collaborations enable us to offer practical training programs, certification pathways, and real-world projects, fostering a bridge between academic knowledge and professional application that benefits both students and employers alike.


            </span>
        <br />
      </div>
      <button
        class="w-80 text-3xl hover:bg-green-500 hover:text-white cursor-pointer font-light transform duration-300 border border p-3"
      >
        View Courses
      </button>
    </div>
  </div> -->
  <!-- <div class="w-full p-3">
    <ProgressBar 
      :value="13.9" 
      class="h-4 custom-progress-bar"
    ></ProgressBar>
  </div> -->
  <div class="  w-full bg-green-500 text-white">
    <div class="flex flex-col items-center gap-4 text-center h-100 font-bold text-4xl self-center justify-center mx-auto">
        Join our community and get started now!
                <button class="font-medium text-[30px] border p-4 hover:border-black 
                hover:bg-white transform duration-300 cursor-pointer hover:text-green-500">
        Join Now
    </button>
    </div>
  </div>

</template>

<style lang="css" scoped>
.custom-progress-bar :deep(.p-progressbar-value) {
    background: #22c55e !important;
}

.custom-progress-bar :deep(.p-progressbar) {
    background: #f3f4f6 !important;
}
</style>