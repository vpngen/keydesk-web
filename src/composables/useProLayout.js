import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useRoute} from 'vue-router';
import {useProfileStore} from '@/store/profile';
import {isDevOrStageHost} from '@/const/api';

const PRO_ROUTES = ['Home', 'ProInvoices', 'ProAnalytics', 'ProHelp'];

/**
 * PRO-режим активен, когда JWT принес claim `pro` (боевой путь) либо на
 * dev/stage хосте запрошен ?pro=true. Действует только на PRO-маршрутах —
 * /notifications остается в обычной теме.
 */
export function useProLayout() {
  const route = useRoute();
  const profileStore = useProfileStore();
  const {isPRO} = storeToRefs(profileStore);

  const isProRequested = computed(() => isDevOrStageHost && route.query.pro === 'true');
  const isProRoute = computed(() => PRO_ROUTES.includes(route.name));
  const isProLayout = computed(() => (isPRO.value || isProRequested.value) && isProRoute.value);

  return {isProLayout, isProRequested};
}
