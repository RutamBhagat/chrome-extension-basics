import { Skeleton } from './ui/skeleton';

export function SkeletonCard({ className = 'w-64 h-32', lineClassName = 'w-64', lines = 2 }) {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className={`${className} rounded-xl`} />
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton key={index} className={`h-4 ${lineClassName}`} />
        ))}
      </div>
    </div>
  );
}
