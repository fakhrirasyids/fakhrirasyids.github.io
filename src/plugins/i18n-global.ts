// src/plugins/i18n-global.ts
import type { App } from 'vue'
import type { I18n } from 'vue-i18n'

export const installI18nGlobalT = <
  Messages extends Record<string, unknown> = {},
  DateTimeFormats extends Record<string, unknown> = {},
  NumberFormats extends Record<string, unknown> = {},
  Locale extends string = string,
>(
  app: App,
  i18n: I18n<Messages, DateTimeFormats, NumberFormats, Locale>
) => {
  app.config.globalProperties.$t = i18n.global.t
}
