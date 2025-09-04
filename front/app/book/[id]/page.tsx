import BookReader from '@/components/book/BookReader';
import LoadingIndicator from '@/components/common/LoadingIndicator';
import { getBookData } from '@/lib/book';
import { cookies } from 'next/headers';

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const book = await getBookData(accessToken, id);

  return (
    <div className="w-full h-full p-8">
      {!!book ? <BookReader book={book} /> : <LoadingIndicator />}
    </div>
  );
}
