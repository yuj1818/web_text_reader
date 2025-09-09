'use client';
import { BookDetail } from '@/model/book';
import { ReactReader, ReactReaderStyle } from 'react-reader';
import type { Rendition, NavItem } from 'epubjs';
import { useEffect, useRef, useState } from 'react';
import { throttle } from '@/lib/throttle';

function BookReader({ book }: { book: BookDetail }) {
  const renditionRef = useRef<Rendition | undefined>(undefined);
  const tocRef = useRef<NavItem[]>([]);
  const [progress, setProgress] = useState(0);
  const [chapterPages, setChapterPages] = useState<number[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

  // location 변경될 때
  const handleLocationChange = () => {
    if (!renditionRef.current || !tocRef.current) return;
    const { displayed, href } = renditionRef.current.location.start;

    const chapterIndex = tocRef.current.findIndex((item) => item.href === href);
    if (chapterIndex === -1) return;

    setCurrentChapterIndex(chapterIndex);

    const pagesBefore = chapterPages
      .slice(0, chapterIndex)
      .reduce((a, b) => a + b, 0);
    const pageInChapter = displayed.page ?? 1;
    const percentage = (pagesBefore + pageInChapter) / totalPages;
    setProgress(percentage);
  };

  // slider 이동 (챕터 단위 근사 이동)
  const handleSliderChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setProgress(val);

    if (!tocRef.current || !chapterPages.length || !renditionRef.current)
      return;

    const targetPage = Math.round(val * totalPages);

    let pageSum = 0;
    let chapterIndex = 0;
    for (; chapterIndex < chapterPages.length; chapterIndex++) {
      if (pageSum + chapterPages[chapterIndex] >= targetPage) break;
      pageSum += chapterPages[chapterIndex];
    }

    const chapter = tocRef.current[chapterIndex];
    if (!chapter) return;

    await renditionRef.current.display(chapter.href);
  };

  // 키보드 이동
  useEffect(() => {
    const handleKeyDown = throttle((e: KeyboardEvent) => {
      if (!renditionRef.current) return;

      switch (e.key) {
        case 'd':
          renditionRef.current.next();
          e.preventDefault();
          break;
        case 'a':
          renditionRef.current.prev();
          e.preventDefault();
          break;
      }
    }, 100);

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative h-full w-full bg-background flex flex-col gap-2">
      <div className="flex-1 min-h-0">
        <ReactReader
          readerStyles={{
            ...ReactReaderStyle,
            container: {
              ...ReactReaderStyle.container,
              backgroundColor: 'black',
            },
            readerArea: {
              ...ReactReaderStyle.readerArea,
              backgroundColor: 'black',
            },
          }}
          url={process.env.NEXT_PUBLIC_API_BASE_URL + book.file}
          title={book.title}
          tocChanged={(toc) => (tocRef.current = toc)}
          location={book.bookmark_cfi || 1}
          locationChanged={handleLocationChange}
          getRendition={(rendition: Rendition) => {
            renditionRef.current = rendition;

            // 테마 적용
            rendition.themes.default({
              body: { background: 'black', color: 'white', fontSize: '16px' },
            });

            if (book.bookmark_cfi) {
              rendition.display(book.bookmark_cfi || '1');
            }

            // 각 챕터 페이지 수 계산 (근사치)
            rendition.on('relocated', () => {
              if (!tocRef.current || chapterPages.length) return;

              const pagesArr: number[] = tocRef.current.map(() => 1); // 챕터별 1장 단위
              setChapterPages(pagesArr);
              setTotalPages(pagesArr.reduce((a, b) => a + b, 0));
            });

            // iframe sandbox 처리
            rendition.on('rendered', (_section: any, iframeRef: any) => {
              if (iframeRef?.iframe) {
                iframeRef.iframe.setAttribute(
                  'sandbox',
                  'allow-same-origin allow-scripts allow-popups allow-forms',
                );
              }
            });
          }}
        />
      </div>
      <div className="p-2 flex items-center gap-2">
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={progress}
          onChange={handleSliderChange}
          className="flex-1"
        />
        <span className="text-white">{Math.round(progress * 100)}%</span>
      </div>
    </div>
  );
}

export default BookReader;
