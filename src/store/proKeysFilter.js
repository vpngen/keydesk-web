import {defineStore} from 'pinia';
import {ref} from 'vue';

export const useProKeysFilterStore = defineStore('proKeysFilter', () => {
  const filterText = ref('');
  const selectedTier = ref('all');
  const selectedStatus = ref('all');
  const selectedSort = ref('until');
  const view = ref('cards');
  // Точная выборка из рекомендации аналитики (список id) - снимается чипом в тулбаре.
  const keyIds = ref(null);
  // Подпись чипа выборки («новые за 30 дней» и т.п.).
  const keyIdsLabel = ref('');

  const reset = () => {
    filterText.value = '';
    selectedTier.value = 'all';
    selectedStatus.value = 'all';
    keyIds.value = null;
    keyIdsLabel.value = '';
  };

  /** Пресеты для диплинков из аналитики («Показать неактивные» и т.п.). */
  const applyPreset = ({tier = 'all', status = 'all', sort = 'until', text = '', viewMode = 'cards', ids = null, label = ''}) => {
    selectedTier.value = tier;
    selectedStatus.value = status;
    selectedSort.value = sort;
    filterText.value = text;
    view.value = viewMode;
    keyIds.value = ids;
    keyIdsLabel.value = label;
  };

  return {
    filterText,
    selectedTier,
    selectedStatus,
    selectedSort,
    view,
    keyIds,
    keyIdsLabel,
    reset,
    applyPreset,
  };
});
