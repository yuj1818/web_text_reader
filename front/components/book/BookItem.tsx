import { Book } from '@/model/book';
import dayjs from 'dayjs';
import { BookText } from 'lucide-react';

function BookItem({ book }: { book: Book }) {
  return (
    <div className="flex items-center rounded border border-foreground p-4 cursor-pointer">
      <BookText size="1.25rem" />
      <span className="flex-1 min-w-0 px-2">{book.title}</span>
      <span>{dayjs(book.created_at).format('YYYY-MM-DD')}</span>
    </div>
  );
}

export default BookItem;
