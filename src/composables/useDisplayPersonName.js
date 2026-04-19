import { useI18n } from 'vue-i18n'
import { displayPersonName } from '@/utils/personNameDisplay'

export function useDisplayPersonName() {
  const { locale } = useI18n()

  const displayName = (name) => displayPersonName(name, locale.value)

  return { displayName, locale }
}
