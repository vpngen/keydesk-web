import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useRoute} from 'vue-router';
import {useProfileStore} from '@/store/profile';
import {isDevOrStageHost} from '@/const/api';
import {themeForCountry} from '@/const/themes';

const PRO_ROUTES = ['Home', 'ProInvoices', 'ProAnalytics', 'ProHelp'];

/**
 * PRO-режим активен, когда JWT принес claim `pro` (боевой путь) либо на
 * dev/stage хосте запрошен ?pro=true. Действует только на PRO-маршрутах —
 * /notifications остается в обычной теме.
 *
 * Страновое оформление (claim `country`, например "kg") имеет приоритет:
 * такая бригада показывает свой вид даже с флагом PRO.
 */
export function useProLayout() {
  const route = useRoute();
  const profileStore = useProfileStore();
  const {isPRO, country} = storeToRefs(profileStore);

  const isProRequested = computed(() => isDevOrStageHost && route.query.pro === 'true');
  const isProRoute = computed(() => PRO_ROUTES.includes(route.name));
  const hasCountryTheme = computed(() => Boolean(themeForCountry(country.value)));
  const isProLayout = computed(() => (isPRO.value || isProRequested.value) && isProRoute.value && !hasCountryTheme.value);

  return {isProLayout, isProRequested};
}
