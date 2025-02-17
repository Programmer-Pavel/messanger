import { router } from '@app/router';
import { ENV } from '@shared/config/env';
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: ENV.API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      router.navigate('/login');
    }
    return Promise.reject(error);
  },
);
