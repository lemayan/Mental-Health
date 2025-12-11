import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const tagVariants = cva(
  // Base styles
  'inline-flex items-center gap-1 font-medium transition-colors duration-150',
  {
    variants: {
      variant: {
        default: 'bg-primary-100 text-primary-700',
        accent: 'bg-accent-100 text-accent-600',
        support: 'bg-support-100 text-support-600',
        success: 'bg-success-100 text-success-600',
        neutral: 'bg-neutral-100 text-neutral-700',
        outline: 'bg-transparent border border-neutral-300 text-neutral-700',
      },
      size: {
        sm: 'h-6 px-2 text-xs rounded',
        md: 'h-7 px-3 text-[13px] rounded-md',
        lg: 'h-8 px-3.5 text-sm rounded-md',
      },
      interactive: {
        true: 'cursor-pointer',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'default',
        interactive: true,
        className: 'hover:bg-primary-200',
      },
      {
        variant: 'accent',
        interactive: true,
        className: 'hover:bg-accent-200',
      },
      {
        variant: 'support',
        interactive: true,
        className: 'hover:bg-support-200',
      },
      {
        variant: 'neutral',
        interactive: true,
        className: 'hover:bg-neutral-200',
      },
      {
        variant: 'outline',
        interactive: true,
        className: 'hover:bg-neutral-100',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
      interactive: false,
    },
  }
);

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  onRemove?: () => void;
  leftIcon?: React.ReactNode;
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      className,
      variant,
      size,
      interactive,
      onRemove,
      leftIcon,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(tagVariants({ variant, size, interactive, className }))}
        {...props}
      >
        {leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children}
        {onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="ml-0.5 shrink-0 rounded hover:bg-black/10 focus:outline-none focus:ring-1 focus:ring-current"
            aria-label="Remove"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </span>
    );
  }
);

Tag.displayName = 'Tag';

// Filter Chip variant for interactive filtering
const filterChipVariants = cva(
  // Base styles
  'inline-flex items-center justify-center gap-1.5 rounded-full font-medium transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-1',
  {
    variants: {
      selected: {
        true: 'bg-primary-500 text-white',
        false: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-9 px-4 text-sm',
        lg: 'h-10 px-5 text-base',
      },
    },
    defaultVariants: {
      selected: false,
      size: 'md',
    },
  }
);

export interface FilterChipProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    VariantProps<typeof filterChipVariants> {
  label: string;
  onToggle?: () => void;
  count?: number;
}

const FilterChip = React.forwardRef<HTMLButtonElement, FilterChipProps>(
  ({ className, selected, size, label, onToggle, count, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        role="checkbox"
        aria-checked={selected ?? false}
        onClick={onToggle}
        className={cn(filterChipVariants({ selected, size, className }))}
        {...props}
      >
        {label}
        {count !== undefined && (
          <span
            className={cn(
              'ml-1 text-xs',
              selected ? 'text-white/80' : 'text-neutral-500'
            )}
          >
            ({count})
          </span>
        )}
      </button>
    );
  }
);

FilterChip.displayName = 'FilterChip';

export { Tag, tagVariants, FilterChip, filterChipVariants };
