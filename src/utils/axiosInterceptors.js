import axios from 'axios';
import {useConstructionStore} from '@/store/construction';

let responseInterceptorId = null;

export const setupAxiosInterceptors = () => {
  if (responseInterceptorId !== null) return;

  responseInterceptorId = axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 503) {
        const constructionStore = useConstructionStore();
        constructionStore.show(error.response.data);
      }

      return Promise.reject(error);
    }
  );
};
