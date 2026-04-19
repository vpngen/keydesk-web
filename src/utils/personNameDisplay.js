import { transliterate } from './transliterate'

/**
 * Имя пользователя с бэка: для ru без изменений, для прочих локалей — латиница.
 */
export function displayPersonName(name, locale) {
  if (name == null || typeof name !== 'string') {
    return name ?? ''
  }
  if (locale === 'ru') {
    return name
  }
  return transliterate(name)
}

/** Поиск по имени: учитывает и кириллицу с бэка, и латиницу (транслит) при locale !== ru */
export function personNameMatchesFilter(userName, filterText, locale) {
  if (!filterText?.trim()) {
    return true
  }
  const f = filterText.toLowerCase()
  const raw = (userName || '').toLowerCase()
  if (raw.includes(f)) {
    return true
  }
  if (locale !== 'ru' && userName) {
    return transliterate(userName).toLowerCase().includes(f)
  }
  return false
}
