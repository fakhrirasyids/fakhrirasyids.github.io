<template>
  <header class="w-full px-6 py-4 flex justify-between items-center relative z-50">
    <!-- Logo -->
    <div class="text-2xl font-bold tracking-wide text-text-primary-light dark:text-text-primary-dark">
      &lt;fakhrirasyids /&gt;
    </div>

    <!-- Desktop Nav -->
    <nav class="hidden md:flex items-center space-x-6">
      <a
        href="#about"
        @click.prevent="scrollTo('#about')"
        class="text-text-muted-light dark:text-text-muted-dark hover:text-brand-light dark:hover:text-brand-dark transition"
      >
        About
      </a>
      <a
        href="#experience"
        @click.prevent="scrollTo('#experience')"
        class="text-text-muted-light dark:text-text-muted-dark hover:text-brand-light dark:hover:text-brand-dark transition"
      >
        Experience
      </a>
      <a
        href="#projects"
        @click.prevent="scrollTo('#projects')"
        class="text-text-muted-light dark:text-text-muted-dark hover:text-brand-light dark:hover:text-brand-dark transition"
      >
        Projects
      </a>
      <a
        href="#contact"
        @click.prevent="scrollTo('#contact')"
        class="text-text-muted-light dark:text-text-muted-dark hover:text-brand-light dark:hover:text-brand-dark transition"
      >
        Contact
      </a>

      <div class="w-px h-6 bg-border-light dark:bg-border-dark mx-4"></div>

      <!-- Theme Toggle (Desktop) -->
      <button
        @click="toggleDark"
        class="flex items-center justify-center w-10 h-10 hover:bg-border-light dark:hover:bg-border-dark rounded-full transition"
        aria-label="Toggle Theme"
      >
        <img
          :src="isDark ? '/assets/icons/asset-icon-light-mode.svg' : '/assets/icons/asset-icon-dark-mode.svg'"
          alt="Theme Icon"
          class="w-6 h-6"
        />
      </button>

      <!-- Download CV -->
      <a
        href="/cv.pdf"
        target="_blank"
        class="bg-inverted-light dark:bg-inverted-dark text-inverted-dark dark:text-inverted-light px-4 py-2 rounded-full font-medium hover:bg-border-light dark:hover:bg-border-dark transition"
      >
        Download CV
      </a>
    </nav>

    <!-- Mobile Nav Toggle -->
    <button
      class="md:hidden text-2xl z-50 text-text-primary-light dark:text-text-primary-dark"
      @click="isOpen = true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>


    <!-- Backdrop -->
    <transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        @click="isOpen = false"
      />
    </transition>

    <!-- Mobile Slide Menu -->
    <transition name="slide">
      <div
        v-if="isOpen"
        class="bg-surface-light dark:bg-surface-dark fixed top-0 right-0 h-full w-[80vw] max-w-sm bg-surface-dark text-text-primary-dark z-50 p-6 shadow-lg"
      >
        <div class="flex justify-between items-center">
          <div class="text-2xl font-bold tracking-wide text-text-primary-light dark:text-text-primary-dark">&lt;fakhrirasyids /&gt;</div>
          <button
            @click="isOpen = false"
            aria-label="Close"
            class="text-text-primary-light dark:text-text-primary-dark"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav class="flex flex-col gap-4 mt-6">
          <a href="#about" @click.prevent="scrollTo('#about')" class="text-text-muted-light dark:text-text-muted-dark hover:text-brand-light dark:hover:text-brand-dark">About</a>
          <a href="#experience" @click.prevent="scrollTo('#experience')" class="text-text-muted-light dark:text-text-muted-dark hover:text-brand-light dark:hover:text-brand-dark">Experience</a>
          <a href="#projects" @click.prevent="scrollTo('#projects')" class="text-text-muted-light dark:text-text-muted-dark hover:text-brand-light dark:hover:text-brand-dark">Projects</a>
          <a href="#contact" @click.prevent="scrollTo('#contact')" class="text-text-muted-light dark:text-text-muted-dark hover:text-brand-light dark:hover:text-brand-dark">Contact</a>

          <div class="h-px w-full bg-border-light dark:bg-border-dark my-4"></div>

          <!-- Theme Switch (Mobile) -->
          <button
            @click="toggleDark"
            class="flex items-center justify-between w-full hover:bg-border-dark rounded-lg transition"
            aria-label="Toggle Theme"
          >
            <span class="text-sm text-text-muted-light dark:text-text-muted-dark hover:text-brand-light dark:hover:text-brand-dark">Switch Theme</span>
            <img
              :src="isDark ? '/assets/icons/asset-icon-light-mode.svg' : '/assets/icons/asset-icon-dark-mode.svg'"
              alt="Theme Icon"
              class="w-6 h-6"
            />
          </button>

          <!-- CV -->
          <a
            href="/cv.pdf"
            target="_blank"
            class="mt-4 text-center bg-inverted-light dark:bg-inverted-dark text-inverted-dark dark:text-inverted-light px-4 py-2 rounded-full font-medium hover:bg-border-dark transition"
            @click="isOpen = false"
          >
            Download CV
          </a>
        </nav>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDarkMode } from '@/composables/useDarkMode'

const isOpen = ref(false)

function scrollTo(selector: string) {
  const el = document.querySelector(selector)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
    isOpen.value = false
  }
}

const { isDark, toggleDark } = useDarkMode()
</script>
