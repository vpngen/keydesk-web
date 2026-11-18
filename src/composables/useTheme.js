import {computed, ref, watch} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {useProfileStore} from '@/store/profile';
import {themeLocaleJsonUrl} from '@/i18n';
import {COUNTRY_THEMES, THEME_LOCALES, themeForCountry} from '@/const/themes';

// Оверлеи переводов грузятся один раз на тему, сколько бы компонентов ни
// вызвали useTheme(); флаг готовности общий для всех.
const themeMessagesLoading = new Map(); // name -> Promise
const themeMessagesReady = ref('');

async function loadThemeMessages(name, mergeLocaleMessage) {
  if (!themeMessagesLoading.has(name)) {
    themeMessagesLoading.set(name, (async () => {
      for (const locale of THEME_LOCALES) {
        try {
          const res = await fetch(themeLocaleJsonUrl(name, locale), {cache: 'no-cache'});
          if (res.ok) {
            mergeLocaleMessage(locale, await res.json());
          }
        } catch (error) {
          console.error('[theme] locale overlay', name, locale, error);
        }
      }
    })());
  }

  await themeMessagesLoading.get(name);
  themeMessagesReady.value = name;
}

/**
 * Страновое оформление кейдеска.
 *
 * Источник - claim `country` в токене кейдеска (поле `country` в brigade.json).
 * "ru" или отсутствие claim'а - обычный вид; известная страна (сейчас "kg")
 * включает свою тему и имеет приоритет над VIP- и PRO-оформлением, остальные
 * бригады не меняются никак.
 */
export function useTheme() {
  const profileStore = useProfileStore();
  const {country} = storeToRefs(profileStore);
  const {mergeLocaleMessage} = useI18n({useScope: 'global'});

  const themeName = computed(() => themeForCountry(country.value));
  const themeConfig = computed(() => (themeName.value ? COUNTRY_THEMES[themeName.value] : null));
  const isThemed = computed(() => Boolean(themeName.value));
  const isThemeTextReady = computed(() => isThemed.value && themeMessagesReady.value === themeName.value);

  watch(themeName, (name) => {
    if (name) {
      loadThemeMessages(name, mergeLocaleMessage);
    }
  }, {immediate: true});

  return {themeName, themeConfig, isThemed, isThemeTextReady};
}
