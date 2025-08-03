<template>
  <div>
    <LoadingPage />
    <router-view />
  </div>
</template>

<script setup>
import LoadingPage from '@/pages/loading/LoadingPage.vue'
</script>
