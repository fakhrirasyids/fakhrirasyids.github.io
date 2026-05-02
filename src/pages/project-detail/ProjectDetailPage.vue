<template>
  <section class="relative overflow-hidden bg-background-light text-text-primary-light dark:bg-background-dark dark:text-text-primary-dark">
    <div
      v-if="project?.image"
      aria-hidden="true"
      class="absolute inset-x-0 top-0 h-[420px] overflow-hidden opacity-25 dark:opacity-30"
    >
      <img
        :src="project.image"
        alt=""
        class="h-full w-full scale-110 object-cover blur-2xl"
        decoding="async"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-white/20 via-background-light/75 to-background-light dark:from-[#09111f]/50 dark:via-background-dark/80 dark:to-background-dark"></div>
    </div>

    <div class="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <button
        type="button"
        @click="smartBack"
        class="mb-5 inline-flex h-10 items-center gap-2 rounded-lg border border-border-light/80 bg-white/75 px-3 text-sm font-semibold text-text-secondary-light shadow-sm backdrop-blur transition hover:border-brand-light hover:text-brand-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-light dark:border-border-dark/80 dark:bg-surface-dark/70 dark:text-text-secondary-dark dark:hover:border-brand-dark dark:hover:text-brand-dark dark:focus-visible:ring-brand-dark"
        aria-label="Go back to projects"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
        Back
      </button>

      <article v-if="project" class="space-y-10">
        <div class="grid min-w-0 items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(430px,0.9fr)]">
          <header class="min-w-0 max-w-3xl order-2 lg:order-1">
            <div class="mb-4 flex flex-wrap gap-2">
              <span
                v-for="platform in project.platforms"
                :key="platform"
                class="inline-flex items-center rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-700 dark:text-cyan-200"
              >
                {{ platform }}
              </span>
            </div>

            <p class="mb-3 text-sm font-semibold text-emerald-600 dark:text-emerald-300">
              Project case study
            </p>
            <h1 class="max-w-4xl break-words text-3xl font-bold leading-[1.08] text-text-primary-light dark:text-text-primary-dark sm:text-5xl lg:text-6xl">
              {{ project.name }}
            </h1>
            <p class="mt-5 max-w-2xl text-base leading-8 text-text-secondary-light dark:text-text-secondary-dark sm:text-lg">
              {{ heroDescription }}
            </p>

            <div class="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                v-for="(link, index) in actionLinks"
                :key="link.key"
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
                :class="[
                  'inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background-dark',
                  index === 0
                    ? 'bg-text-primary-light text-white shadow-lg shadow-slate-900/10 hover:bg-slate-700 focus-visible:ring-text-primary-light dark:bg-white dark:text-background-dark dark:hover:bg-slate-200'
                    : 'border border-border-light bg-white/80 text-text-primary-light hover:border-brand-light hover:text-brand-light focus-visible:ring-brand-light dark:border-border-dark dark:bg-surface-dark/80 dark:text-text-primary-dark dark:hover:border-brand-dark dark:hover:text-brand-dark dark:focus-visible:ring-brand-dark',
                ]"
                :aria-label="`${link.label} for ${project.name}`"
              >
                {{ link.label }}
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M7 17 17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>
              <div
                v-if="!actionLinks.length"
                class="inline-flex min-h-11 items-center rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 text-sm font-semibold text-amber-700 dark:text-amber-200"
              >
                Private delivery. Public artifacts are not available.
              </div>
            </div>
          </header>

          <div class="relative min-w-0 order-1 lg:order-2">
            <div class="absolute -inset-3 rounded-lg bg-gradient-to-br from-cyan-500/20 via-emerald-500/10 to-amber-400/20 blur-xl"></div>
            <div class="relative w-full overflow-hidden rounded-lg border border-white/70 bg-white/80 p-3 shadow-2xl shadow-slate-900/10 backdrop-blur dark:border-white/10 dark:bg-surface-dark/80">
              <div class="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-[#eef6f5] dark:bg-[#111827]">
                <div class="absolute inset-0 detail-grid opacity-50"></div>
                <img
                  :src="project.image"
                  :alt="project.name"
                  class="relative z-10 max-h-full w-full object-contain p-4 sm:p-6"
                  decoding="async"
                  loading="eager"
                  fetchpriority="high"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section class="rounded-lg border border-border-light bg-white/80 p-5 shadow-sm dark:border-border-dark dark:bg-surface-dark/75 sm:p-6">
            <h2 class="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">Technology stack</h2>
            <div class="mt-4 flex flex-wrap gap-2">
              <span
                v-for="tech in project.technologies"
                :key="tech"
                class="rounded-full bg-slate-900/5 px-3 py-1.5 text-xs font-semibold text-text-secondary-light dark:bg-white/10 dark:text-text-secondary-dark"
              >
                {{ tech }}
              </span>
            </div>
          </section>

          <section class="rounded-lg border border-border-light bg-white/80 p-5 shadow-sm dark:border-border-dark dark:bg-surface-dark/75">
            <h2 class="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">Direct access</h2>
            <div v-if="actionLinks.length" class="mt-4 grid gap-2">
              <a
                v-for="link in actionLinks"
                :key="`side-${link.key}`"
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
                class="flex min-h-11 items-center justify-between rounded-lg border border-border-light px-3 text-sm font-semibold text-text-primary-light transition hover:border-brand-light hover:text-brand-light dark:border-border-dark dark:text-text-primary-dark dark:hover:border-brand-dark dark:hover:text-brand-dark"
              >
                {{ link.label }}
                <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M7 17 17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>
            </div>
            <p v-else class="mt-3 text-sm leading-6 text-text-secondary-light dark:text-text-secondary-dark">
              This work is protected by confidentiality constraints, so the portfolio shows the build context without linking private assets.
            </p>
          </section>
        </div>

        <section v-if="relatedProjects.length" class="space-y-4">
          <div class="flex items-end justify-between gap-4">
            <div>
              <h2 class="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Related work</h2>
              <p class="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">More projects with a similar platform or stack.</p>
            </div>
            <RouterLink
              :to="{ name: 'Projects' }"
              class="hidden rounded-lg border border-border-light px-3 py-2 text-sm font-semibold text-text-secondary-light transition hover:border-brand-light hover:text-brand-light dark:border-border-dark dark:text-text-secondary-dark dark:hover:border-brand-dark dark:hover:text-brand-dark sm:inline-flex"
            >
              All projects
            </RouterLink>
          </div>

          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <RouterLink
              v-for="item in relatedProjects"
              :key="item.id"
              :to="projectDetailTo(item)"
              class="group overflow-hidden rounded-lg border border-border-light bg-white/80 shadow-sm transition hover:-translate-y-1 hover:border-brand-light/60 hover:shadow-lg dark:border-border-dark dark:bg-surface-dark/75 dark:hover:border-brand-dark/60"
            >
              <div class="flex h-36 items-center justify-center bg-surface-light dark:bg-background-dark/50">
                <img :src="item.image" :alt="item.name" class="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-105" loading="lazy" decoding="async" />
              </div>
              <div class="p-4">
                <h3 class="line-clamp-2 text-sm font-bold leading-6 text-text-primary-light dark:text-text-primary-dark">{{ item.name }}</h3>
                <p class="mt-1 text-xs text-text-muted-light dark:text-text-muted-dark">{{ item.platforms.slice(0, 3).join(' / ') }}</p>
              </div>
            </RouterLink>
          </div>
        </section>
      </article>

      <div v-else class="mx-auto max-w-xl py-20 text-center">
        <div class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-300">
          <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Project not found</h1>
        <p class="mt-3 text-sm leading-6 text-text-secondary-light dark:text-text-secondary-dark">
          No project matches "{{ projectParam }}". Try opening it by project id, generated slug, or configured path.
        </p>
        <RouterLink
          :to="{ name: 'Projects' }"
          class="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-text-primary-light px-4 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-background-dark dark:hover:bg-slate-200"
        >
          Back to projects
        </RouterLink>
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

type ProjectWithPaths = Project & {
  slug?: string
  path?: string
  aliases?: string[]
}

function paramToString(value: unknown) {
  return Array.isArray(value) ? value.join('/') : String(value ?? '')
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeLookup(value: string) {
  return decodeURIComponent(value)
    .trim()
    .replace(/^\/+|\/+$/g, '')
    .replace(/^(projects|project|work)\//, '')
    .toLowerCase()
}

function projectLookupValues(project: ProjectWithPaths) {
  const values = [
    project.id,
    project.slug,
    project.path,
    slugify(project.id),
    slugify(project.name),
    ...(project.aliases ?? []),
  ].filter(Boolean) as string[]

  return values.flatMap(value => {
    const normalized = normalizeLookup(value)
    return [normalized, slugify(normalized)]
  })
}

const projectParam = computed(() =>
  normalizeLookup(paramToString(route.params.projectRef ?? route.params.id)),
)

const project = computed<Project | null>(() => {
  const requested = projectParam.value
  if (!requested) return null

  return projectsData.find(item => {
    const values = projectLookupValues(item as ProjectWithPaths)
    return values.includes(requested) || values.includes(slugify(requested))
  }) ?? null
})

const localizedDescription = computed(() => {
  const item = project.value
  if (!item) return ''
  return item.i18nKey ? t(item.i18nKey) : item.description
})

const heroDescription = computed(() => {
  if (localizedDescription.value) return localizedDescription.value
  return `A ${project.value?.platforms.join(', ')} project built with ${project.value?.technologies.slice(0, 3).join(', ')}.`
})

const relatedProjects = computed(() => {
  const item = project.value
  if (!item) return []

  return projectsData
    .filter(candidate => candidate.id !== item.id)
    .map(candidate => {
      const platformScore = candidate.platforms.filter(platform => item.platforms.includes(platform)).length * 2
      const techScore = candidate.technologies.filter(tech => item.technologies.includes(tech)).length
      return { candidate, score: platformScore + techScore }
    })
    .filter(entry => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(entry => entry.candidate)
})

function safeHref(url: string): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url, window.location.origin)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.toString() : null
  } catch {
    return null
  }
}

const actionLinks = computed(() => {
  const item = project.value
  if (!item) return []

  const links: Array<{ key: string; label: string; href: string }> = []
  const add = (key: string, label: string, href: string) => {
    const safe = safeHref(href)
    if (safe) links.push({ key, label, href: safe })
  }

  add('github', 'GitHub', item.github_link)
  add('app', 'App build', item.app_link)
  add('appstore', 'App Store', item.appstore_link)
  add('playstore', 'Play Store', item.playstore_link)
  add('medium', 'Article', item.medium_link)
  add('website', 'Website', item.website_reference_link)
  add('slides', 'Slides', item.slideshow_link)
  add('docs', 'Docs', item.docs_link)

  return links
})

function projectDetailTo(item: Project) {
  return {
    name: 'ProjectDetail',
    params: { projectRef: (item as ProjectWithPaths).path ?? item.slug ?? slugify(item.name) },
  }
}

function smartBack() {
  const cameFromSameOrigin =
    document.referrer && new URL(document.referrer).origin === window.location.origin

  if (window.history.length > 1 && cameFromSameOrigin && window.history.state?.back) {
    router.back()
  } else {
    router.push({ name: 'Projects' })
  }
}
</script>

<style scoped>
.detail-grid {
  background-image:
    linear-gradient(rgba(15, 23, 42, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(15, 23, 42, 0.08) 1px, transparent 1px);
  background-size: 22px 22px;
}

:global(.dark) .detail-grid {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
}
</style>
