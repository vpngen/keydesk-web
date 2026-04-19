import { createI18n } from 'vue-i18n'

const STORAGE_KEY = 'app_locale'

function browserPreferredLocale() {
  if (typeof navigator === 'undefined') {
    return 'ru'
  }
  const list = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const raw of list) {
    if (!raw) continue
    const code = String(raw).toLowerCase().split('-')[0]
    if (code === 'ru') {
      return 'ru'
    }
  }
  return 'en'
}

function getInitialLocale() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'ru') {
      return saved
    }
  } catch {
    /* ignore */
  }
  return browserPreferredLocale()
}

/** Базовый путь приложения (Vue CLI `publicPath`) + путь к JSON в `public/locales/`. */
function localeJsonUrl(filename) {
  const raw = process.env.BASE_URL || '/'
  const base = raw.endsWith('/') ? raw : `${raw}/`
  return `${base}locales/${filename}`
}

/**
 * Загружает переводы по HTTP из `public/locales/*.json` (после сборки — из корня деплоя).
 * Файлы можно править на сервере без пересборки фронта.
 */
export async function setupI18n() {
  const ruRes = await fetch(localeJsonUrl('ru.json'), { cache: 'no-cache' })
  const enRes = await fetch(localeJsonUrl('en.json'), { cache: 'no-cache' })

  if (!ruRes.ok) {
    throw new Error(`Failed to load ru.json: ${ruRes.status}`)
  }
  if (!enRes.ok) {
    throw new Error(`Failed to load en.json: ${enRes.status}`)
  }

  const [ru, en] = await Promise.all([ruRes.json(), enRes.json()])

  return createI18n({
    legacy: false,
    locale: getInitialLocale(),
    fallbackLocale: 'ru',
    messages: {
      ru,
      en,
    },
  })
}

export function persistLocale(locale) {
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    /* ignore */
  }
}
