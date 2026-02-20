<script setup>
import AdminSidebar from '../../components/AdminSidebar.vue';

</script>


<template>
        <div class="min-h-screen flex mx-auto">
            <AdminSidebar/>
            <RouterView></RouterView>
        </div>
</template>