import { ref, watchEffect, onMounted } from 'vue'

const isDark = ref(true)

export function useDarkMode() {
  const toggleDark = () => {
    isDark.value = !isDark.value
    updateHtmlClass()
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  const updateHtmlClass = () => {
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  onMounted(() => {
    const saved = localStorage.getItem('theme')

    if (saved === 'dark') isDark.value = true
    else if (saved === 'light') isDark.value = false
    else isDark.value = true 

    updateHtmlClass()
  })

  watchEffect(updateHtmlClass)

  return { isDark, toggleDark }
}
