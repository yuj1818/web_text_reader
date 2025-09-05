'use client';

import { useQuery } from '@tanstack/react-query';
import LoadingIndicator from '../common/LoadingIndicator';
import { BookDashed, CircleX } from 'lucide-react';
import { Book } from '@/model/book';
import BookItem from './BookItem';
import { getBookList } from '@/lib/book';
import { getCookie } from '@/lib/cookies';

function BookList({ initialBooks }: { initialBooks: Book[] }) {
  const accessToken = getCookie('accessToken');

  const { status, data, isFetching } = useQuery({
    queryKey: ['books'],
    queryFn: () => getBookList(accessToken),
    initialData: initialBooks,
    enabled: !!accessToken,
  });

  if (status === 'error') {
    return (
      <div className="w-full flex-1 min-h-0 flex flex-col gap-4 items-center justify-center">
        <CircleX size="4rem" />
        <span>목록을 불러올 수 없습니다</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full flex-1 min-h-0 flex flex-col gap-4 items-center justify-center">
        <BookDashed size="4rem" />
        <span>업로드 된 책이 없습니다</span>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 min-h-0 overflow-y-auto flex flex-col gap-2">
      {isFetching && <LoadingIndicator />}
      {data.map((book: Book) => (
        <BookItem key={book.id} book={book} />
      ))}
    </div>
  );
}

export default BookList;
