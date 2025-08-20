<template>
  <section id="about" class="bg-surface-light dark:bg-surface-dark py-12 px-6">
    <div class="max-w-6xl mx-auto space-y-8">
      <!-- Section label -->
      <div class="text-center">
        <span
          class="bg-onSurface-light dark:bg-onSurface-dark text-text-secondary-light dark:text-text-secondary-dark text-xs tracking-widest rounded-full py-2 px-3"
        >
          {{ $t('about.label') }}
        </span>
      </div>

      <!-- Main layout -->
      <div class="flex flex-col md:flex-row gap-10 md:items-start items-center">
        <!-- Left: image block -->
        <div class="flex-1 flex justify-center relative">
          <!-- Background rectangle -->
          <div
            class="absolute bg-onSurface-light dark:bg-surfaceVariant-dark z-0"
            :class="[
              'w-[240px] h-[260px] translate-y-[20px]',
              'md:w-[360px] md:h-[410px] md:translate-x-[-20px] md:translate-y-[20px]',
              'rounded-none transition-all duration-300'
            ]"
          ></div>

          <!-- Main image with border -->
          <div
            class="relative z-10 border-[10px] border-surface-light dark:border-surface-dark
                  w-[220px] h-[270px] md:w-[360px] md:h-[410px] overflow-hidden"
          >
            <img
              src="/assets/me/asset-fakhri-standing.jpeg"
              alt="About Image"
              class="w-full h-full object-cover"
            />
          </div>
        </div>

        <!-- Right: text content -->
        <div class="flex-1 space-y-4 text-center md:text-left">
          <h2 class="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {{ $t('about.title') }}
          </h2>

          <p
            class="text-text-secondary-light dark:text-text-secondary-dark text-sm md:text-base leading-relaxed"
            v-html="$t('about.description')"
          />
        </div>
      </div>
    </div>
  </section>
</template>
