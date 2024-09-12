import { Button } from './ui';

export const ErrorState = ({ error, onRetry }: { error: Error; onRetry: () => void }) => (
  <div className="text-center py-4">
    <p className="text-red-500 mb-2">Error: {error.message}</p>
    <Button onClick={onRetry} variant="outline" className="rounded-full">
      Retry
    </Button>
  </div>
);
