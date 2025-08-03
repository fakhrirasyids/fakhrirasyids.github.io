<template>
  <div class="relative overflow-hidden w-full bg-background-light dark:bg-background-dark">
    <!-- Background grid animation -->
    <div class="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
      <div class="grid w-full h-full grid-cols-6 md:grid-cols-12 grid-rows-8 md:grid-rows-6 gap-[8px] p-[8px] box-border">
        <div
          v-for="(cell, index) in gridCells"
          :key="index"
          class="bg-blink-cell rounded-sm"
          :style="{ opacity: cell.active ? cell.opacity : 0 }"
        ></div>
      </div>
    </div>

    <!-- Hero content -->
    <section
      class="relative py-12 px-6 max-w-6xl mx-auto h-auto md:h-[600px] flex flex-col md:flex-row md:items-center gap-10"
    >
      <!-- Left content -->
      <div class="flex-1 text-center md:text-left space-y-4 z-10">
        <h1 class="text-4xl md:text-5xl font-bold text-text-primary-light dark:text-text-primary-dark transition">
          {{ $t('hero.title') }}
          <span class="inline-block animate-waving-hand origin-bottom-left">👋</span>
        </h1>

        <h2
          class="text-2xl md:text-2xl font-normal text-text-secondary-light dark:text-text-secondary-dark min-h-[1.5em] transition"
        >
          {{ typedText }}
          <span
            class="border-r-2 border-text-secondary-light dark:border-text-secondary-dark animate-blink ml-1"
          ></span>
        </h2>

        <!-- CV and projects -->
        <div class="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-start gap-2 sm:gap-4 text-sm py-6">
          <a
            href="/cv.pdf"
            target="_blank"
            class="inline-flex self-center sm:self-auto bg-green-light dark:bg-green-dark text-inverted-dark px-4 py-2 rounded-full font-medium hover:bg-border-light dark:hover:bg-border-dark transition"
          >
            {{ $t('header.download_cv') }}
          </a>

          <span class="text-text-muted-light dark:text-text-muted-dark self-center sm:self-auto">
            {{ $t('hero.or') }}
          </span>

          <a
            href="#projects"
            class="inline-flex self-center sm:self-auto items-center border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark px-4 py-2 rounded-full font-medium hover:bg-border-light dark:hover:bg-border-dark bg-background-light dark:bg-background-dark hover:text-primary-dark dark:hover:text-primary-light transition duration-200"
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
      </div>

      <!-- Right image section -->
      <div class="flex-1 flex justify-center relative z-10">
        <div
          class="absolute bg-onSurface-light dark:bg-surfaceVariant-dark z-0"
          :class="[
            'border-[10px] border-background-light dark:border-background-dark',
            'w-[260px] h-[220px] translate-y-[20px]',
            'md:w-[360px] md:h-[360px] md:translate-x-[20px] md:translate-y-[20px]',
            'rounded-none transition-all duration-300'
          ]"
        ></div>

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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const typedText = ref('')
const descriptions = ['Mobile Developer', 'Software Engineer']

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

// --- Snake grid logic ---
const isMobile = window.innerWidth < 768
const rows = isMobile ? 8 : 6
const cols = isMobile ? 6 : 12
const totalCells = rows * cols
const gridCells = ref(Array.from({ length: totalCells }, () => ({ active: false, opacity: 0 })))

const tailLength = 10
let snakePath = [0]
let visited = new Set([0])

function getNextIndex(index) {
  const directions = []
  const row = Math.floor(index / cols)
  const col = index % cols

  if (row > 0) directions.push(index - cols)
  if (row < rows - 1) directions.push(index + cols)
  if (col > 0) directions.push(index - 1)
  if (col < cols - 1) directions.push(index + 1)

  const unvisited = directions.filter(i => !visited.has(i))
  return (unvisited.length ? unvisited : directions)[Math.floor(Math.random() * (unvisited.length || directions.length))]
}

function startSnakeAnimation() {
  let head = 0

  function step() {
    // Clear all opacities
    gridCells.value.forEach(cell => {
      cell.active = false
      cell.opacity = 0
    })

    visited.add(head)
    snakePath.push(head)

    if (snakePath.length > tailLength) {
      const tail = snakePath.shift()
      visited.delete(tail)
    }

    // Animate snake with fading tail
    snakePath.forEach((index, i) => {
      const strength = (i + 1) / tailLength // Tail is stronger than head
      if (gridCells.value[index]) {
        gridCells.value[index].active = true
        gridCells.value[index].opacity = strength
      }
    })

    head = getNextIndex(head)
    setTimeout(step, 180) // slower step
  }

  step()
}

onMounted(() => {
  typeLoop()
  startSnakeAnimation()
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

.bg-blink-cell {
  background-color: #ECEEF1;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.dark .bg-blink-cell {
  background-color: #12162a;
}
</style>
