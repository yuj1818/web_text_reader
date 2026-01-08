'use client';

import { ModalContext } from '@/contexts/ModalContext';
import { LibraryBig, LogOut } from 'lucide-react';
import BookUploadButton from './upload/BookUploadButton';
import { Button } from '../ui/button';
import { logout } from '@/lib/user';
import { useRouter } from 'next/navigation';

function BookListTop() {
  const router = useRouter();

  const onLogout = async () => {
    const res = await logout();
    if (res.success) router.push('/login');
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <LibraryBig size="1.5rem" />
        <h1 className="text-2xl font-bold">도서관</h1>
      </div>
      <div className="flex items-center gap-2">
        <ModalContext>
          <BookUploadButton />
        </ModalContext>
        <Button
          className="cursor-pointer"
          variant="ghost"
          size="icon"
          onClick={onLogout}
        >
          <LogOut />
        </Button>
      </div>
    </div>
  );
}

export default BookListTop;
