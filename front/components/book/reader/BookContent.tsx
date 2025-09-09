import { ThemeType, ViewerThemes } from '@/constants/viewerThemes';
import { SearchResult } from '@/hooks/useBookReader';
import { NavItem, Rendition } from 'epubjs';
import { Dispatch, SetStateAction } from 'react';
import { ReactReader, ReactReaderStyle } from 'react-reader';

interface BookContentProps {
  file: string;
  title: string;
  location: string | null;
  searchQuery: string;
  theme: ThemeType;
  onTocChanged: (toc: NavItem[]) => void;
  onLocationChanged: (cfi?: string) => void;
  onSearchResults: Dispatch<SetStateAction<SearchResult[]>>;
  getRendition?: (rendition: Rendition) => void;
}

const getReaderStyles = (theme: ThemeType) => {
  const styles = ViewerThemes[theme || 'default'];
  return {
    ...ReactReaderStyle,
    container: {
      ...ReactReaderStyle.container,
      backgroundColor: styles.background,
      transition: undefined,
    },
    readerArea: {
      ...ReactReaderStyle.readerArea,
      backgroundColor: styles.background,
      transition: undefined,
    },
  };
};

function BookContent({
  file,
  title,
  location,
  searchQuery,
  theme,
  onTocChanged,
  onLocationChanged,
  onSearchResults,
  getRendition,
}: BookContentProps) {
  return (
    <ReactReader
      readerStyles={getReaderStyles(theme)}
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
