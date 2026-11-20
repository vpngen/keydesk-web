import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import {safeGetItem, safeSetItem} from '@/utils/safeStorage';

const STORAGE_KEY = 'proAchievements.v1';

/**
 * Что из ачивок уже показано и очередь карточек на показ. Флаги живут в
 * localStorage этого браузера (как isProTourSeen); следующий шаг - хранить их
 * в кейдеске (pro_achievements в brigade.json), чтобы второй браузер не
 * показывал всё заново.
 */
export const useProAchievementsStore = defineStore('proAchievements', () => {
  const unlocked = ref({});
  const queue = ref([]);
  const isLoaded = ref(false);

  const current = computed(() => queue.value[0] || null);

  const persist = () => safeSetItem(STORAGE_KEY, JSON.stringify({unlocked: unlocked.value}));

  const load = () => {
    try {
      const saved = JSON.parse(safeGetItem(STORAGE_KEY)) || {};
      unlocked.value = saved.unlocked || {};
    } catch {
      unlocked.value = {};
    }
    isLoaded.value = true;
  };

  const has = (id) => Boolean(unlocked.value[id]);

  /** Отметить показанной без карточки (базовая линия при первом входе). */
  const grant = (id) => {
    if (has(id)) return;
    unlocked.value = {...unlocked.value, [id]: new Date().toISOString()};
    persist();
  };

  /** Отметить и поставить карточку в очередь; false, если уже была. */
  const unlock = (id) => {
    if (has(id)) return false;
    grant(id);
    queue.value = queue.value.concat([id]);
    return true;
  };

  /** Показать карточку без записи (дев-превью). */
  const preview = (id) => {
    if (!queue.value.includes(id)) queue.value = queue.value.concat([id]);
  };

  const dismiss = () => {
    queue.value = queue.value.slice(1);
  };

  const reset = () => {
    unlocked.value = {};
    queue.value = [];
    persist();
  };

  return {
    unlocked,
    queue,
    current,
    isLoaded,
    load,
    has,
    grant,
    unlock,
    preview,
    dismiss,
    reset,
  };
});
