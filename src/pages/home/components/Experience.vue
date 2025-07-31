<template>
  <section id="experience" class="bg-surface-light dark:bg-surface-dark py-12 px-6">
    <div class="max-w-5xl mx-auto">
      <h2 class="text-2xl md:text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6 text-center">
        {{ $t('experience.title') }}
      </h2>

      <div class="space-y-6">
        <div class="bg-background-light dark:bg-surfaceVariant-dark p-5 rounded-xl shadow-sm">
          <h3 class="font-semibold text-text-primary-light dark:text-text-primary-dark">
            {{ $t('experience.job_title') }}
          </h3>
          <p class="text-sm text-text-muted-light dark:text-text-muted-dark">
            {{ $t('experience.period') }}
          </p>
          <ul class="list-disc list-inside text-sm mt-2 text-text-secondary-light dark:text-text-secondary-dark">
            <li>{{ $t('experience.responsibilities.0') }}</li>
            <li>{{ $t('experience.responsibilities.1') }}</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
