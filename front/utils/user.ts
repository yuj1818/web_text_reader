import API, { refreshAPI } from './api';
import { getCookie, setCookie, removeCookie } from './cookie';

const URL = 'accounts/';

interface LoginInterface {
  username: string;
  password: string;
}

interface RegisterInterface {
  username: string;
  email: string;
  password: string;
}

export const login = (data: LoginInterface) => {
  return API.post(URL + 'login/', data)
    .then((res) => {
      const { accessToken, refreshToken } = res.data;

      setCookie('accessToken', `Bearer ${accessToken}`, { path: '/' });
      setCookie('refreshToken', `Bearer ${refreshToken}`, { path: '/' });

      return res;
    })
    .catch((err) => {
      console.error('로그인 에러:', err);
      return err;
    });
};

export const logout = () => {
  removeCookie('accessToken', { path: '/' });
  removeCookie('refreshToken', { path: '/' });
};

export const refresh = () => {
  return refreshAPI
    .post(URL + 'token/refresh/', {
      token: getCookie('refreshToken'),
    })
    .then((res) => {
      const { accessToken, refreshToken } = res.data;

      setCookie('accessToken', `Bearer ${accessToken}`, { path: '/' });
      setCookie('refreshToken', `Bearer ${refreshToken}`, { path: '/' });

      return res;
    })
    .catch((err) => {
      if (err.response.status === 401) {
        console.error(err.response.data.message);
        logout();
        window.location.replace('/login');
      }
      return;
    });
};

export const register = (data: RegisterInterface) => {
  return API.post(URL + 'register/', data)
    .then((res) => res)
    .catch((err) => {
      console.error(err);
      return err;
    });
};
