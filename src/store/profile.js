import {defineStore} from "pinia";

export const useProfileStore = defineStore('profile', {
  state: () => ({
    isVIP: undefined,
    urlVIP: '',
    uuid: '',
  })
});
