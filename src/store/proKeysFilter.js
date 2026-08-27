import {defineStore} from 'pinia';
import {ref} from 'vue';

export const useProKeysFilterStore = defineStore('proKeysFilter', () => {
  const filterText = ref('');
  const selectedTier = ref('all');
  const selectedStatus = ref('all');
  const selectedSort = ref('until');
  const view = ref('cards');

  const reset = () => {
    filterText.value = '';
    selectedTier.value = 'all';
    selectedStatus.value = 'all';
  };

  /** Пресеты для диплинков из аналитики («Показать неактивные» и т.п.). */
  const applyPreset = ({tier = 'all', status = 'all', sort = 'until', text = '', viewMode = 'cards'}) => {
    selectedTier.value = tier;
    selectedStatus.value = status;
    selectedSort.value = sort;
    filterText.value = text;
    view.value = viewMode;
  };

  return {
    filterText,
    selectedTier,
    selectedStatus,
    selectedSort,
    view,
    reset,
    applyPreset,
  };
});
