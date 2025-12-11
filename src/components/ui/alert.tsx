import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

const alertVariants = cva(
  'relative rounded-lg border p-4',
  {
    variants: {
      variant: {
        info: 'border-primary-200 bg-primary-50 text-primary-800',
        success: 'border-success-200 bg-success-50 text-success-800',
        warning: 'border-warning-200 bg-warning-50 text-warning-800',
        error: 'border-error-200 bg-error-50 text-error-800',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

const iconMap = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
};

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'info', title, dismissible, onDismiss, children, ...props }, ref) => {
    const Icon = iconMap[variant || 'info'];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        <div className="flex gap-3">
          <Icon className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            {title && (
              <h4 className="font-semibold">{title}</h4>
            )}
            <div className={cn(title && 'mt-1', 'text-sm')}>
              {children}
            </div>
          </div>
          {dismissible && (
            <button
              type="button"
              onClick={onDismiss}
              className="shrink-0 rounded p-1 hover:bg-black/5 transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export { Alert, alertVariants };
