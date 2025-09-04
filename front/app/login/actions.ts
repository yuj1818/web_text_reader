'use server';

import { cookies } from 'next/headers';
import { loginUser } from '@/lib/user';
import { LoginInterface } from '@/model/user';

export async function login(formValues: LoginInterface) {
  const { access, refresh } = await loginUser(formValues);

  const cookieStore = await cookies();
  cookieStore.set('accessToken', access, {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });
  cookieStore.set('refreshToken', refresh, {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });
}
