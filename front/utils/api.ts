import axios from 'axios';
import { getCookie } from './cookie';
import { refresh } from './user';

export const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const API = axios.create({
  baseURL: URL,
  withCredentials: true,
});

export const refreshAPI = axios.create({
  baseURL: URL,
  withCredentials: true,
});

API.interceptors.request.use(
  // 인증 헤더 넣기
  (config) => {
    const accessToken = getCookie('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = accessToken;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const {
      config,
      response: { status },
    } = err;
    // accessToken 만료 시, 토큰 갱신
    if (status === 401) {
      const res = await refresh();
      if (res) {
        // 진행 중이던 요청 이어서 하기
        return API(config);
      } else {
        // refreshToken 만료 시, 에러 반환
        return Promise.reject(err);
      }
    }
    return Promise.reject(err);
  },
);

export default API;
