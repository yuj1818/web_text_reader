import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!accessToken || !refreshToken) {
    return new Response(JSON.stringify({ error: 'No token' }), { status: 401 });
  }

  const res = await fetch(`${URL}${pathname}/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refreshToken,
    }),
  });

  if (res.status != 204) {
    return new Response(JSON.stringify({ error: '로그아웃 실패' }), {
      status: res.status,
    });
  }

  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  return new Response(null, { status: 204 });
}
