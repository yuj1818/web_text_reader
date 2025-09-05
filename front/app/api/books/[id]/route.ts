import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return new Response(JSON.stringify({ error: 'No token' }), { status: 401 });
  }

  const res = await fetch(`${URL}${pathname}/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return new Response(JSON.stringify({ error: 'No token' }), { status: 401 });
  }

  const res = await fetch(`${URL}${pathname}/`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: '책 삭제 실패' }), {
      status: res.status,
    });
  }

  return new Response(JSON.stringify({ success: '삭제 완료' }), {
    status: res.status,
  });
}
