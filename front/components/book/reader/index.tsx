'use client';
import { BookDetail } from '@/model/book';
import { useBookReader } from '@/hooks/useBookReader';
import BookToolbar from './BookToolbar';
import BookSlider from './BookSlider';
import BookContent from './BookContent';
import StylingOverlay from './styling';

function BookReader({ book }: { book: BookDetail }) {
  const {
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
  } = useBookReader(book.id, book.bookmark_cfi);

  return (
    <div className="relative h-full w-full bg-background flex flex-col">
      <BookToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        total={searchResults.length}
        currentResultIndex={currentResultIndex}
        goToNextResult={goToNextResult}
      />
      <StylingOverlay
        fontSize={fontSize}
        setFontSize={setFontSize}
        lineHeight={lineHeight}
        setLineHeight={setLineHeight}
        letterSpacing={letterSpacing}
        setLetterSpacing={setLetterSpacing}
      />
      <div className="flex-1 min-h-0">
        <BookContent
          file={book.file}
          title={book.title}
          location={location}
          onTocChanged={onTocChanged}
          onLocationChanged={handleLocationChange}
          searchQuery={searchQuery}
          onSearchResults={setSearchResults}
          getRendition={(rendition) => {
            renditionRef.current = rendition;

            rendition.themes.default({
              body: {
                background: 'black',
                color: 'white',
                fontSize: `${fontSize}px`,
              },
            });
          }}
        />
      </div>
      <BookSlider progress={progress} onChange={handleSliderChange} />
    </div>
  );
}

export default BookReader;
