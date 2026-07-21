import {defineStore} from 'pinia';
import {ref} from 'vue';

export const useConstructionStore = defineStore('construction', () => {
  const isShown = ref(false);
  const till = ref('');
  const message = ref('');

  const show = (data = {}) => {
    const endDate = data.till ? new Date(data.till) : null;

    if (endDate && !Number.isNaN(endDate.getTime())) {
      const tillDate = endDate.toLocaleDateString('ru');
      const tillHours = endDate.getHours();
      const tillMinutes = endDate.getMinutes();
      till.value = `${tillDate} ${tillHours}:${tillMinutes}`;
    } else {
      till.value = '';
    }

    message.value = data.message || '';
    isShown.value = true;
  };

  const hide = () => {
    isShown.value = false;
  };

  return {
    isShown,
    till,
    message,
    show,
    hide,
  };
});
