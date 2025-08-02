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
  { name: 'Kotlin', icon: '/assets/icons/asset-kotlin-icon.svg' },
  { name: 'Java', icon: '/assets/icons/asset-java-icon.svg' },
  { name: 'Jetpack Compose', icon: '/assets/icons/asset-jetpack-compose-icon.svg' },
  { name: 'Dart', icon: '/assets/icons/asset-dart-icon.svg' },
  { name: 'Flutter', icon: '/assets/icons/asset-flutter-icon.svg' },
  { name: 'Swift', icon: '/assets/icons/asset-swift-icon.svg' },
  { name: 'Javascript', icon: '/assets/icons/asset-javascript-icon.svg' },
  { name: 'React Native', icon: '/assets/icons/asset-react-native-icon.svg' },
  { name: 'Typescript', icon: '/assets/icons/asset-typescript-icon.svg' },
  { name: 'Vue', icon: '/assets/icons/asset-vue-icon.svg' },
  { name: 'Spring', icon: '/assets/icons/asset-spring-icon.svg' },
  { name: 'PHP', icon: '/assets/icons/asset-php-icon.svg' },
  { name: 'Laravel', icon: '/assets/icons/asset-laravel-icon.svg' },
  { name: 'PostgreSQL', icon: '/assets/icons/asset-postgresql-icon.svg' },
  { name: 'Git', icon: '/assets/icons/asset-git-icon.svg' },
  { name: 'Firebase', icon: '/assets/icons/asset-firebase-icon.svg' },
]
</script>
