<template>
  <div class="py-12 px-6 max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-center">
    <!-- Left content -->
    <div class="flex-1 space-y-4">
      <h1 class="text-4xl md:text-5xl font-bold text-text-primary-light dark:text-text-primary-dark">
        {{ $t('hero.title') }}
      </h1>

      <p class="text-sm md:text-base max-w-xl text-text-secondary-light dark:text-text-secondary-dark">
        {{ $t('hero.description') }}
      </p>

      <div class="flex items-center text-sm text-text-muted-light dark:text-text-muted-dark space-x-2">
        <span>{{ $t('hero.location') }}</span>
      </div>

      <div class="flex gap-4 mt-3 text-text-muted-light dark:text-text-muted-dark text-xl">
        <i class="ri-github-line"></i>
        <i class="ri-linkedin-line"></i>
        <i class="ri-twitter-line"></i>
      </div>
    </div>

    <!-- Right image -->
    <div class="flex-1">
      <img
        src="/assets/vite.svg"
        class="w-60 h-60 object-cover rounded-xl shadow-lg mx-auto"
        alt="Hero Image"
      />
    </div>
  </div>
</template>

