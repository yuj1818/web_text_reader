import { LoginInterface, RegisterInterface } from '@/model/user';

const URL = process.env.NEXT_PUBLIC_API_BASE_URL + '/api/accounts/';

export async function loginUser(formValues: LoginInterface) {
  const res = await fetch(URL + 'login/', {
    method: 'POST',
    body: JSON.stringify(formValues),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) throw new Error('로그인 실패');

  return res.json();
}

export async function getRefreshedToken(refreshToken: string) {
  const res = await fetch(URL + 'token/refresh/', {
    method: 'POST',
    body: JSON.stringify({ refresh: refreshToken }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) throw new Error('토큰 갱신 실패');

  return res.json();
}

export async function register(formValues: RegisterInterface) {
  return fetch(URL + 'register/', {
    method: 'POST',
    body: JSON.stringify(formValues),
    headers: { 'Content-Type': 'application/json' },
  });
}
