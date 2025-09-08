'use client';

import { useQuery } from '@tanstack/react-query';
import LoadingIndicator from '../common/LoadingIndicator';
import { BookDashed, CircleX } from 'lucide-react';
import { Book } from '@/model/book';
import BookItem from './BookItem';
import { getBookList } from '@/lib/book';
import { ModalContext } from '@/contexts/ModalContext';

function BookList({ initialBooks }: { initialBooks: Book[] }) {
  const { status, data, isFetching } = useQuery({
    queryKey: ['books'],
    queryFn: () => getBookList(),
    initialData: initialBooks,
  });

  if (status === 'error') {
    return (
      <div className="w-full flex-1 min-h-0 flex flex-col gap-4 items-center justify-center">
        <CircleX size="4rem" />
        <span>목록을 불러올 수 없습니다</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full flex-1 min-h-0 flex flex-col gap-4 items-center justify-center">
        <BookDashed size="4rem" />
        <span>업로드 된 책이 없습니다</span>
      </div>
    );
  }

  return (
    <ModalContext>
      <div className="w-full flex-1 min-h-0 overflow-y-auto flex flex-col gap-2">
        {isFetching && <LoadingIndicator />}
        {data &&
          data.map((book: Book) => <BookItem key={book.id} book={book} />)}
      </div>
    </ModalContext>
  );
}

export default BookList;
