import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <div className="text-center">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary-500" />
        <p className="mt-4 text-neutral-600">Loading...</p>
      </div>
    </div>
  );
}
