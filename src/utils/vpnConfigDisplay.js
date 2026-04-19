import { transliterate } from './transliterate'

/**
 * Подпись VPN из vpn_sistems_config.json: для ru — как в файле;
 * для остальных локалей кириллица транслитерируется, латиница без изменений.
 */
export function displayVpnNameFromConfig(configKey, vpnNameMap, locale) {
  const raw = vpnNameMap?.[configKey] ?? configKey
  if (!raw || typeof raw !== 'string') {
    return configKey
  }
  if (locale === 'ru') {
    return raw
  }
  return transliterate(raw)
}
