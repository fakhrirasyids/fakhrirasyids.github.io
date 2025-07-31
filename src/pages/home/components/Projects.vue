<template>
  <section id="projects" class="py-12 px-6">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-2xl font-bold text-center text-text-primary-light dark:text-text-primary-dark mb-8">
        Projects
      </h2>

      <div class="grid md:grid-cols-2 gap-6">
        <!-- Project Card -->
        <div class="rounded-xl shadow-md overflow-hidden">
          <!-- Image Section -->
          <div class="bg-surface-light dark:bg-surface-dark p-4">
            <img src="/assets/vite.svg" class="w-full rounded-lg" />
          </div>

          <!-- Content Section -->
          <div class="p-4 bg-background-light dark:bg-surfaceVariant-dark">
            <h3 class="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
              Space Attack
            </h3>

            <p class="text-sm mt-2 text-text-secondary-light dark:text-text-secondary-dark">
              A modern digital game...
            </p>

            <div class="flex gap-2 text-xs mt-2 flex-wrap">
              <span class="bg-onSurface-light dark:bg-onSurface-dark text-text-secondary-light dark:text-text-secondary-dark px-2 py-1 rounded">
                Kotlin
              </span>
              <span class="bg-onSurface-light dark:bg-onSurface-dark text-text-secondary-light dark:text-text-secondary-dark px-2 py-1 rounded">
                Jetpack Compose
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
