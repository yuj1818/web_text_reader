'use client';

import { Book } from '@/model/book';
import dayjs from '@/lib/dayjs';
import { BookText, EllipsisVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useModalContext } from '@/contexts/ModalContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBook } from '@/lib/book';

function BookItem({ book }: { book: Book }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { open, close } = useModalContext();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  useEffect(() => {
    const onClickOutSide = (e: MouseEvent) => {
      if (
        modalRef.current &&
        e.target instanceof Node &&
        !modalRef.current.contains(e.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', onClickOutSide);

    return () => document.removeEventListener('mousedown', onClickOutSide);
  }, [isMenuOpen]);

  return (
    <div
      className="flex items-center rounded border border-foreground p-4 cursor-pointer gap-1"
      onClick={() => router.push(`/book/${book.id}`)}
    >
      <BookText size="1.25rem" />
      <span className="flex-1 min-w-0 px-2">{book.title}</span>
      <span className="text-xs">{dayjs(book.created_at).fromNow()}</span>
      <div ref={modalRef} className="relative">
        <EllipsisVertical
          className="pointer-cursor"
          size="1.25rem"
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen((prev) => !prev);
          }}
        />
        {isMenuOpen && (
          <div
            className="absolute bottom-0 right-0 translate-y-full bg-foreground/50 py-1 px-3 rounded border whitespace-nowrap"
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className="text-sm cusor-pointer"
              onClick={() => {
                open({
                  rightBtnLabel: '확인',
                  onRightBtnClick: () => {
                    mutation.mutate(book.id);
                    setIsMenuOpen(false);
                    close();
                  },
                  content: (
                    <span>"{book.title}"을(를) 정말 삭제하시겠습니까?</span>
                  ),
                  buttonVariant: 'destructive',
                });
              }}
            >
              삭제
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookItem;
