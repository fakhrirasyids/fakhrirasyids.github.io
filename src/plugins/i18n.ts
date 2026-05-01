import { createI18n } from 'vue-i18n'

export const supportedLocales = ['en', 'id', 'zh'] as const
export type AppLocale = (typeof supportedLocales)[number]

const defaultLocale: AppLocale = 'en'
const localeLoaders: Record<AppLocale, () => Promise<{ default: Record<string, unknown> }>> = {
  en: () => import('@/locales/en.json'),
  id: () => import('@/locales/id.json'),
  zh: () => import('@/locales/zh.json'),
}

const loadedLocales = new Set<AppLocale>()

function isSupportedLocale(locale: string | null): locale is AppLocale {
  return !!locale && supportedLocales.includes(locale as AppLocale)
}

export function getInitialLocale(): AppLocale {
  const savedLocale = localStorage.getItem('locale')
  return isSupportedLocale(savedLocale) ? savedLocale : defaultLocale
}

export const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: defaultLocale,
  messages: {},
})

export async function loadLocale(locale: AppLocale) {
  if (loadedLocales.has(locale)) return

  const messages = await localeLoaders[locale]()
  i18n.global.setLocaleMessage(locale, messages.default)
  loadedLocales.add(locale)
}

export async function setLocale(locale: AppLocale) {
  const nextLocale = isSupportedLocale(locale) ? locale : defaultLocale

  await loadLocale(nextLocale)
  i18n.global.locale.value = nextLocale
  document.documentElement.lang = nextLocale
  localStorage.setItem('locale', nextLocale)
}
