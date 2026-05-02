import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router/'
import { getInitialLocale, i18n, loadLocale, setLocale } from '@/plugins/i18n'
import { installI18nGlobalT } from '@/plugins/i18n-global'

import '@/styles/tailwind.css'

const initialLocale = getInitialLocale()

await Promise.all([
  loadLocale('en'),
  initialLocale === 'en' ? Promise.resolve() : loadLocale(initialLocale),
])
await setLocale(initialLocale)

const app = createApp(App)

app.use(router)
app.use(i18n)
installI18nGlobalT(app, i18n)
app.mount('#app')
