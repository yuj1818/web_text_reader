const URL = process.env.NEXT_PUBLIC_BASE_URL + '/api/books/';

export async function getBookList(headerOptions?: Record<string, string>) {
  const res = await fetch(URL, {
    method: 'GET',
    credentials: 'include',
    headers: {
      ...headerOptions,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) throw new Error('책 목록 조회 실패');

  return res.json();
}

export async function getBookData(
  id: string,
  headerOptions?: Record<string, string>,
) {
  const res = await fetch(`${URL}${id}/`, {
    method: 'GET',
    headers: {
      ...headerOptions,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!res.ok) throw new Error('책 정보 조회 실패');

  return res.json();
}

export async function deleteBook(id: number) {
  const res = await fetch(`${URL}${id}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!res.ok) throw new Error('책 삭제 실패');

  return res;
}

export async function uploadBook(data: FormData) {
  const res = await fetch(`${URL}upload/`, {
    method: 'POST',
    credentials: 'include',
    body: data,
  });

  if (!res.ok) throw new Error('책 업로드 실패');

  return res;
}
