import BookList from '@/components/book/BookList';
import { Button } from '@/components/ui/button';
import { LibraryBig, Upload } from 'lucide-react';
import { getBookList } from '@/lib/book';
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const books = await getBookList(accessToken);

  return (
    <div className="w-full flex flex-col p-6 gap-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LibraryBig size="1.5rem" />
          <h1 className="text-2xl font-bold">도서관</h1>
        </div>
        <Button className="cursor-pointer">
          <Upload />
          업로드
        </Button>
      </div>
      <BookList initialBooks={books} />
    </div>
  );
}
