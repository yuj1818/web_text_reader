'use client';
import { BookDetail } from '@/model/book';
import { useBookReader } from '@/hooks/useBookReader';
import BookToolbar from './BookToolbar';
import BookSlider from './BookSlider';
import BookContent from './BookContent';

function BookReader({ book }: { book: BookDetail }) {
  const {
    location,
    progress,
    searchQuery,
    searchResults,
    currentResultIndex,
    onTocChanged,
    handleLocationChange,
    handleSliderChange,
    setSearchQuery,
    setSearchResults,
    goToNextResult,
    renditionRef,
  } = useBookReader(book.id, book.bookmark_cfi);

  return (
    <div className="relative h-full w-full bg-background flex flex-col gap-2">
      <BookToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        total={searchResults.length}
        currentResultIndex={currentResultIndex}
        goToNextResult={goToNextResult}
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
              body: { background: 'black', color: 'white', fontSize: '16px' },
            });

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
      <BookSlider progress={progress} onChange={handleSliderChange} />
    </div>
  );
}

export default BookReader;
