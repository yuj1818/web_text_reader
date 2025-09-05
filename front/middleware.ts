// app/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { getRefreshedToken } from '@/lib/user';

const AUTH_ROUTES = ['/login', '/register'];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // 인증 필요 없는 경로
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r)))
    return NextResponse.next();

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  // 토큰 없으면 로그인 페이지
  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    // accessToken 유효하면 통과
    if (accessToken) {
      const { exp } = jwtDecode<{ exp: number }>(accessToken);
      if (exp > Date.now() / 1000) return NextResponse.next();
    }

    // accessToken 만료 시 refreshToken으로 갱신
    if (refreshToken) {
      const refreshRes = await getRefreshedToken(refreshToken);
      if (refreshRes.access) {
        const response = NextResponse.next();
        response.cookies.set('accessToken', refreshRes.access, {
          httpOnly: true,
          path: '/',
          secure: false,
        });

        return response;
      }
      const response = NextResponse.redirect(new URL('/login', req.url));
      response.cookies.delete('refreshToken');
      return response;
    }
    return NextResponse.redirect(new URL('/login', req.url));
  } catch {
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.delete('refreshToken');
    return response;
  }
}

export const config = {
  matcher: ['/', '/book/:path*'],
};
