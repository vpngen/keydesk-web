import {defineStore} from 'pinia';
import {ref} from 'vue';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import {apiLink} from '@/const/api';
import {useProfileStore} from '@/store/profile';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(null);
  let tokenPromise = null;

  const fetchToken = ({force = false} = {}) => {
    if (tokenPromise && !force) {
      return tokenPromise;
    }

    const profileStore = useProfileStore();

    tokenPromise = axios.post(`${apiLink}/token`)
      .then((r) => {
        token.value = r.data.Token;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;

        const decoded = jwtDecode(token.value);
        profileStore.isVIP = decoded.vip;
        profileStore.urlVIP = decoded.vip_url;
        profileStore.uuid = decoded.sub;

        return token.value;
      })
      .catch((error) => {
        tokenPromise = null;
        throw error;
      });

    return tokenPromise;
  };

  return {
    token,
    fetchToken,
  };
});
