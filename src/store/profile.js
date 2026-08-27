import {defineStore} from "pinia";
import {ref} from "vue";

export const useProfileStore = defineStore('profile', () => {
  const isVIP = ref(undefined);
  const urlVIP = ref('');
  const isPRO = ref(undefined);
  const urlPRO = ref('');
  const uuid = ref('');

  return {
    isVIP,
    urlVIP,
    isPRO,
    urlPRO,
    uuid,
  };
});
