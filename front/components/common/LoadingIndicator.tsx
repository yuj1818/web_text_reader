import { LoaderCircle } from 'lucide-react';

function LoadingIndicator() {
  return (
    <div className="absolute inset-0 bg-[var(--foreground)]/10 z-[1000]">
      <LoaderCircle
        size="5rem"
        className="text-gray-500 absolute top-1/2 left-1/2 -translate-1/2 animate-spin"
      />
    </div>
  );
}

export default LoadingIndicator;
