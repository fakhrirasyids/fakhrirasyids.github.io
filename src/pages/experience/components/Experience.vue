<template>
  <section id="experience" class="bg-surface-light dark:bg-surface-dark py-12 px-6">
    <div class="max-w-5xl mx-auto">
      <!-- Section Label -->
      <div class="text-center">
        <span
          class="bg-onSurface-light dark:bg-onSurface-dark text-text-secondary-light dark:text-text-secondary-dark text-xs tracking-widest rounded-full py-2 px-3"
        >
          {{ $t('experience.label') }}
        </span>
      </div>

      <!-- Title -->
      <h2 class="text-l md:text-xl font-medium mb-8 text-text-primary-light dark:text-text-primary-dark py-4 text-center mt-6">
        {{ $t('experience.title') }}
      </h2>

      <!-- Experience List -->
      <div class="space-y-6">
        <div
          v-for="(exp, index) in experiences"
          :key="index"
          class="flex flex-col md:flex-row md:items-start gap-4 bg-background-light dark:bg-surfaceVariant-dark p-5 rounded-xl shadow-sm"
        >
          <!-- Left: Company Logo -->
          <div class="flex-shrink-0 w-full md:w-20 flex justify-center md:justify-start">
            <div class="w-16 h-16 p-2 rounded-xl bg-transparent dark:bg-white flex items-center justify-center">
              <img
                :src="exp.logo"
                :alt="exp.company"
                class="w-14 h-14 object-contain"
              />
            </div>
          </div>

          <!-- Middle: Experience Content -->
          <div class="flex-1">
            <h3 class="text-base font-semibold text-text-primary-light dark:text-text-primary-dark">
              {{ exp.title }}
            </h3>
            <p class="text-sm text-text-muted-light dark:text-text-muted-dark mb-2">
              {{ exp.company }}
            </p>
            <ul class="list-disc list-outside pl-4 text-sm text-text-secondary-light dark:text-text-secondary-dark space-y-1">
              <li v-for="(task, i) in exp.responsibilities" :key="i">
                {{ task }}
              </li>
            </ul>
          </div>

          <!-- Right: Period and Location -->
          <div class="flex flex-col text-right justify-start items-end md:w-40 text-sm text-text-muted-light dark:text-text-muted-dark">
            <span>{{ exp.period }}</span>
            <span class="mt-1 text-xs text-text-secondary-light dark:text-text-secondary-dark">
              {{ exp.location }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { messages, locale } = useI18n()
const experiences = computed(() => messages.value[locale.value].experience.items)
</script>
