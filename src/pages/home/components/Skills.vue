<template>
  <section class="py-12 px-6">
    <div class="max-w-5xl mx-auto text-center">
      <!-- Section label -->
      <div class="text-center">
        <span
          class="bg-onSurface-light dark:bg-onSurface-dark text-text-secondary-light dark:text-text-secondary-dark text-xs tracking-widest rounded-full py-2 px-3"
        >
          {{ $t('skills.label') }}
        </span>
      </div>

      <!-- Title -->
      <h2 class="text-l md:text-xl font-medium mb-8 text-text-primary-light dark:text-text-primary-dark py-4">
        {{ $t('skills.title') }}
      </h2>

      <!-- Skills grid -->
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 items-center justify-center">
        <div
          v-for="(skill, index) in skills"
          :key="index"
          class="flex flex-col items-center space-y-2"
        >
          <img :src="skill.icon" :alt="skill.name" class="w-10 h-10 object-contain" />
          <span class="text-xs text-text-secondary-light dark:text-text-secondary-dark">
            {{ skill.name }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const skills = [
  { name: 'Kotlin', icon: '/assets/vite.svg' },
  { name: 'Java', icon: '/assets/vite.svg' },
  { name: 'Jetpack Compose', icon: '/assets/vite.svg' },
  { name: 'Dart', icon: '/assets/vite.svg' },
  { name: 'Flutter', icon: '/assets/vite.svg' },
  { name: 'Swift', icon: '/assets/vite.svg' },
  { name: 'Javascript', icon: '/assets/vite.svg' },
  { name: 'React Native', icon: '/assets/vite.svg' },
  { name: 'Typescript', icon: '/assets/vite.svg' },
  { name: 'Vue', icon: '/assets/vite.svg' },
  { name: 'Spring', icon: '/assets/vite.svg' },
  { name: 'PHP', icon: '/assets/vite.svg' },
  { name: 'Laravel', icon: '/assets/vite.svg' },
  { name: 'Postgre', icon: '/assets/vite.svg' },
  { name: 'Git', icon: '/assets/vite.svg' },
  { name: 'Firebase', icon: '/assets/vite.svg' },
]
</script>
