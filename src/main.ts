import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router/'
import { createI18n } from 'vue-i18n'
import { installI18nGlobalT } from '@/plugins/i18n-global'

import en from '@/locales/en.json'
import id from '@/locales/id.json'

import '@/styles/tailwind.css'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    id
  }
})

const app = createApp(App)

app.use(router)
app.use(i18n)
installI18nGlobalT(app, i18n)
app.mount('#app')
