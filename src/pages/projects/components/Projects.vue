<template>
  <section id="projects" class="py-12 px-6">
    <div class="max-w-7xl mx-auto">
      <!-- Section Label -->
      <div class="text-center">
        <span
          class="bg-onSurface-light dark:bg-onSurface-dark text-text-secondary-light dark:text-text-secondary-dark text-xs tracking-widest rounded-full py-2 px-3"
        >
          {{ t('projects.label') }}
        </span>
      </div>

      <!-- Title -->
      <h2
        class="text-l md:text-xl font-medium mb-8 text-text-primary-light dark:text-text-primary-dark py-4 text-center mt-6"
      >
        {{ t('projects.title') }}
      </h2>

      <!-- Mobile: count (left) + Filter toggle (right) -->
      <div class="flex items-center justify-between gap-4 mb-4 sm:hidden">
        <span class="text-xs text-text-primary-light dark:text-text-primary-dark">
          {{ t('projects.showing', { shown: shownCount, total: totalCount }) }}
        </span>
        <button
          @click="openFilter()"
          class="p-2 border rounded text-sm text-text-primary-light dark:text-text-primary-dark border-onSurface-light/50 dark:border-onSurface-dark/50"
          aria-haspopup="dialog"
          :aria-expanded="isFilterOpen"
          :aria-controls="'mobile-filter-sheet'"
        >
          {{ isFilterOpen ? '✖' : '🔍' }} {{ t('projects.filter') }}
        </button>
      </div>

      <!-- DESKTOP: Global top bar (same hierarchy for sidebar + grid) -->
      <div class="hidden sm:flex items-center justify-end mb-4">
        <span class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
          {{ t('projects.showing', { shown: shownCount, total: totalCount }) }}
        </span>
      </div>

      <!-- Desktop layout -->
      <div class="flex flex-col sm:flex-row gap-6">
        <!-- Filter Sidebar (Desktop) -->
        <aside class="hidden sm:block w-full sm:w-1/5 space-y-6">
          <FilterPanel
            :availableTechnologies="availableTechnologies"
            :availablePlatforms="availablePlatforms"
            v-model:selectedTechnologies="selectedTechnologies"
            v-model:selectedPlatforms="selectedPlatforms"
          />
        </aside>

        <!-- Right column (desktop): grid only -->
        <div class="w-full sm:w-4/5">
          <!-- Project Cards -->
          <div class="grid md:grid-cols-2 grid-cols-1 gap-6">
            <RouterLink
              v-for="project in filteredProjects"
              :key="project.id"
              class="rounded-xl shadow-md overflow-hidden bg-background-light dark:bg-surfaceVariant-dark block"
              :to="{ name: 'ProjectDetail', params: { id: project.id } }"
            >
              <!-- Image -->
              <div class="bg-surface-light dark:bg-surface-dark p-4 h-48 flex items-center justify-center">
                <img :src="project.image" :alt="project.name" class="h-full w-auto object-contain rounded-lg" />
              </div>

              <!-- Content -->
              <div class="p-4 flex flex-col h-[200px]">
                <h3 class="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                  {{ project.name }}
                </h3>
                <p class="text-sm mt-2 text-text-secondary-light dark:text-text-secondary-dark line-clamp-3">
                  {{ project.i18nKey ? t(project.i18nKey) : project.description }}
                </p>
                <div class="flex gap-2 text-xs mt-auto flex-wrap mt-3">
                  <span
                    v-for="(tech, techIndex) in project.technologies"
                    :key="techIndex"
                    class="bg-onSurface-light dark:bg-onSurface-dark text-text-secondary-light dark:text-text-secondary-dark px-2 py-1 rounded"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>
            </RouterLink>
          </div>

          <!-- No Projects -->
          <div
            v-if="filteredProjects.length === 0"
            class="text-center text-sm mt-10 text-text-secondary-light dark:text-text-secondary-dark"
          >
            {{ t('projects.none') }}
          </div>
        </div>
      </div>
    </div>

    <!-- ===== MOBILE OVERLAY FILTER (Sheet) ===== -->
    <transition name="overlay-fade">
      <div
        v-if="isFilterOpen"
        class="fixed inset-0 z-[60] sm:hidden"
        role="dialog"
        :aria-labelledby="'mobile-filter-title'"
        :aria-modal="true"
        id="mobile-filter-sheet"
        @keydown.esc="closeFilter"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-[1px]" @click="closeFilter"></div>

        <!-- Sheet -->
        <transition name="sheet-up">
          <div
            v-show="isFilterOpen"
            class="absolute inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl
                   bg-surface-light dark:bg-surface-dark
                   border-t border-onSurface-light/40 dark:border-onSurface-dark/40
                   shadow-2xl p-4 overflow-y-auto"
            ref="sheetEl"
            tabindex="-1"
          >
            <!-- Sheet header -->
            <div class="flex items-center justify-between pb-3 border-b border-onSurface-light/30 dark:border-onSurface-dark/30">
              <div class="flex items-center gap-2">
                <span class="text-lg font-medium text-text-primary-light dark:text-text-primary-dark" id="mobile-filter-title">
                  {{ t('projects.filter') }}
                </span>
                <span class="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  · {{ t('projects.showing', { shown: shownCount, total: totalCount }) }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <!-- Clear button - red -->
                <button
                  class="text-sm px-3 py-1.5 rounded-lg border border-red-600 dark:border-red-400
                         bg-red-500 hover:bg-red-600
                         text-white transition"
                  @click="clearAll"
                >
                  {{ t('projects.clear') }}
                </button>

                <!-- Apply button - green -->
                <button
                  class="text-sm px-3 py-1.5 rounded-lg border border-green-600 dark:border-green-400
                         bg-green-500 hover:bg-green-600
                         text-white transition"
                  @click="closeFilter"
                >
                  {{ t('projects.apply') }}
                </button>
              </div>
            </div>

            <!-- Filter body -->
            <div class="pt-4">
              <FilterPanel
                :availableTechnologies="availableTechnologies"
                :availablePlatforms="availablePlatforms"
                v-model:selectedTechnologies="selectedTechnologies"
                v-model:selectedPlatforms="selectedPlatforms"
              />
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import FilterPanel from '@/components/FilterPanel.vue'
import { useI18n } from 'vue-i18n'
import type { Project } from '@/types/projects'
import { projects as projectsData } from '@/data/projects'

const { t } = useI18n()

// data
const allProjects = ref<Project[]>([...projectsData])

// filter sheet state
const isFilterOpen = ref(false)
const sheetEl = ref<HTMLElement | null>(null)
const previouslyFocused = ref<HTMLElement | null>(null)

const selectedTechnologies = ref<string[]>([])
const selectedPlatforms = ref<string[]>([])

const availableTechnologies = computed(() => {
  const set = new Set<string>()
  allProjects.value.forEach(p => p.technologies.forEach(t => set.add(t)))
  return Array.from(set).sort()
})

const availablePlatforms = computed(() => {
  const set = new Set<string>()
  allProjects.value.forEach(p => p.platforms.forEach(t => set.add(t)))
  return Array.from(set).sort()
})

const filteredProjects = computed(() => {
  return allProjects.value.filter(project => {
    const matchesTech =
      selectedTechnologies.value.length === 0 ||
      project.technologies.some(tech => selectedTechnologies.value.includes(tech))

    const matchesPlatform =
      selectedPlatforms.value.length === 0 ||
      project.platforms.some(plat => selectedPlatforms.value.includes(plat))

    return matchesTech && matchesPlatform
  })
})

const totalCount = computed(() => allProjects.value.length)
const shownCount = computed(() => filteredProjects.value.length)

// --- Mobile filter sheet controls ---
function lockScroll() { document.documentElement.style.overflow = 'hidden' }
function unlockScroll() { document.documentElement.style.overflow = '' }
function openFilter() { previouslyFocused.value = document.activeElement as HTMLElement; isFilterOpen.value = true }
function closeFilter() { isFilterOpen.value = false }

watch(isFilterOpen, async (open) => {
  if (open) { lockScroll(); await nextTick(); sheetEl.value?.focus() }
  else { unlockScroll(); previouslyFocused.value?.focus?.() }
})

onMounted(() => { unlockScroll() })
onBeforeUnmount(() => { unlockScroll() })

function clearAll() {
  selectedTechnologies.value = []
  selectedPlatforms.value = []
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Fades backdrop */
.overlay-fade-enter-active,
.overlay-fade-leave-active { transition: opacity 0.2s ease; }
.overlay-fade-enter-from,
.overlay-fade-leave-to { opacity: 0; }

/* Sheet slides up */
.sheet-up-enter-active,
.sheet-up-leave-active { transition: transform 0.25s ease, opacity 0.25s ease; }
.sheet-up-enter-from,
.sheet-up-leave-to { transform: translateY(12px); opacity: 0; }
</style>
