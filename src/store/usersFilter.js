import {defineStore} from 'pinia';
import {ref, watch} from 'vue';
import {sortingMap, statusMap} from '@/assets/constants/profileConstants.js';

const PAGE_SIZE = 20;

export const useUsersFilterStore = defineStore('usersFilter', () => {
  const filterText = ref('');
  const selectedSort = ref(sortingMap.dateAsc);
  const selectedStatus = ref(statusMap.all);
  const currentPage = ref(1);

  watch([filterText, selectedSort, selectedStatus], () => {
    currentPage.value = 1;
  });

  const setPage = (page) => {
    if (typeof page !== 'number') return;
    if (page < 1) return;
    currentPage.value = page;
  };

  const reset = () => {
    filterText.value = '';
    selectedSort.value = sortingMap.dateAsc;
    selectedStatus.value = statusMap.all;
    currentPage.value = 1;
  };

  return {
    filterText,
    selectedSort,
    selectedStatus,
    currentPage,
    pageSize: PAGE_SIZE,
    setPage,
    reset,
  };
});
