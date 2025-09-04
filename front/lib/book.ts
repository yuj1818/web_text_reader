const URL = process.env.NEXT_PUBLIC_API_BASE_URL + '/api/books/';

export async function getBookList(accessToken: string | undefined) {
  const res = await fetch(URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  });

  if (!res.ok) throw new Error('책 목록 조회 실패');

  return res.json();
}

export async function getBookData(accessToken: string | undefined, id: string) {
  const res = await fetch(`${URL}${id}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  });

  if (!res.ok) throw new Error('책 정보 조회 실패');

  return res.json();
}
