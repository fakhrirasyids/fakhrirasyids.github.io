<template>
  <section id="contact" class="py-12 px-6 text-center">
    <!-- Section label -->
    <div class="text-center mb-4">
      <span
        class="bg-onSurface-light dark:bg-onSurface-dark text-text-secondary-light dark:text-text-secondary-dark text-xs tracking-widest rounded-full py-2 px-3"
      >
        {{ $t('contact.title') }}
      </span>
    </div>

    <p class="text-text-secondary-light dark:text-text-secondary-dark mb-8 max-w-xl mx-auto">
      {{ $t('contact.description') }}
    </p>

    <!-- Contact Cards -->
    <div class="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
      <!-- Email Card -->
      <div class="flex items-center gap-4 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl px-6 py-4 w-full md:w-80 shadow-sm">
        <div class="text-left">
          <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">{{ $t('contact.email_label') }}</p>
          <p class="text-lg font-medium text-text-primary-light dark:text-text-primary-dark break-all">
            fakhrirasyids@gmail.com
          </p>
        </div>
      </div>

      <!-- Phone Card -->
      <div class="flex items-center gap-4 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl px-6 py-4 w-full md:w-80 shadow-sm">
        <div class="text-left">
          <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">{{ $t('contact.phone_label') }}</p>
          <p class="text-lg font-medium text-text-primary-light dark:text-text-primary-dark">
            +62 812-2769-4379
          </p>
        </div>
      </div>
    </div>

    <!-- Find me at -->
    <p class="text-text-secondary-light dark:text-text-secondary-dark mb-4">
      {{ $t('contact.find_me_at') }}
    </p>

    <!-- Socials -->
        <!-- Socials -->
        <div class="flex justify-center md:justify-center gap-5">
          <a
            href="https://github.com/fakhrirasyids"
            target="_blank"
            rel="noopener noreferrer"
            class="block transition-transform duration-300 hover:scale-110"
          >
            <img
              src="/assets/icons/asset-github-icon.png"
              alt="GitHub"
              class="w-6 h-6 transition duration-300 opacity-75 hover:opacity-100 dark:invert dark:brightness-75"
            />
          </a>

          <a
            href="https://linkedin.com/in/fakhrirasyids"
            target="_blank"
            rel="noopener noreferrer"
            class="block transition-transform duration-300 hover:scale-110"
          >
            <img
              src="/assets/icons/asset-linkedin-icon.png"
              alt="LinkedIn"
              class="w-6 h-6 transition duration-300 opacity-75 hover:opacity-100 dark:invert dark:brightness-75"
            />
          </a>

          <a
            href="https://medium.com/@fakhrirasyids"
            target="_blank"
            rel="noopener noreferrer"
            class="block transition-transform duration-300 hover:scale-110"
          >
            <img
              src="/assets/icons/asset-medium-icon.png"
              alt="Medium"
              class="h-6 w-auto transition duration-300 opacity-75 hover:opacity-100 dark:invert dark:brightness-75"
            />
          </a>
        </div>
  </section>
</template>
