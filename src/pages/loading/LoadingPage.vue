<template>
  <transition name="fade-slide-up">
    <div
      v-if="visible"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-background-light dark:bg-background-dark overflow-hidden"
    >
      <!-- Glowing Logo -->
      <div class="relative w-full max-w-xs h-40 flex items-center justify-center">
        <img
          src="/assets/logo/asset-fakhri-porto-logo.svg"
          alt="Logo"
          class="w-24 h-24 animate-logo-glow"
        />
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const visible = ref(true)
const router = useRouter()

onMounted(async () => {
  await router.isReady()

  // Wait before triggering leave transition
  setTimeout(() => {
    visible.value = false
  }, 1000)
})
</script>

<style scoped>
/* Fade + Slide-Up transition */
.fade-slide-up-enter-active,
.fade-slide-up-leave-active {
  transition: all 0.6s ease;
}
.fade-slide-up-enter-from,
.fade-slide-up-leave-to {
  opacity: 0;
  transform: translateY(-250px);
}

/* Glowing Logo Animation */
@keyframes logo-glow {
  0% {
    filter: drop-shadow(0 0 0px #60a5fa);
    transform: scale(0.95);
    opacity: 0;
  }
  100% {
    filter: drop-shadow(0 0 12px #60a5fa) drop-shadow(0 0 24px #60a5fa);
    transform: scale(1);
    opacity: 1;
  }
}
.animate-logo-glow {
  animation: logo-glow 1.2s ease-out forwards;
}
</style>
