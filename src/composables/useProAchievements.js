import {watch} from 'vue';
import {storeToRefs} from 'pinia';
import {useProKeysStore} from '@/store/proKeys';
import {useProAchievementsStore} from '@/store/proAchievements';
import * as proApi from '@/api/pro';
import {ACHIEVEMENT_IDS, devKnob, economicsOf, keyAchievements, moneyAchievements} from '@/utils/proAchievements';

/**
 * Триггеры ачивок PRO. Смотрит на стор ключей (он меняет список только после
 * ответа API, так что «после успешного выпуска» выполняется само) и на
 * экономику цикла из /pro/analytics. При первом входе уже выполненные условия
 * отмечаются молча: ачивка - про момент события, а не про прошлое. Единственное
 * исключение - «Начало PRO», она показывается на первом входе.
 */
export function useProAchievements() {
  const keysStore = useProKeysStore();
  const store = useProAchievementsStore();
  const {keysList, isLoaded} = storeToRefs(keysStore);
  const {current} = storeToRefs(store);

  let baselined = false;
  let economicsTimer = null;

  const apply = (ids, silent) => {
    ids.forEach((id) => (silent ? store.grant(id) : store.unlock(id)));
  };

  const evaluateEconomics = async (silent) => {
    try {
      const analytics = await proApi.fetchProAnalytics(keysList.value);
      apply(moneyAchievements(economicsOf(analytics)), silent);
    } catch {
      /* аналитика недоступна - денежные ачивки подождут следующего изменения */
    }
  };

  const scheduleEconomics = () => {
    clearTimeout(economicsTimer);
    economicsTimer = setTimeout(() => evaluateEconomics(false), 400);
  };

  const start = async () => {
    store.load();
    const knob = devKnob('proAch');
    if (knob === 'reset') store.reset();

    apply(keyAchievements(keysList.value), true);
    await evaluateEconomics(true);
    baselined = true;
    store.unlock('pro_start');

    if (knob && ACHIEVEMENT_IDS.includes(knob)) store.preview(knob);
  };

  watch(isLoaded, (loaded) => {
    if (loaded && !baselined) start();
  }, {immediate: true});

  watch(keysList, () => {
    if (!baselined) return;
    apply(keyAchievements(keysList.value), false);
    scheduleEconomics();
  }, {deep: true});

  return {current, dismiss: store.dismiss};
}
