import BookReader from '@/components/book/reader';
import LoadingIndicator from '@/components/common/LoadingIndicator';
import { getBookData } from '@/lib/book';
import { headers } from 'next/headers';

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const reqHeaders = await headers();
  const cookie = reqHeaders.get('cookie') ?? '';
  const book = await getBookData(id, { cookie });

  return (
    <div className="w-full h-full p-8">
      {!!book ? <BookReader book={book} /> : <LoadingIndicator />}
    </div>
  );
}
