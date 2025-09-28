import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useUsersStore = defineStore('users', () => {
  const usersList = ref([]);
  const vipUsersList = ref([]);

  return {
    usersList,
    vipUsersList
  }
})
