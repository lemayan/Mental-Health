'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { AlertTriangle, ArrowRight, X } from 'lucide-react';

interface CrisisBannerProps {
  dismissible?: boolean;
  className?: string;
}

export function CrisisBanner({ dismissible = false, className }: CrisisBannerProps) {
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <div
      className={cn(
        'bg-crisis-700 px-4 py-3 text-white',
        className
      )}
      role="banner"
      aria-label="Crisis resources"
    >
      <div className="container-app flex items-center justify-center gap-2 text-sm">
        <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="font-medium">
          If you&apos;re in crisis, call{' '}
          <a
            href="tel:988"
            className="font-bold underline hover:text-white/90"
          >
            988
          </a>{' '}
          or text HOME to{' '}
          <a
            href="sms:741741"
            className="font-bold underline hover:text-white/90"
          >
            741741
          </a>
        </span>
        <Link
          href="/crisis"
          className="ml-2 inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold hover:bg-white/30 transition-colors"
        >
          Get help <ArrowRight className="h-3 w-3" />
        </Link>

        {dismissible && (
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="ml-auto rounded p-1 hover:bg-white/20 transition-colors"
            aria-label="Dismiss crisis banner"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// Inline variant for use within navigator or other flows
export function CrisisAlert({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-lg border-2 border-crisis-600 bg-crisis-100 p-4',
        className
      )}
      role="alert"
    >
      <div className="flex gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0 text-crisis-600" />
        <div>
          <h4 className="font-semibold text-crisis-700">
            You don&apos;t have to go through this alone.
          </h4>
          <div className="mt-2 text-sm text-neutral-700">
            <p>If you&apos;re in immediate danger, call <strong>911</strong>.</p>
            <p className="mt-1">
              For mental health crisis support, call or text{' '}
              <a href="tel:988" className="font-semibold text-crisis-700 underline">
                988
              </a>
              .
            </p>
          </div>
          <Link
            href="/crisis"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-crisis-700 hover:text-crisis-600"
          >
            Learn about crisis resources <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-xs text-neutral-500">
            You can still continue to see local resources below.
          </p>
        </div>
      </div>
    </div>
  );
}
