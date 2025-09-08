'use client';

import { ModalContext } from '@/contexts/ModalContext';
import { LibraryBig } from 'lucide-react';
import BookUploadButton from './upload/BookUploadButton';

function BookListTop() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <LibraryBig size="1.5rem" />
        <h1 className="text-2xl font-bold">도서관</h1>
      </div>
      <ModalContext>
        <BookUploadButton />
      </ModalContext>
    </div>
  );
}

export default BookListTop;
