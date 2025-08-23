<template>
  <section class="relative">
    <!-- Full-width blurred header background -->
    <div
    v-if="project?.image"
    aria-hidden="true"
    class="pointer-events-none absolute inset-x-0 top-0 h-[20vh] sm:h-[30vh] min-h-[120px] sm:min-h-[140px] overflow-hidden"
    >
    <img
        :src="project.image"
        alt=""
        class="absolute inset-0 w-full h-full object-cover blur-md scale-105 brightness-90"
    />
    <div class="absolute inset-0 bg-black/20"></div>
    </div>

    <!-- Desktop back button (over header) -->
    <div class="hidden sm:block absolute left-6 top-6 z-20">
      <button
        type="button"
        @click="smartBack"
        class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm
               bg-black/60 text-white border border-white/20
               backdrop-blur hover:bg-black/70 transition"
        aria-label="Go back"
      >
        <span aria-hidden="true">←</span>
        <span class="hidden sm:inline">Back</span>
      </button>
    </div>

    <!-- Content over the header -->
    <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-10 pt-6">
      <div v-if="project">
        <!-- Mobile back button overlays the image (container is relative) -->
        <div class="relative flex justify-center mb-6 sm:mb-8">
          <button
            type="button"
            @click="smartBack"
            class="sm:hidden absolute left-3 top-3 z-20 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm
                   bg-black/60 text-white border border-white/20 backdrop-blur hover:bg-black/70 transition"
            aria-label="Go back"
          >
            <span aria-hidden="true">← Back</span>
          </button>

          <img
            :src="project.image"
            :alt="project.name"
            class="w-[min(680px,100%)] sm:w-[min(520px,90%)] h-auto object-contain rounded-xl
                   border-4 border-surface-light dark:border-surface-dark shadow-xl"
            decoding="async"
            loading="eager"
          />
        </div>

        <!-- Title & meta -->
        <header class="text-center mb-6 sm:mb-8">
          <h1 class="text-2xl sm:text-3xl font-semibold text-text-primary-light dark:text-text-primary-dark">
            {{ project.name }}
          </h1>
          <p class="text-xs sm:text-sm text-text-secondary-light dark:text-text-secondary-dark mt-2">
            {{ project.platforms.join(' · ') }}
          </p>
        </header>

        <!-- Body -->
        <div class="space-y-5">
          <p class="text-sm sm:text-base text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
            {{ localizedDescription }}
          </p>

          <div class="flex flex-wrap gap-2 justify-center">
            <span
              v-for="(tech, i) in project.technologies"
              :key="i"
              class="px-2 py-1 rounded bg-onSurface-light dark:bg-onSurface-dark text-xs text-text-secondary-light dark:text-text-secondary-dark"
            >
              {{ tech }}
            </span>
          </div>
        </div>

        <!-- Footer actions -->
        <div class="mt-8 flex flex-wrap items-center justify-center gap-2">
        <template v-if="actionLinks.length">
            <a
            v-for="link in actionLinks"
            :key="link.key"
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`${link.label} – ${project?.name}`"
            :class="[baseBtnClass, link.class]"
            >
            {{ link.label }}
            </a>
        </template>

        <!-- NDA / no-link fallback -->
        <p
            v-else
            class="text-sm italic text-text-secondary-light dark:text-text-secondary-dark text-center"
        >
            This project is under a non-disclosure agreement. Public links and artifacts aren’t available.
        </p>
        </div>

      </div>

      <div v-else class="text-center py-20 text-text-secondary-light dark:text-text-secondary-dark">
        <p class="mb-4">Project not found.</p>
        <RouterLink
          :to="{ name: 'Projects' }"
          class="text-sm px-3 py-1.5 rounded-lg border
                 border-onSurface-light/50 dark:border-onSurface-dark/50
                 hover:bg-onSurface-light/40 dark:hover:bg-onSurface-dark/40"
        >Back to Projects</RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { projects as projectsData } from '@/data/projects'
import type { Project } from '@/types/projects'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const idParam = computed(() => decodeURIComponent(String(route.params.id ?? '')))
const project = computed<Project | null>(() =>
  projectsData.find(p => p.id === idParam.value) ?? null
)

const localizedDescription = computed(() => {
  const p = project.value as any
  return p?.i18nKey ? t(p.i18nKey) : p?.description || ''
})

function smartBack() {
  const hasHistory = window.history.length > 1
  const cameFromSameOrigin =
    document.referrer && new URL(document.referrer).origin === window.location.origin
  if (hasHistory && cameFromSameOrigin && window.history.state?.back) router.back()
  else router.push({ name: 'Projects' })
}

/** Best-practice: only allow http/https (also supports relative paths). */
function safeHref(url: string): string | null {
  if (!url) return null
  try {
    const u = new URL(url, window.location.origin)
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.toString() : null
  } catch {
    return null
  }
}

const baseBtnClass =
  'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium shadow-sm ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition'

/** Build action buttons with brand-ish colors (includes new Docs link). */
const actionLinks = computed(() => {
  const p = project.value
  if (!p) return []

  const links: Array<{ key: string; label: string; href: string; class: string }> = []

  const add = (key: string, label: string, href: string, cls: string) => {
    const safe = safeHref(href)
    if (safe) links.push({ key, label, href: safe, class: cls })
  }

  add('github', 'GitHub', p.github_link, 'bg-[#24292e] text-white hover:opacity-90 focus-visible:ring-[#24292e]')
  add('app', 'App', p.app_link, 'bg-[#475569] text-white hover:brightness-110 focus-visible:ring-[#475569]') // slate-600
  add('appstore', 'App Store', p.appstore_link, 'bg-[#0a84ff] text-white hover:brightness-110 focus-visible:ring-[#0a84ff]')
  add('playstore', 'Play Store', p.playstore_link, 'bg-[#34a853] text-white hover:brightness-110 focus-visible:ring-[#34a853]')
  add('medium', 'Medium', p.medium_link, 'bg-[#00ab6c] text-white hover:brightness-110 focus-visible:ring-[#00ab6c]')
  add('website', 'Website', p.website_reference_link, 'bg-[#6366f1] text-white hover:brightness-110 focus-visible:ring-[#6366f1]') // indigo-500
  add('slides', 'Slideshow', p.slideshow_link, 'bg-[#f4b400] text-black hover:brightness-95 focus-visible:ring-[#f4b400]') // GSlides yellow
  add('docs', 'Docs', p.docs_link, 'bg-[#1a73e8] text-white hover:brightness-110 focus-visible:ring-[#1a73e8]') // Docs blue

  return links
})
</script>

