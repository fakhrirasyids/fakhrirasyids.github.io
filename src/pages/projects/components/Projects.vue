<template>
  <section id="projects" class="py-16 px-4 sm:px-6 min-h-screen">
    <div class="max-w-7xl mx-auto">

      <!-- Header -->
      <div class="text-center mb-12">
        <span class="inline-flex items-center gap-1.5 bg-brand-light/10 dark:bg-brand-dark/15 text-brand-light dark:text-brand-dark text-xs font-semibold tracking-widest uppercase rounded-full py-1.5 px-4 mb-5">
          {{ t('projects.label') }}
        </span>
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark leading-tight">
          {{ t('projects.title') }}
        </h2>
      </div>

      <!-- Platform quick-filter pills (always visible) -->
      <div class="flex flex-wrap justify-center gap-2 mb-8">
        <!-- All pill -->
        <button
          @click="selectedPlatforms = []"
          :class="[
            'px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
            selectedPlatforms.length === 0
              ? 'bg-brand-light dark:bg-brand-dark text-white shadow-md scale-105'
              : 'bg-onSurface-light dark:bg-onSurface-dark text-text-secondary-light dark:text-text-secondary-dark hover:scale-105'
          ]"
        >
          All
        </button>
        <button
          v-for="plat in availablePlatforms"
          :key="plat"
          @click="togglePlatform(plat)"
          :class="[
            'px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
            selectedPlatforms.includes(plat)
              ? 'bg-brand-light dark:bg-brand-dark text-white shadow-md scale-105'
              : 'bg-onSurface-light dark:bg-onSurface-dark text-text-secondary-light dark:text-text-secondary-dark hover:scale-105'
          ]"
        >
          {{ plat }}
        </button>
      </div>

      <!-- Count + Desktop tech-filter toggle -->
      <div class="flex items-center justify-between mb-6 gap-3">
        <span class="text-xs text-text-muted-light dark:text-text-muted-dark">
          {{ t('projects.showing', { shown: shownCount, total: totalCount }) }}
        </span>
        <div class="flex items-center gap-2">
          <!-- Clear (only when active) -->
          <button
            v-if="hasActiveFilters"
            @click="clearAll"
            class="text-xs px-3 py-1.5 rounded-full border border-red-400 dark:border-red-500 text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition-all duration-200"
          >
            {{ t('projects.clear') }}
          </button>
          <!-- Tech filter toggle (desktop) -->
          <button
            @click="showTechFilter = !showTechFilter"
            :class="[
              'hidden sm:flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full border transition-all duration-200',
              showTechFilter
                ? 'bg-brand-light dark:bg-brand-dark text-white border-brand-light dark:border-brand-dark'
                : 'border-onSurface-light dark:border-onSurface-dark text-text-secondary-light dark:text-text-secondary-dark hover:border-brand-light dark:hover:border-brand-dark'
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            {{ t('projects.technologies') }}
          </button>
          <!-- Mobile filter btn -->
          <button
            @click="openMobileFilter"
            class="sm:hidden flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full border border-onSurface-light dark:border-onSurface-dark text-text-secondary-light dark:text-text-secondary-dark"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            {{ t('projects.filter') }}
            <span v-if="hasActiveFilters" class="w-2 h-2 rounded-full bg-brand-light dark:bg-brand-dark"></span>
          </button>
        </div>
      </div>

      <!-- Desktop tech chips (collapsible) -->
      <transition name="slide-fade">
        <div v-if="showTechFilter" class="hidden sm:flex flex-wrap gap-2 mb-6 p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border border-onSurface-light/40 dark:border-onSurface-dark/40">
          <button
            v-for="tech in availableTechnologies"
            :key="tech"
            @click="toggleTech(tech)"
            :class="[
              'px-3 py-1 rounded-full text-xs font-medium transition-all duration-150',
              selectedTechnologies.includes(tech)
                ? 'bg-brand-light dark:bg-brand-dark text-white'
                : 'bg-onSurface-light dark:bg-onSurface-dark text-text-secondary-light dark:text-text-secondary-dark hover:bg-brand-light/10 dark:hover:bg-brand-dark/20'
            ]"
          >
            {{ tech }}
          </button>
        </div>
      </transition>

      <!-- Project Grid -->
      <TransitionGroup
        name="cards"
        tag="div"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <button
          v-for="(project, i) in filteredProjects"
          :key="project.id"
          @click="openDetail(project)"
          class="group text-left rounded-2xl overflow-hidden bg-surface-light dark:bg-surfaceVariant-dark border border-onSurface-light/50 dark:border-onSurface-dark/50 hover:border-brand-light/40 dark:hover:border-brand-dark/40 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light dark:focus-visible:ring-brand-dark"
        >
          <!-- Thumbnail -->
          <div class="relative overflow-hidden bg-background-light dark:bg-surface-dark h-44">
            <img
              :src="project.image"
              :alt="project.name"
              :loading="i < 6 ? 'eager' : 'lazy'"
              :fetchpriority="i < 6 ? 'high' : 'auto'"
              decoding="async"
              class="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            />
            <!-- Platform badges overlay -->
            <div class="absolute top-2 right-2 flex flex-wrap gap-1 justify-end">
              <span
                v-for="plat in project.platforms"
                :key="plat"
                class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/40 dark:bg-white/10 backdrop-blur-sm text-white"
              >
                {{ plat }}
              </span>
            </div>
          </div>

          <!-- Body -->
          <div class="p-4 flex flex-col gap-3">
            <div>
              <h3 class="font-semibold text-sm text-text-primary-light dark:text-text-primary-dark line-clamp-2 leading-snug">
                {{ project.name }}
              </h3>
              <p class="text-xs mt-1.5 text-text-muted-light dark:text-text-muted-dark line-clamp-2 leading-relaxed">
                {{ project.i18nKey ? t(project.i18nKey) : project.description }}
              </p>
            </div>

            <!-- Tech chips -->
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="(tech, ti) in project.technologies.slice(0, 4)"
                :key="ti"
                class="text-[10px] px-2 py-0.5 rounded-full bg-onSurface-light dark:bg-onSurface-dark text-text-secondary-light dark:text-text-secondary-dark"
              >
                {{ tech }}
              </span>
              <span
                v-if="project.technologies.length > 4"
                class="text-[10px] px-2 py-0.5 rounded-full bg-brand-light/10 dark:bg-brand-dark/15 text-brand-light dark:text-brand-dark font-medium"
              >
                +{{ project.technologies.length - 4 }}
              </span>
            </div>

            <!-- CTA hint -->
            <div class="flex items-center gap-1 text-[11px] font-medium text-brand-light dark:text-brand-dark mt-auto pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span>{{ t('projects.click_full_detail') }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>
        </button>
      </TransitionGroup>

      <!-- Empty state -->
      <div
        v-if="filteredProjects.length === 0"
        class="text-center py-20"
      >
        <div class="text-4xl mb-3">🔍</div>
        <p class="text-sm text-text-muted-light dark:text-text-muted-dark">{{ t('projects.none') }}</p>
        <button @click="clearAll" class="mt-4 text-xs text-brand-light dark:text-brand-dark underline underline-offset-2">
          {{ t('projects.clear') }}
        </button>
      </div>
    </div>

    <!-- Mobile filter sheet -->
    <transition name="overlay-fade">
      <div
        v-if="isMobileFilterOpen"
        class="fixed inset-0 z-[60] sm:hidden"
        role="dialog"
        aria-modal="true"
        @keydown.esc="closeMobileFilter"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-[2px]" @click="closeMobileFilter"></div>
        <transition name="sheet-up">
          <div
            v-show="isMobileFilterOpen"
            class="absolute inset-x-0 bottom-0 max-h-[80vh] rounded-t-2xl bg-surface-light dark:bg-surface-dark border-t border-onSurface-light/30 dark:border-onSurface-dark/30 shadow-2xl overflow-y-auto"
            ref="sheetEl"
            tabindex="-1"
          >
            <!-- Handle -->
            <div class="flex justify-center pt-3 pb-1">
              <div class="w-10 h-1 rounded-full bg-onSurface-light dark:bg-onSurface-dark"></div>
            </div>

            <!-- Header -->
            <div class="flex items-center justify-between px-5 py-3 border-b border-onSurface-light/20 dark:border-onSurface-dark/20">
              <span class="font-semibold text-sm text-text-primary-light dark:text-text-primary-dark">{{ t('projects.filter') }}</span>
              <div class="flex gap-2">
                <button
                  @click="clearAll"
                  class="text-xs px-3 py-1.5 rounded-full border border-red-400 text-red-500 hover:bg-red-500 hover:text-white transition"
                >
                  {{ t('projects.clear') }}
                </button>
                <button
                  @click="closeMobileFilter"
                  class="text-xs px-3 py-1.5 rounded-full bg-brand-light dark:bg-brand-dark text-white"
                >
                  {{ t('projects.apply') }}
                </button>
              </div>
            </div>

            <!-- Platform -->
            <div class="px-5 pt-4 pb-2">
              <p class="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-widest mb-3">{{ t('projects.platform') }}</p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="plat in availablePlatforms"
                  :key="plat"
                  @click="togglePlatform(plat)"
                  :class="[
                    'px-3.5 py-1.5 rounded-full text-xs font-medium transition',
                    selectedPlatforms.includes(plat)
                      ? 'bg-brand-light dark:bg-brand-dark text-white'
                      : 'bg-onSurface-light dark:bg-onSurface-dark text-text-secondary-light dark:text-text-secondary-dark'
                  ]"
                >
                  {{ plat }}
                </button>
              </div>
            </div>

            <!-- Technologies -->
            <div class="px-5 pt-4 pb-8">
              <p class="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-widest mb-3">{{ t('projects.technologies') }}</p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="tech in availableTechnologies"
                  :key="tech"
                  @click="toggleTech(tech)"
                  :class="[
                    'px-3.5 py-1.5 rounded-full text-xs font-medium transition',
                    selectedTechnologies.includes(tech)
                      ? 'bg-brand-light dark:bg-brand-dark text-white'
                      : 'bg-onSurface-light dark:bg-onSurface-dark text-text-secondary-light dark:text-text-secondary-dark'
                  ]"
                >
                  {{ tech }}
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <!-- Project Detail Modal -->
    <ProjectDetail
      :open="!!selectedProject"
      :project="selectedProject"
      @update:open="(v) => { if (!v) selectedProject = null }"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Project } from '@/types/projects'
import { projects as projectsData } from '@/data/projects'
import ProjectDetail from './ProjectDetail.vue'

const { t } = useI18n()

const allProjects = ref<Project[]>([...projectsData])
const selectedProject = ref<Project | null>(null)
const showTechFilter = ref(false)
const isMobileFilterOpen = ref(false)
const sheetEl = ref<HTMLElement | null>(null)

const selectedTechnologies = ref<string[]>([])
const selectedPlatforms = ref<string[]>([])

const availableTechnologies = computed(() => {
  const set = new Set<string>()
  allProjects.value.forEach(p => p.technologies.forEach(t => set.add(t)))
  return Array.from(set).sort()
})

const availablePlatforms = computed(() => {
  const set = new Set<string>()
  allProjects.value.forEach(p => p.platforms.forEach(pl => set.add(pl)))
  return Array.from(set).sort()
})

const filteredProjects = computed(() =>
  allProjects.value.filter(p => {
    const okTech = selectedTechnologies.value.length === 0 || p.technologies.some(t => selectedTechnologies.value.includes(t))
    const okPlat = selectedPlatforms.value.length === 0 || p.platforms.some(pl => selectedPlatforms.value.includes(pl))
    return okTech && okPlat
  })
)

const totalCount = computed(() => allProjects.value.length)
const shownCount = computed(() => filteredProjects.value.length)
const hasActiveFilters = computed(() => selectedTechnologies.value.length > 0 || selectedPlatforms.value.length > 0)

function toggleTech(tech: string) {
  selectedTechnologies.value = selectedTechnologies.value.includes(tech)
    ? selectedTechnologies.value.filter(x => x !== tech)
    : [...selectedTechnologies.value, tech]
}

function togglePlatform(plat: string) {
  selectedPlatforms.value = selectedPlatforms.value.includes(plat)
    ? selectedPlatforms.value.filter(x => x !== plat)
    : [...selectedPlatforms.value, plat]
}

function clearAll() {
  selectedTechnologies.value = []
  selectedPlatforms.value = []
}

function openDetail(p: Project) {
  selectedProject.value = p
}

function openMobileFilter() {
  isMobileFilterOpen.value = true
}
function closeMobileFilter() {
  isMobileFilterOpen.value = false
}

watch(isMobileFilterOpen, async (open) => {
  if (open) {
    document.documentElement.style.overflow = 'hidden'
    await nextTick()
    sheetEl.value?.focus()
  } else {
    document.documentElement.style.overflow = ''
  }
})

let mq: MediaQueryList | null = null
const mqHandler = () => { if (!mq?.matches) closeMobileFilter() }

onMounted(() => {
  document.documentElement.style.overflow = ''
  mq = window.matchMedia('(max-width: 639px)')
  mq.addEventListener('change', mqHandler)
})

onBeforeUnmount(() => {
  document.documentElement.style.overflow = ''
  mq?.removeEventListener('change', mqHandler)
})
</script>

<style scoped>
/* Card grid animation */
.cards-move,
.cards-enter-active,
.cards-leave-active {
  transition: all 0.3s ease;
}
.cards-enter-from,
.cards-leave-to {
  opacity: 0;
  transform: scale(0.97) translateY(8px);
}
.cards-leave-active {
  position: absolute;
}

/* Tech panel slide */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.2s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Overlay fade */
.overlay-fade-enter-active,
.overlay-fade-leave-active { transition: opacity 0.2s ease; }
.overlay-fade-enter-from,
.overlay-fade-leave-to { opacity: 0; }

/* Sheet slide up */
.sheet-up-enter-active,
.sheet-up-leave-active { transition: transform 0.25s ease, opacity 0.25s ease; }
.sheet-up-enter-from,
.sheet-up-leave-to { transform: translateY(20px); opacity: 0; }
</style>
