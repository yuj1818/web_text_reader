import { useEffect, useState, useRef, useCallback } from 'react';
import type { Rendition, NavItem, Location } from 'epubjs';
import { throttle } from '@/lib/throttle';
import { saveBookmark } from '@/lib/book';
import { ThemeType, ViewerThemes } from '@/constants/viewerThemes';

export interface SearchResult {
  cfi: string;
  excerpt: string;
}

const THRESHOLD = 100;
const LOCK_TIME = 400;

export function useBookReader(bookId: number, initialBookmark: string | null) {
  const renditionRef = useRef<Rendition | undefined>(undefined);
  const tocRef = useRef<NavItem[]>([]);
  const [location, setLocation] = useState(initialBookmark);
  const [progress, setProgress] = useState(0);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [page, setPage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [prevResults, setPrevResults] = useState<SearchResult[]>([]);
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.2);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [theme, setTheme] = useState<ThemeType>('default');
  const [isOverlayed, setIsOverlayed] = useState(false);
  const wheelAccumulatorRef = useRef(0);
  const wheelLockedRef = useRef(false);

  const onTocChanged = (toc: NavItem[]) => {
    tocRef.current = toc;
  };

  // 로케이션 변경
  const handleLocationChange = async (epubcfi?: string) => {
    if (!epubcfi) return;
    setLocation(epubcfi);
    await saveBookmark(bookId, epubcfi || '');
    if (!renditionRef.current || !tocRef.current.length) return;
    const loc = renditionRef.current.location?.start;
    if (!loc) return;
    const { displayed, href } = loc;
    const chapterIndex = tocRef.current.findIndex((item) => item.href === href);
    if (chapterIndex === -1) return;
    setCurrentChapterIndex(chapterIndex);
    setPage(`${displayed.page}/${displayed.total}`);
    const chapterFraction = 1 / tocRef.current.length;
    const percentage =
      (chapterIndex + displayed.page / displayed.total) * chapterFraction;
    setProgress(percentage);
  };

  // 슬라이더 이동
  const handleSliderChange = async (val: number) => {
    setProgress(val);
    if (!tocRef.current.length || !renditionRef.current) return;

    const totalChapters = tocRef.current.length;
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

  const clearHighlights = useCallback(() => {
    if (!renditionRef.current) return;
    prevResults.forEach((res) => {
      renditionRef.current?.annotations.remove(res.cfi, 'highlight');
    });
  }, [prevResults]);

  const toggleOverlay = () => {
    setIsOverlayed(!isOverlayed);
  };

  const getRendition = (rendition: Rendition) => {
    renditionRef.current = rendition;
    rendition.themes.default({ body: ViewerThemes['default'] });

    rendition.on('relocated', (relocation: Location) => {
      const cfi = relocation?.start?.cfi;
      if (cfi) {
        handleLocationChange(cfi);
      }
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
  }, [searchResults, clearHighlights]);

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

  // 스크롤 페이지 이동(단, 네비게이션 쪽에서만 가능. iframe 영역에서는 상쇄됨)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!renditionRef.current) return;
      if (wheelLockedRef.current) return;

      e.preventDefault();
      wheelAccumulatorRef.current += e.deltaY;

      if (Math.abs(wheelAccumulatorRef.current) >= THRESHOLD) {
        if (Math.sign(wheelAccumulatorRef.current) > 0) {
          renditionRef.current.next();
        } else {
          renditionRef.current.prev();
        }

        wheelAccumulatorRef.current = 0;
        wheelLockedRef.current = true;

        setTimeout(() => {
          wheelLockedRef.current = false;
        }, LOCK_TIME);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

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

  useEffect(() => {
    if (!renditionRef.current) return;

    const themes = renditionRef.current.themes;
    const styles = ViewerThemes[theme];
    themes.override('color', styles.color);
    themes.override('background', styles.background);
  }, [theme]);

  return {
    location,
    progress,
    searchQuery,
    searchResults,
    currentChapterIndex,
    currentResultIndex,
    renditionRef,
    fontSize,
    lineHeight,
    letterSpacing,
    theme,
    isOverlayed,
    page,
    onTocChanged,
    handleLocationChange,
    handleSliderChange,
    setSearchQuery,
    setSearchResults,
    goToNextResult,
    setFontSize,
    setLineHeight,
    setLetterSpacing,
    setTheme,
    toggleOverlay,
    getRendition,
  };
}
