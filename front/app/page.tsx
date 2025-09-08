import BookList from '@/components/book/BookList';
import BookListTop from '@/components/book/BookListTop';
import { getBookList } from '@/lib/book';
import { headers } from 'next/headers';

export default async function Home() {
  const reqHeaders = await headers();
  const cookie = reqHeaders.get('cookie') ?? '';
  const books = await getBookList({ cookie });

  return (
    <div className="w-full h-full flex flex-col p-6 gap-8">
      <BookListTop />
      <BookList initialBooks={books} />
    </div>
  );
}
