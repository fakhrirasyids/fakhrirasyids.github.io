<template>
  <section id="contact" class="py-12 px-6 text-center">
    <h2 class="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
      {{ $t('contact.title') }}
    </h2>
    
    <p class="text-text-secondary-light dark:text-text-secondary-dark mb-6">
      {{ $t('contact.description') }}
    </p>
    
    <div class="space-y-2 text-sm text-text-primary-light dark:text-text-primary-dark">
      <p><strong>{{ $t('contact.email_label') }}:</strong> fakhrirasyids@gmail.com</p>
      <p><strong>{{ $t('contact.phone_label') }}:</strong> +62 812-2769-4379</p>
    </div>
  </section>
</template>