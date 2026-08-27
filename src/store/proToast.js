import {defineStore} from 'pinia';
import {ref} from 'vue';

const TOAST_DURATION = 2200;

export const useProToastStore = defineStore('proToast', () => {
  const text = ref('');
  let timer = null;

  const show = (message) => {
    text.value = message;
    clearTimeout(timer);
    timer = setTimeout(() => {
      text.value = '';
    }, TOAST_DURATION);
  };

  return {
    text,
    show,
  };
});
