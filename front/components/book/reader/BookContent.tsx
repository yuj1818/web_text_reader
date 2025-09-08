import { SearchResult } from '@/hooks/useBookReader';
import { NavItem, Rendition } from 'epubjs';
import { Dispatch, SetStateAction } from 'react';
import { ReactReader, ReactReaderStyle } from 'react-reader';

interface BookContentProps {
  file: string;
  title: string;
  location: string | null;
  searchQuery: string;
  onTocChanged: (toc: NavItem[]) => void;
  onLocationChanged: (cfi?: string) => void;
  onSearchResults: Dispatch<SetStateAction<SearchResult[]>>;
  getRendition?: (rendition: Rendition) => void;
}

function BookContent({
  file,
  title,
  location,
  searchQuery,
  onTocChanged,
  onLocationChanged,
  onSearchResults,
  getRendition,
}: BookContentProps) {
  return (
    <ReactReader
      readerStyles={{
        ...ReactReaderStyle,
        container: { ...ReactReaderStyle.container, backgroundColor: 'black' },
        readerArea: {
          ...ReactReaderStyle.readerArea,
          backgroundColor: 'black',
        },
      }}
      url={process.env.NEXT_PUBLIC_API_BASE_URL + file}
      title={title}
      tocChanged={onTocChanged}
      location={location}
      locationChanged={onLocationChanged}
      searchQuery={searchQuery}
      onSearchResults={onSearchResults}
      getRendition={getRendition}
      epubInitOptions={{
        openAs: 'epub',
      }}
      epubOptions={{
        allowPopups: true,
        allowScriptedContent: true,
      }}
    />
  );
}

export default BookContent;
