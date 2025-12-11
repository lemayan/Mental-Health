import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-neutral-200',
        className
      )}
    />
  );
}

// Pre-built skeleton patterns
export function ProviderCardSkeleton() {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6">
      <div className="flex gap-4">
        {/* Avatar */}
        <Skeleton className="h-14 w-14 shrink-0 rounded-full" />

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-3">
          {/* Name */}
          <Skeleton className="h-6 w-48" />
          {/* Type */}
          <Skeleton className="h-4 w-24" />

          {/* Tags */}
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded" />
            <Skeleton className="h-6 w-20 rounded" />
            <Skeleton className="h-6 w-14 rounded" />
          </div>

          {/* Location */}
          <Skeleton className="h-4 w-36" />

          {/* Availability */}
          <Skeleton className="h-6 w-40 rounded-full" />

          {/* Bio */}
          <Skeleton className="h-12 w-full" />

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-11 flex-1 rounded-lg" />
            <Skeleton className="h-11 w-11 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrganizationCardSkeleton() {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6">
      <div className="flex gap-4">
        {/* Logo */}
        <Skeleton className="h-14 w-14 shrink-0 rounded-lg" />

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-3">
          {/* Name */}
          <Skeleton className="h-6 w-56" />
          {/* Type */}
          <Skeleton className="h-4 w-32" />

          {/* Tags */}
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded" />
            <Skeleton className="h-6 w-20 rounded" />
          </div>

          {/* Badges */}
          <div className="flex gap-2">
            <Skeleton className="h-7 w-28 rounded-full" />
          </div>

          {/* Description */}
          <Skeleton className="h-12 w-full" />

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-11 flex-1 rounded-lg" />
            <Skeleton className="h-11 w-11 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileHeaderSkeleton() {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-8">
      <div className="flex flex-col gap-6 sm:flex-row">
        {/* Avatar */}
        <Skeleton className="h-24 w-24 shrink-0 rounded-full" />

        {/* Content */}
        <div className="flex-1 space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-6 w-full max-w-md" />

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-11 w-36 rounded-lg" />
            <Skeleton className="h-11 w-24 rounded-lg" />
            <Skeleton className="h-11 w-24 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ArticleCardSkeleton() {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6">
      <Skeleton className="h-40 w-full rounded-lg" />
      <div className="mt-4 space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-6 w-16 rounded" />
        <Skeleton className="h-6 w-20 rounded" />
      </div>
    </div>
  );
}

export function ResultsListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProviderCardSkeleton key={i} />
      ))}
    </div>
  );
}
