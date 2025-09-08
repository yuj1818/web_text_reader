import { ChevronLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface BookToolbarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  currentResultIndex: number;
  total: number;
  goToNextResult: () => void;
}

function BookToolbar({
  searchQuery,
  setSearchQuery,
  currentResultIndex,
  total,
  goToNextResult,
}: BookToolbarProps) {
  const router = useRouter();

  return (
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
              if (e.key === 'Enter' && total > 0) {
                goToNextResult();
              }
            }}
          />
          <span className="text-xs">
            ({total > 0 ? currentResultIndex + 1 : 0}/{total})
          </span>
        </div>
        <Button
          size="icon"
          className="size-8 cursor-pointer"
          disabled={total === 0}
          onClick={goToNextResult}
        >
          <Search />
        </Button>
      </div>
    </div>
  );
}

export default BookToolbar;
