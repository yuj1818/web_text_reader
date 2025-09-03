import API, { refreshAPI } from './api';
import { getCookie, setCookie, removeCookie } from './cookie';

const URL = 'accounts/';

export interface LoginInterface {
  username: string;
  password: string;
}

export interface RegisterInterface {
  username: string;
  email: string;
  password: string;
}

export const login = (data: LoginInterface) =>
  API.post(URL + 'login/', data).then((res) => {
    const { accessToken, refreshToken } = res.data;
    setCookie('accessToken', accessToken, { path: '/' });
    setCookie('refreshToken', refreshToken, { path: '/' });
    return res.data;
  });

export const register = (data: RegisterInterface) =>
  API.post(URL + 'register/', data).then((res) => res.data);

export const logout = () => {
  removeCookie('accessToken', { path: '/' });
  removeCookie('refreshToken', { path: '/' });
};

export const refresh = () =>
  refreshAPI
    .post(URL + 'token/refresh/', { token: getCookie('refreshToken') })
    .then((res) => {
      const { accessToken, refreshToken } = res.data;
      setCookie('accessToken', accessToken, { path: '/' });
      setCookie('refreshToken', refreshToken, { path: '/' });
      return res.data;
    })
    .catch((err) => {
      if (err.response?.status === 401) {
        logout();
        window.location.replace('/login');
      }
      return null;
    });
