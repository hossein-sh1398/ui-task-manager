<template>
    <div class=" container-fluid">
        <Header />
    </div>
    <div class="container mt-3">
        <router-view></router-view>
    </div>
</template>


<script setup>
import Header from './components/Header.vue';


</script>


<style scoped></style>
