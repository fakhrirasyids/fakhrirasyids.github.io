<template>
  <teleport to="body">
    <transition name="overlay-fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[70] flex items-end sm:items-center justify-center"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="'project-detail-title'"
        @keydown.esc="close"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click="close"
        ></div>

        <!-- Panel -->
        <transition name="panel-rise">
          <div
            v-if="open"
            ref="panelEl"
            tabindex="-1"
            class="relative z-10 w-full sm:w-[min(720px,94vw)]
                   h-[92vh] sm:h-auto sm:max-h-[88vh]
                   rounded-t-3xl sm:rounded-3xl
                   bg-background-light dark:bg-surface-dark
                   shadow-2xl overflow-hidden flex flex-col
                   focus-visible:outline-none"
            @click.stop
          >
            <!-- ── Top image strip ── -->
            <div class="relative flex-shrink-0 bg-surface-light dark:bg-surfaceVariant-dark h-52 sm:h-64 flex items-center justify-center overflow-hidden">
              <img
                v-if="project?.image"
                :src="project.image"
                :alt="project?.name"
                class="h-full w-auto max-w-full object-contain p-6"
              />
              <!-- Gradient fade bottom -->
              <div class="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background-light dark:from-surface-dark to-transparent pointer-events-none"></div>

              <!-- Close btn -->
              <button
                @click="close"
                aria-label="Close"
                class="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 dark:bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/40 dark:hover:bg-white/20 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>

              <!-- Platform badges -->
              <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span
                  v-for="plat in project?.platforms"
                  :key="plat"
                  class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/30 dark:bg-white/10 backdrop-blur-sm text-white"
                >
                  {{ plat }}
                </span>
              </div>
            </div>

            <!-- ── Scrollable body ── -->
            <div class="flex-1 overflow-y-auto overscroll-contain">
              <div class="px-5 sm:px-7 pt-5 pb-4">
                <!-- Title -->
                <h3
                  id="project-detail-title"
                  class="text-xl sm:text-2xl font-bold text-text-primary-light dark:text-text-primary-dark leading-tight"
                >
                  {{ project?.name }}
                </h3>

                <!-- Tech stack -->
                <div class="flex flex-wrap gap-1.5 mt-3">
                  <span
                    v-for="(tech, i) in project?.technologies"
                    :key="i"
                    class="text-[11px] px-2.5 py-1 rounded-full bg-onSurface-light dark:bg-onSurface-dark text-text-secondary-light dark:text-text-secondary-dark font-medium"
                  >
                    {{ tech }}
                  </span>
                </div>

                <!-- Divider -->
                <div class="my-4 h-px bg-onSurface-light/60 dark:bg-onSurface-dark/60"></div>

                <!-- Description -->
                <p
                  v-if="localizedDescription"
                  class="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-7"
                >
                  {{ localizedDescription }}
                </p>
                <p v-else class="text-sm text-text-muted-light dark:text-text-muted-dark italic">
                  No description available.
                </p>
              </div>
            </div>

            <!-- ── Sticky footer links ── -->
            <div
              v-if="hasLinks"
              class="flex-shrink-0 px-5 sm:px-7 py-4 border-t border-onSurface-light/30 dark:border-onSurface-dark/30 bg-background-light/95 dark:bg-surface-dark/95 backdrop-blur"
            >
              <div class="flex flex-wrap gap-2">
                <a
                  v-if="project?.github_link"
                  :href="project.github_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="link-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.337 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/></svg>
                  GitHub
                </a>
                <a
                  v-if="project?.app_link"
                  :href="project.app_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="link-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download APK
                </a>
                <a
                  v-if="project?.playstore_link"
                  :href="project.playstore_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="link-btn link-btn-primary"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76c.35.2.77.2 1.12-.01l13.5-7.8-3.02-3.01-11.6 10.82zm-1.18-21.3v20.08l11.09-10.05L2 2.46zM20.1 9.4l-2.71-1.57-3.37 3.06 3.37 3.06 2.74-1.58c.78-.45.78-1.52-.03-1.97zM4.3.25l11.62 10.82 3.02-3.01L4.44.24c-.37-.21-.8-.2-1.14.01z"/></svg>
                  Play Store
                </a>
                <a
                  v-if="project?.appstore_link"
                  :href="project.appstore_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="link-btn link-btn-primary"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  App Store
                </a>
                <a
                  v-if="project?.medium_link"
                  :href="project.medium_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="link-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>
                  Article
                </a>
                <a
                  v-if="project?.website_reference_link"
                  :href="project.website_reference_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="link-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  Website
                </a>
                <a
                  v-if="project?.slideshow_link"
                  :href="project.slideshow_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="link-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                  Slides
                </a>
                <a
                  v-if="project?.docs_link"
                  :href="project.docs_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="link-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  Docs
                </a>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Project } from '@/types/projects'

const { t } = useI18n()

const props = defineProps<{
  open: boolean
  project: Project | null
}>()

const emit = defineEmits<{
  (e: 'update:open', v: boolean): void
}>()

const panelEl = ref<HTMLElement | null>(null)

const localizedDescription = computed(() => {
  const p = props.project as any
  return p?.i18nKey ? t(p.i18nKey) : p?.description || ''
})

const hasLinks = computed(() => {
  const p = props.project
  if (!p) return false
  return !!(p.github_link || p.app_link || p.appstore_link || p.playstore_link || p.medium_link || p.website_reference_link || p.slideshow_link || p.docs_link)
})

function close() {
  emit('update:open', false)
}

watch(() => props.open, async (o) => {
  if (o) {
    document.documentElement.style.overflow = 'hidden'
    await nextTick()
    panelEl.value?.focus?.()
  } else {
    document.documentElement.style.overflow = ''
  }
})
</script>

<style scoped>
/* Backdrop */
.overlay-fade-enter-active,
.overlay-fade-leave-active { transition: opacity 0.25s ease; }
.overlay-fade-enter-from,
.overlay-fade-leave-to { opacity: 0; }

/* Panel rise */
.panel-rise-enter-active,
.panel-rise-leave-active { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease; }
.panel-rise-enter-from,
.panel-rise-leave-to { transform: translateY(24px) scale(0.98); opacity: 0; }

/* Link buttons */
.link-btn {
  @apply inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-200;
  @apply border-onSurface-light dark:border-onSurface-dark;
  @apply text-text-primary-light dark:text-text-primary-dark;
  @apply hover:border-brand-light dark:hover:border-brand-dark;
  @apply hover:text-brand-light dark:hover:text-brand-dark;
  @apply hover:bg-brand-light/5 dark:hover:bg-brand-dark/10;
}

.link-btn-primary {
  @apply bg-brand-light dark:bg-brand-dark text-white border-brand-light dark:border-brand-dark;
  @apply hover:text-white hover:bg-brand-light/90 dark:hover:bg-brand-dark/90;
}
</style>
