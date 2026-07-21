import {defineStore} from "pinia";
import {ref} from "vue";

export const useProfileStore = defineStore('profile', () => {
  const isVIP = ref(undefined);
  const urlVIP = ref('');
  const uuid = ref('');

  return {
    isVIP,
    urlVIP,
    uuid,
  };
});
