<template>
  <section class="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-center px-6">
    <div>
      <h1 class="text-6xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">404</h1>
      <p class="text-text-secondary-light dark:text-text-secondary-dark text-lg mb-6">
        {{ t('notfound.message') }}
      </p>
      <router-link
        to="/"
        class="inline-block px-4 py-2 rounded bg-inverted-light dark:bg-inverted-dark text-inverted-dark dark:text-inverted-light"
      >
        {{ t('notfound.go_home') }}
      </router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
