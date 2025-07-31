<template>
  <section class="py-12 px-6 max-w-6xl mx-auto h-auto md:h-[600px] flex flex-col md:flex-row md:items-center gap-10">
    <!-- Left content -->
    <div class="flex-1 text-center md:text-left space-y-4">
      <h1 class="text-4xl md:text-5xl font-bold text-text-primary-light dark:text-text-primary-dark">
        {{ $t('hero.title') }}
      </h1>

      <h2 class="text-2xl md:text-2xl font-normal text-text-secondary-light dark:text-text-secondary-dark">
        {{ $t('hero.description') }}
      </h2>

      <!-- Download CV Button with margin -->
      <div class="mt-4">
        <a
          href="/cv.pdf"
          target="_blank"
          class="inline-block bg-green-light dark:bg-green-dark text-inverted-dark px-4 py-2 rounded-full font-medium hover:bg-border-light dark:hover:bg-border-dark transition"
        >
          {{ $t('header.download_cv') }}
        </a>
      </div>

      <!-- Socials -->
      <div class="flex justify-center md:justify-start gap-5 py-2">
        <a
          href="https://github.com/fakhrirasyids"
          target="_blank"
          rel="noopener noreferrer"
          class="block"
        >
          <img
            src="/assets/icons/asset-github-icon.png"
            alt="GitHub"
            class="w-6 h-6 transition duration-300 dark:invert dark:brightness-75"
          />
        </a>

        <a
          href="https://linkedin.com/in/fakhrirasyids"
          target="_blank"
          rel="noopener noreferrer"
          class="block"
        >
          <img
            src="/assets/icons/asset-linkedin-icon.png"
            alt="LinkedIn"
            class="w-6 h-6 transition duration-300 dark:invert dark:brightness-75"
          />
        </a>

        <a
          href="https://medium.com/@fakhrirasyids"
          target="_blank"
          rel="noopener noreferrer"
          class="block"
        >
          <img
            src="/assets/icons/asset-medium-icon.png"
            alt="Medium"
            class="h-6 w-auto transition duration-300 dark:invert dark:brightness-75"
          />
        </a>
      </div>
    </div>

    <!-- Right image with outlined border and background block -->
    <div class="flex-1 flex justify-center relative">
      <!-- Background rectangle behind (bottom-left aligned) -->
      <div
        class="absolute bg-onSurface-light dark:bg-surfaceVariant-dark z-0"
        :class="[
          'w-[240px] h-[210px] translate-y-[20px]',
          'md:w-[360px] md:h-[360px] md:translate-x-[20px] md:translate-y-[20px]',
          'rounded-none transition-all duration-300'
        ]"
      ></div>

      <!-- Main image with border -->
      <div
        class="relative z-10 border-[10px] border-background-light dark:border-background-dark
              w-[220px] h-[220px] md:w-[360px] md:h-[360px] overflow-hidden"
      >
        <img
          src="/assets/me/asset-fakhri.jpg"
          alt="Hero"
          class="w-full h-full object-cover"
        />
      </div>
    </div>
  </section>
</template>
