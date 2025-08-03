<template>
  <div class="bg-background-light dark:bg-background-dark text-white font-sans">
    <Header />
    <RouterView />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
</script>