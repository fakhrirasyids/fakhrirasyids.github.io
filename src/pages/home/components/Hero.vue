<template>
  <section class="py-12 px-6 max-w-6xl mx-auto h-auto md:h-[600px] flex flex-col md:flex-row md:items-center gap-10">
    <!-- Left content -->
    <div class="flex-1 text-center md:text-left space-y-4">
      <h1 class="text-4xl md:text-5xl font-bold text-text-primary-light dark:text-text-primary-dark">
        {{ $t('hero.title') }}
        <span class="inline-block animate-waving-hand origin-bottom-left">👋</span>
      </h1>

      <h2 class="text-2xl md:text-2xl font-normal text-text-secondary-light dark:text-text-secondary-dark min-h-[1.5em]">
        {{ typedText }}<span class="border-r-2 border-text-secondary-light dark:border-text-secondary-dark animate-blink ml-1"></span>
      </h2>

      <!-- Download CV + Or + Projects -->
      <div class="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-start gap-2 sm:gap-4 text-sm">
        <!-- Download CV -->
        <a
          href="/cv.pdf"
          target="_blank"
          class="inline-flex self-center sm:self-auto bg-green-light dark:bg-green-dark text-inverted-dark px-4 py-2 rounded-full font-medium hover:bg-border-light dark:hover:bg-border-dark transition"
        >
          {{ $t('header.download_cv') }}
        </a>

        <!-- Or -->
        <span class="text-text-muted-light dark:text-text-muted-dark self-center sm:self-auto">
          or
        </span>

        <!-- See Projects -->
        <a
          href="#projects"
          class="inline-flex self-center sm:self-auto bg-inverted-light dark:bg-inverted-dark text-inverted-dark dark:text-inverted-light px-4 py-2 rounded-full font-medium hover:bg-border-light dark:hover:bg-border-dark transition"
        >
          {{ $t('hero.check_projects') }}
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
            class="w-6 h-6 transition duration-300 opacity-75 dark:invert dark:brightness-75"
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
            class="w-6 h-6 transition duration-300 opacity-75 dark:invert dark:brightness-75"
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
            class="h-6 w-auto transition duration-300 opacity-75 dark:invert dark:brightness-75"
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

<script setup>
import { ref, onMounted } from 'vue'

const descriptions = [
  'Mobile Developer',
  'Software Engineer'
]

const typedText = ref('')
let currentIndex = 0
let charIndex = 0
let isDeleting = false

const typeSpeed = 100
const deleteSpeed = 60
const pauseTime = 1000

function typeLoop() {
  const currentText = descriptions[currentIndex]

  if (!isDeleting) {
    typedText.value = currentText.substring(0, charIndex + 1)
    charIndex++

    if (charIndex === currentText.length) {
      isDeleting = true
      setTimeout(typeLoop, pauseTime)
    } else {
      setTimeout(typeLoop, typeSpeed)
    }
  } else {
    typedText.value = currentText.substring(0, charIndex - 1)
    charIndex--

    if (charIndex === 0) {
      isDeleting = false
      currentIndex = (currentIndex + 1) % descriptions.length
      setTimeout(typeLoop, 300)
    } else {
      setTimeout(typeLoop, deleteSpeed)
    }
  }
}

onMounted(() => {
  typeLoop()
})
</script>


<style scoped>
@keyframes wave {
  0% { transform: rotate(0deg); }
  10% { transform: rotate(14deg); }
  20% { transform: rotate(-8deg); }
  30% { transform: rotate(14deg); }
  40% { transform: rotate(-4deg); }
  50% { transform: rotate(10deg); }
  60% { transform: rotate(0deg); }
  100% { transform: rotate(0deg); }
}

.animate-waving-hand {
  animation: wave 2.2s infinite;
  display: inline-block;
  transform-origin: 70% 70%;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.animate-blink {
  animation: blink 1s step-end infinite;
}
</style>