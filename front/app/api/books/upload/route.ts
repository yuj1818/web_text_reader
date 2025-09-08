import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return new Response(JSON.stringify({ error: 'No token' }), { status: 401 });
  }

  const formData = await req.formData();

  // 백엔드 요청 시 Authorization 헤더로 토큰 전달
  const res = await fetch(`${URL}${pathname}/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), { status: 200 });
}
