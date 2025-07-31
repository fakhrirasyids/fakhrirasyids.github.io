<template>
  <div class="bg-background-light dark:bg-background-dark text-white font-sans">
    <Header />
    <Hero />
    <About />
    <Skills />
    <Experience />
    <Projects />
    <Contact />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from '@/pages/home/components/Header.vue'
import Hero from '@/pages/home/components/Hero.vue'
import About from '@/pages/home/components/About.vue'
import Skills from '@/pages/home/components/Skills.vue'
import Experience from '@/pages/home/components/Experience.vue'
import Projects from '@/pages/home/components/Projects.vue'
import Contact from '@/pages/home/components/Contact.vue'
import Footer from '@/pages/home/components/Footer.vue'
</script>
