<template>
  <teleport to="body">
    <transition name="overlay-fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[70]"
        role="dialog"
        :aria-labelledby="'project-detail-title'"
        :aria-modal="true"
        @keydown.esc="close"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>

        <!-- ===== Desktop: centered modal (click outside closes) ===== -->
        <transition name="modal-zoom">
          <div
            v-show="open"
            class="hidden sm:flex absolute inset-0 items-center justify-center"
            @click="close"
          >
            <div
              ref="panelEl"
              tabindex="-1"
              class="w-[min(1000px,92vw)] max-h-[90vh] overflow-y-auto
                     rounded-2xl border border-onSurface-light/40 dark:border-onSurface-dark/40
                     bg-surface-light dark:bg-surface-dark shadow-2xl relative"
              @click.stop
            >
              <!-- Close button -->
              <button
                @click="close"
                aria-label="Close"
                class="absolute right-3 top-3 z-10 px-3 py-1.5 rounded-lg border
                       border-onSurface-light/40 dark:border-onSurface-dark/40
                       hover:bg-onSurface-light/40 dark:hover:bg-onSurface-dark/40 text-sm"
              >
                ✖
              </button>

              <!-- Image FIRST -->
              <div class="p-4 sm:p-6 pt-6">
                <div class="flex justify-center">
                  <img
                    v-if="project?.image"
                    :src="project.image"
                    :alt="project?.name"
                    class="w-1/2 max-w-[520px] h-auto object-contain rounded-xl
                           border-4 border-surface-light dark:border-surface-dark shadow-xl"
                  />
                </div>
              </div>

              <!-- Title / meta SECOND -->
              <header class="px-4 sm:px-6 pb-4 text-center border-b border-onSurface-light/30 dark:border-onSurface-dark/30">
                <h3 id="project-detail-title" class="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
                  {{ project?.name }}
                </h3>
                <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                  {{ project?.platforms?.join(' · ') }}
                </p>
              </header>

              <!-- Body -->
              <div class="p-4 sm:p-6 space-y-4">
                <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                  {{ localizedDescription }}
                </p>

                <div class="flex flex-wrap gap-2 justify-center">
                  <span
                    v-for="(tech, i) in project?.technologies || []"
                    :key="i"
                    class="px-2 py-1 rounded bg-onSurface-light dark:bg-onSurface-dark text-xs text-text-secondary-light dark:text-text-secondary-dark"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>

              <!-- Sticky footer -->
              <div
                class="sticky bottom-0 w-full px-4 sm:px-6 py-3
                       bg-surface-light/95 dark:bg-surface-dark/95
                       border-t border-onSurface-light/30 dark:border-onSurface-dark/30
                       backdrop-blur supports-[backdrop-filter]:backdrop-blur-md"
              >
                <div class="flex flex-wrap items-center justify-center gap-2">
                  <a v-if="project?.github_link" :href="project.github_link" target="_blank" rel="noopener"
                     class="px-4 py-2 rounded-lg border text-sm border-onSurface-light/40 dark:border-onSurface-dark/40 hover:bg-onSurface-light/40 dark:hover:bg-onSurface-dark/40">GitHub</a>
                  <a v-if="project?.app_link" :href="project.app_link" target="_blank" rel="noopener"
                     class="px-4 py-2 rounded-lg border text-sm border-onSurface-light/40 dark:border-onSurface-dark/40 hover:bg-onSurface-light/40 dark:hover:bg-onSurface-dark/40">App</a>
                  <a v-if="project?.appstore_link" :href="project.appstore_link" target="_blank" rel="noopener"
                     class="px-4 py-2 rounded-lg border text-sm border-onSurface-light/40 dark:border-onSurface-dark/40">App Store</a>
                  <a v-if="project?.playstore_link" :href="project.playstore_link" target="_blank" rel="noopener"
                     class="px-4 py-2 rounded-lg border text-sm border-onSurface-light/40 dark:border-onSurface-dark/40 hover:bg-onSurface-light/40 dark:hover:bg-onSurface-dark/40">Play Store</a>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- ===== Mobile: 90% screen bottom sheet (click outside closes) ===== -->
        <transition name="sheet-up">
          <div
            v-show="open"
            class="sm:hidden absolute inset-0 flex items-end justify-center"
            @click="close"
          >
            <div
              ref="panelEl"
              tabindex="-1"
              class="w-[90vw] h-[90vh] rounded-t-2xl
                     bg-surface-light dark:bg-surface-dark
                     border-t border-onSurface-light/40 dark:border-onSurface-dark/40
                     shadow-2xl overflow-y-auto relative"
              @click.stop
            >
              <!-- Close -->
              <button
                @click="close"
                aria-label="Close"
                class="absolute right-3 top-3 z-10 px-3 py-1.5 rounded-lg border
                       border-onSurface-light/40 dark:border-onSurface-dark/40 text-sm"
              >
                ✖
              </button>

              <!-- Image FIRST -->
              <div class="p-4 pt-6">
                <div class="flex justify-center">
                  <img
                    v-if="project?.image"
                    :src="project.image"
                    :alt="project?.name"
                    class="w-[80%] max-w-[520px] h-auto object-contain rounded-xl
                           border-4 border-surface-light dark:border-surface-dark shadow-xl"
                  />
                </div>
              </div>

              <!-- Title / meta SECOND -->
              <header class="px-4 pb-4 text-center border-b border-onSurface-light/30 dark:border-onSurface-dark/30">
                <h3 id="project-detail-title" class="text-base font-semibold text-text-primary-light dark:text-text-primary-dark">
                  {{ project?.name }}
                </h3>
                <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                  {{ project?.platforms?.join(' · ') }}
                </p>
              </header>

              <!-- Body -->
              <div class="p-4 space-y-3 pb-24">
                <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                  {{ localizedDescription }}
                </p>

                <div class="flex flex-wrap gap-2 justify-center">
                  <span
                    v-for="(tech, i) in project?.technologies || []"
                    :key="i"
                    class="px-2 py-1 rounded bg-onSurface-light dark:bg-onSurface-dark text-xs text-text-secondary-light dark:text-text-secondary-dark"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>

              <!-- Sticky footer -->
              <div
                class="sticky bottom-0 w-full px-4 py-3
                       bg-surface-light/95 dark:bg-surface-dark/95
                       border-t border-onSurface-light/30 dark:border-onSurface-dark/30
                       backdrop-blur supports-[backdrop-filter]:backdrop-blur-md"
              >
                <div class="flex flex-wrap items-center justify-center gap-2">
                  <a v-if="project?.github_link" :href="project.github_link" target="_blank" rel="noopener"
                     class="px-4 py-2 rounded-lg border text-sm border-onSurface-light/40 dark:border-onSurface-dark/40">GitHub</a>
                  <a v-if="project?.app_link" :href="project.app_link" target="_blank" rel="noopener"
                     class="px-4 py-2 rounded-lg border text-sm border-onSurface-light/40 dark:border-onSurface-dark/40">App</a>
                  <a v-if="project?.appstore_link" :href="project.appstore_link" target="_blank" rel="noopener"
                     class="px-4 py-2 rounded-lg border text-sm border-onSurface-light/40 dark:border-onSurface-dark/40">App Store</a>
                  <a v-if="project?.playstore_link" :href="project.playstore_link" target="_blank" rel="noopener"
                     class="px-4 py-2 rounded-lg border text-sm border-onSurface-light/40 dark:border-onSurface-dark/40">Play Store</a>
                </div>
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
/* Backdrop fade */
.overlay-fade-enter-active,
.overlay-fade-leave-active { transition: opacity 0.2s ease; }
.overlay-fade-enter-from,
.overlay-fade-leave-to { opacity: 0; }

/* Desktop modal zoom */
.modal-zoom-enter-active,
.modal-zoom-leave-active { transition: transform 0.2s ease, opacity 0.2s ease; }
.modal-zoom-enter-from,
.modal-zoom-leave-to { transform: scale(0.98); opacity: 0; }

/* Mobile sheet slide */
.sheet-up-enter-active,
.sheet-up-leave-active { transition: transform 0.25s ease, opacity 0.25s ease; }
.sheet-up-enter-from,
.sheet-up-leave-to { transform: translateY(12px); opacity: 0; }
</style>
