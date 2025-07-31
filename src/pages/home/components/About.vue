<template>
  <section id="about" class="bg-surface-light dark:bg-surface-dark py-12 px-6">
    <div class="max-w-5xl mx-auto text-center space-y-4">
      <span class="text-text-muted-light dark:text-text-muted-dark text-xs tracking-widest uppercase">
        {{ $t('about.label') }}
      </span>

      <h2 class="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
        {{ $t('about.title') }}
      </h2>

      <p class="text-text-secondary-light dark:text-text-secondary-dark text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
        {{ $t('about.description') }}
      </p>
    </div>
  </section>
</template>
