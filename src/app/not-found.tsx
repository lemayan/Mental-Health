import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { SearchX, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      <main className="container-app flex flex-1 flex-col items-center justify-center py-16 text-center">
        <SearchX className="h-20 w-20 text-neutral-300" />
        <h1 className="mt-6 text-3xl font-bold text-neutral-900">
          Page not found
        </h1>
        <p className="mt-4 max-w-md text-neutral-600">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been
          moved or doesn&apos;t exist.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/">
            <Button leftIcon={<Home className="h-4 w-4" />}>
              Go to homepage
            </Button>
          </Link>
          <Link href="/navigator">
            <Button variant="outline">
              Find mental health support
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
