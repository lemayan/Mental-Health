'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface OptionCardProps {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  selected: boolean;
  onSelect: (value: string) => void;
}

export function OptionCard({
  value,
  label,
  description,
  icon,
  selected,
  onSelect,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={cn(
        'relative flex w-full items-start gap-4 rounded-xl border-2 p-5 text-left transition-all duration-150',
        'focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2',
        selected
          ? 'border-primary-500 bg-primary-50 shadow-md'
          : 'border-neutral-200 bg-white hover:border-primary-300 hover:shadow-md'
      )}
      role="radio"
      aria-checked={selected}
    >
      {/* Icon */}
      {icon && (
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
            selected ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-600'
          )}
        >
          {icon}
        </div>
      )}

      {/* Content */}
      <div className="flex-1">
        <span
          className={cn(
            'block text-base font-semibold',
            selected ? 'text-primary-700' : 'text-neutral-900'
          )}
        >
          {label}
        </span>
        {description && (
          <span className="mt-1 block text-sm text-neutral-500">{description}</span>
        )}
      </div>

      {/* Selected Check */}
      {selected && (
        <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-white">
          <Check className="h-4 w-4" />
        </div>
      )}
    </button>
  );
}

interface OptionGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
}

export function OptionGrid({ children, columns = 1 }: OptionGridProps) {
  return (
    <div
      className={cn('grid gap-3', {
        'grid-cols-1': columns === 1,
        'grid-cols-1 sm:grid-cols-2': columns === 2,
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3': columns === 3,
      })}
      role="radiogroup"
    >
      {children}
    </div>
  );
}
