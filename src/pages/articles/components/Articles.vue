<template>
  <section id="articles" class="py-12 px-6">
    <div class="max-w-5xl mx-auto">
      <!-- Section Label -->
      <div class="text-center">
        <span
          class="bg-onSurface-light dark:bg-onSurface-dark text-text-secondary-light dark:text-text-secondary-dark text-xs tracking-widest rounded-full py-2 px-3"
        >
          {{ $t('articles.label') }}
        </span>
      </div>

      <!-- Title -->
      <h2
        class="text-l md:text-xl font-medium mb-8 text-text-primary-light dark:text-text-primary-dark py-4 text-center mt-6"
      >
        {{ $t('articles.title') }}
      </h2>

      <!-- Articles List -->
      <div class="space-y-6">
        <!-- Loading Skeleton -->
        <template v-if="isLoading">
          <div
            v-for="n in 4"
            :key="n"
            class="flex flex-col sm:flex-row gap-4 animate-pulse border rounded-xl p-4 dark:border-border-dark border-border-light"
          >
            <div class="w-full sm:w-32 h-20 bg-gray-300 dark:bg-gray-700 rounded-md" />
            <div class="flex-1 space-y-3">
              <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
            </div>
          </div>
        </template>

        <!-- Article Cards -->
        <template v-else>
          <a
            v-for="article in articles"
            :key="article.guid"
            :href="article.link"
            target="_blank"
            rel="noopener noreferrer"
            class="flex flex-col sm:flex-row gap-4 border border-border-light dark:border-border-dark rounded-xl p-4 hover:shadow-md transition-shadow duration-300"
          >
            <!-- Thumbnail -->
            <img
              :src="getThumbnail(article)"
              alt="Article Thumbnail"
              class="w-full sm:w-32 h-48 sm:h-20 object-cover rounded-md flex-shrink-0"
            />

            <!-- Content -->
            <div class="flex-1 flex flex-col justify-between overflow-hidden">
              <!-- Title -->
              <h3
                class="text-base font-semibold text-text-primary-light dark:text-text-primary-dark truncate"
                :title="article.title"
              >
                {{ article.title }}
              </h3>

              <!-- Date -->
              <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                {{ formatDate(article.pubDate) }}
              </p>

              <!-- Description -->
              <p
                class="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-2 line-clamp-3"
                v-html="stripHtml(article.description)"
              />

              <!-- Click to see full detail (separate line) -->
              <span
                class="italic text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1"
              >
                ({{ $t('projects.click_full_detail') }})
              </span>

              <!-- Categories -->
              <div class="flex flex-wrap gap-1 mt-4">
                <span
                  v-for="(category, index) in article.categories"
                  :key="index"
                  class="bg-onSurface-light dark:bg-onSurface-dark text-text-secondary-light dark:text-text-secondary-dark text-xs px-2 py-1 rounded"
                >
                  {{ category }}
                </span>
              </div>
            </div>
          </a>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { mediumService } from '@/services/api/services/medium_services'
import type { MediumItem } from '@/services/types/medium'

const articles = ref<MediumItem[]>([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const response = await mediumService.getUserArticles()

    // Map and inject thumbnail from description
    articles.value = response.data.items.map((article) => {
      const match = article.description?.toString().match(/<img[^>]+src="([^">]+)"/)
      const extractedThumbnail = match?.[1] || ''
      return {
        ...article,
        thumbnail: extractedThumbnail || article.thumbnail,
      }
    })
  } catch (error) {
    console.error('Failed to fetch Medium articles:', error)
  } finally {
    isLoading.value = false
  }
})

function getThumbnail(article: MediumItem): string {
  return article.thumbnail || '/placeholder.jpg'
}

function formatDate(pubDate: string): string {
  return new Date(pubDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function stripHtml(html: string): string {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
