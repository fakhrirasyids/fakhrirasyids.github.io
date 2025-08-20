<template>
  <div
    class="filter-panel space-y-4 rounded-xl p-4 bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark border border-onSurface-light/40 dark:border-onSurface-dark/40"
  >
    <!-- Platforms -->
    <div>
      <h4 class="text-sm font-semibold mb-2 text-text-secondary-light dark:text-text-secondary-dark">
        {{ t('projects.platform') }}
      </h4>
      <div class="flex flex-col gap-1.5">
        <label
          v-for="plat in availablePlatforms"
          :key="plat"
          class="flex items-center gap-3 cursor-pointer select-none px-2 py-1 rounded-lg hover:bg-onSurface-light/50 dark:hover:bg-onSurface-dark/40 transition"
        >
          <input
            type="checkbox"
            class="h-4 w-4 accent-blue-600 dark:accent-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            :checked="isSelectedPlatform(plat)"
            @change.prevent="togglePlatform(plat)"
          />
          <span class="text-sm">{{ plat }}</span>
        </label>
      </div>
    </div>

    <!-- Technologies -->
    <div>
      <h4 class="text-sm font-semibold mb-2 text-text-secondary-light dark:text-text-secondary-dark">
        {{ t('projects.technologies') }}
      </h4>
      <div class="flex flex-col gap-1.5">
        <label
          v-for="tech in availableTechnologies"
          :key="tech"
          class="flex items-center gap-3 cursor-pointer select-none px-2 py-1 rounded-lg hover:bg-onSurface-light/50 dark:hover:bg-onSurface-dark/40 transition"
        >
          <input
            type="checkbox"
            class="h-4 w-4 accent-blue-600 dark:accent-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            :checked="isSelectedTech(tech)"
            @change.prevent="toggleTech(tech)"
          />
          <span class="text-sm">{{ tech }}</span>
        </label>
      </div>
    </div>

    <!-- Clear -->
    <div class="pt-2">
      <button
        type="button"
        class="px-3 py-2 text-sm rounded-lg border shadow-sm transition w-full
              bg-red-500 hover:bg-red-600
              text-white
              border-red-600 dark:border-red-400"
        @click="clearAll"
      >
        {{ t('projects.clear') }}
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps<{
  availableTechnologies: string[]
  availablePlatforms: string[]
  selectedTechnologies: string[]
  selectedPlatforms: string[]
}>()

const emit = defineEmits<{
  (e: 'update:selectedTechnologies', v: string[]): void
  (e: 'update:selectedPlatforms', v: string[]): void
}>()

function isSelectedTech(t: string) {
  return props.selectedTechnologies.includes(t)
}
function isSelectedPlatform(p: string) {
  return props.selectedPlatforms.includes(p)
}

function toggleTech(t: string) {
  const next = isSelectedTech(t)
    ? props.selectedTechnologies.filter(x => x !== t)
    : [...props.selectedTechnologies, t]
  emit('update:selectedTechnologies', next)
}

function togglePlatform(p: string) {
  const next = isSelectedPlatform(p)
    ? props.selectedPlatforms.filter(x => x !== p)
    : [...props.selectedPlatforms, p]
  emit('update:selectedPlatforms', next)
}

function clearAll() {
  emit('update:selectedTechnologies', [])
  emit('update:selectedPlatforms', [])
}
</script>

<style scoped>
/* no fixed accent-color here so dark mode can adjust via Tailwind classes */
</style>
