'use client';
import { BookDetail } from '@/model/book';
import { ReactReader, ReactReaderStyle } from 'react-reader';
import type { Rendition, NavItem } from 'epubjs';
import { useEffect, useRef, useState } from 'react';
import { throttle } from '@/lib/throttle';
import { ChevronLeft, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

type SearchResult = { cfi: string; excerpt: string };

function BookReader({ book }: { book: BookDetail }) {
  const router = useRouter();
  const renditionRef = useRef<Rendition | undefined>(undefined);
  const tocRef = useRef<NavItem[]>([]);
  const [location, setLocation] = useState(book.bookmark_cfi);
  const [progress, setProgress] = useState(0);
  const [totalChapters, setTotalChapters] = useState(0);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [prevResults, setPrevResults] = useState<SearchResult[]>([]);

  const goToNextResult = () => {
    if (!searchResults.length) return;
    const nextIndex = (currentResultIndex + 1) % searchResults.length;
    setCurrentResultIndex(nextIndex);
    setLocation(searchResults[nextIndex].cfi);
  };

  const highlightSearchResults = (results: SearchResult[]) => {
    if (!renditionRef.current) return;
    results.forEach((res) => {
      renditionRef.current?.annotations.add('highlight', res.cfi);
    });
  };

  const clearHighllights = () => {
    if (!renditionRef.current) return;
    prevResults.forEach((res) => {
      renditionRef.current?.annotations.remove(res.cfi, 'highlight');
    });
  };

  useEffect(() => {
    if (searchResults.length) {
      setLocation(searchResults[0].cfi);
      clearHighllights();
      highlightSearchResults(searchResults);
      setCurrentResultIndex(0);
      setPrevResults(searchResults);
    }
  }, [searchResults]);

  // location 변경될 때
  const handleLocationChange = (epubcfi?: string) => {
    if (!epubcfi) return;
    setLocation(epubcfi);

    if (!renditionRef.current || !tocRef.current) return;
    const { displayed, href } = renditionRef.current.location.start;

    const chapterIndex = tocRef.current.findIndex((item) => item.href === href);
    if (chapterIndex === -1) return;
    setCurrentChapterIndex(chapterIndex);

    const chapterFraction = 1 / totalChapters;
    const percentage =
      (currentChapterIndex + displayed.page / displayed.total) *
      chapterFraction;
    setProgress(percentage);
  };

  // slider 이동 (챕터 단위 근사 이동)
  const handleSliderChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setProgress(val);

    if (!tocRef.current || !renditionRef.current) return;

    const chapterFraction = 1 / totalChapters;
    let chapterIndex = Math.floor(val / chapterFraction);
    if (chapterIndex >= totalChapters) chapterIndex = totalChapters - 1;

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
      <div className="flex items-center justify-between">
        <ChevronLeft
          className="cursor-pointer"
          size="1.5rem"
          onClick={() => router.back()}
        />
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border rounded p-1">
            <input
              className="text-sm"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchResults.length > 0) {
                  goToNextResult();
                }
              }}
            />
            <span className="text-xs">
              ({searchResults.length > 0 ? currentResultIndex + 1 : 0}/
              {searchResults.length})
            </span>
          </div>
          <Button
            size="icon"
            className="size-8 cursor-pointer"
            disabled={!searchResults.length}
            onClick={goToNextResult}
          >
            <Search />
          </Button>
        </div>
      </div>
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
          tocChanged={(toc) => {
            tocRef.current = toc; // toc는 NavItem[] 배열
            setTotalChapters(toc.length); // 총 챕터 개수
          }}
          location={location}
          locationChanged={handleLocationChange}
          searchQuery={searchQuery}
          onSearchResults={setSearchResults}
          getRendition={(rendition: Rendition) => {
            renditionRef.current = rendition;

            // 테마 적용
            rendition.themes.default({
              body: { background: 'black', color: 'white', fontSize: '16px' },
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
