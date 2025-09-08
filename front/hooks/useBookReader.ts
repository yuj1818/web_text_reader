import { useEffect, useState, useRef } from 'react';
import type { Rendition, NavItem } from 'epubjs';
import { throttle } from '@/lib/throttle';
import { saveBookmark } from '@/lib/book';

export interface SearchResult {
  cfi: string;
  excerpt: string;
}

export function useBookReader(bookId: number, initialBookmark: string | null) {
  const renditionRef = useRef<Rendition | undefined>(undefined);
  const tocRef = useRef<NavItem[]>([]);
  const locationRef = useRef(initialBookmark);
  const [location, setLocation] = useState(initialBookmark);
  const [progress, setProgress] = useState(0);
  const [totalChapters, setTotalChapters] = useState(0);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [prevResults, setPrevResults] = useState<SearchResult[]>([]);
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.2);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [theme, setTheme] = useState({
    bgColor: '#000',
    fontColor: '#FFF',
  });

  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  const onTocChanged = (toc: NavItem[]) => {
    tocRef.current = toc;
    setTotalChapters(toc.length);
  };

  // 로케이션 변경
  const handleLocationChange = (epubcfi?: string) => {
    if (!epubcfi) return;
    setLocation(epubcfi);
    if (!renditionRef.current || !tocRef.current.length) return;

    const { displayed, href } = renditionRef.current.location.start;
    const chapterIndex = tocRef.current.findIndex((item) => item.href === href);
    if (chapterIndex === -1) return;
    setCurrentChapterIndex(chapterIndex);

    const chapterFraction = 1 / totalChapters;
    const percentage =
      (chapterIndex + displayed.page / displayed.total) * chapterFraction;
    setProgress(percentage);
  };

  // 슬라이더 이동
  const handleSliderChange = async (val: number) => {
    setProgress(val);
    if (!tocRef.current.length || !renditionRef.current) return;

    const chapterFraction = 1 / totalChapters;
    let chapterIndex = Math.floor(val / chapterFraction);
    if (chapterIndex >= totalChapters) chapterIndex = totalChapters - 1;

    const chapter = tocRef.current[chapterIndex];
    if (!chapter) return;

    await renditionRef.current.display(chapter.href);
  };

  // 검색 결과 이동
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

  const clearHighlights = () => {
    if (!renditionRef.current) return;
    prevResults.forEach((res) => {
      renditionRef.current?.annotations.remove(res.cfi, 'highlight');
    });
  };

  useEffect(() => {
    if (searchResults.length) {
      setLocation(searchResults[0].cfi);
      clearHighlights();
      highlightSearchResults(searchResults);
      setCurrentResultIndex(0);
      setPrevResults(searchResults);
    }
  }, [searchResults]);

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

  // 언마운트 시 북마크 저장
  useEffect(() => {
    const save = async () => {
      await saveBookmark(bookId, locationRef.current || '');
    };
    return () => {
      save();
    };
  }, [bookId]);

  // 폰트 크기 조절
  useEffect(() => {
    renditionRef.current?.themes.fontSize(`${fontSize}px`);
  }, [fontSize]);

  useEffect(() => {
    renditionRef.current?.themes.override('line-height', `${lineHeight}`);
  }, [lineHeight]);

  useEffect(() => {
    renditionRef.current?.themes.override(
      'letter-spacing',
      `${letterSpacing}px`,
    );
  }, [letterSpacing]);

  return {
    location,
    progress,
    searchQuery,
    searchResults,
    currentResultIndex,
    renditionRef,
    fontSize,
    lineHeight,
    letterSpacing,
    onTocChanged,
    handleLocationChange,
    handleSliderChange,
    setSearchQuery,
    setSearchResults,
    goToNextResult,
    setFontSize,
    setLineHeight,
    setLetterSpacing,
  };
}
