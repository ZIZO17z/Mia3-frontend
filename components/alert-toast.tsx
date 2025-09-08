// alert-toast.tsx
'use client';

import { ReactNode } from 'react';
import { toast as sonnerToast } from 'sonner';
import {
  CheckCircleIcon,
  InfoIcon,
  WarningIcon,
  XCircleIcon,
} from '@phosphor-icons/react/dist/ssr';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface ToastProps {
  id: string | number;
  title: ReactNode;
  description?: ReactNode;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
}

export function toastAlert(toast: Omit<ToastProps, 'id'>) {
  return sonnerToast.custom((id) => <AlertToast id={id} {...toast} />, {
    duration: toast.variant === 'destructive' ? 15_000 : 10_000,
  });
}

export function toastSuccess(toast: Omit<ToastProps, 'id' | 'variant'>) {
  return toastAlert({ ...toast, variant: 'success' });
}

export function toastError(toast: Omit<ToastProps, 'id' | 'variant'>) {
  return toastAlert({ ...toast, variant: 'destructive' });
}

export function toastWarning(toast: Omit<ToastProps, 'id' | 'variant'>) {
  return toastAlert({ ...toast, variant: 'warning' });
}

function AlertToast(props: ToastProps) {
  const { title, description, id, variant = 'default' } = props;

  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircleIcon weight="bold" className="text-success" />;
      case 'destructive':
        return <XCircleIcon weight="bold" className="text-destructive" />;
      case 'warning':
        return <WarningIcon weight="bold" className="text-warning" />;
      default:
        return <InfoIcon weight="bold" className="text-info" />;
    }
  };

  const getVariantClass = () => {
    switch (variant) {
      case 'success':
        return 'border-success/20 bg-success/10';
      case 'destructive':
        return 'border-destructive/20 bg-destructive/10';
      case 'warning':
        return 'border-warning/20 bg-warning/10';
      default:
        return 'border-border bg-background';
    }
  };

  return (
    <Alert
      className={cn(
        'w-full max-w-md border shadow-lg backdrop-blur-sm',
        getVariantClass(),
        'animate-in slide-in-from-bottom-4 duration-300 ease-out'
      )}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 pt-0.5">{getIcon()}</div>
        <div className="flex-1 space-y-1">
          <AlertTitle className="text-sm leading-none font-medium">{title}</AlertTitle>
          {description && (
            <AlertDescription className="text-muted-foreground text-sm">
              {description}
            </AlertDescription>
          )}
        </div>
        <button
          onClick={() => sonnerToast.dismiss(id)}
          className="mt-0.5 size-4 flex-shrink-0 rounded text-lg font-bold opacity-70 transition-opacity hover:opacity-100"
          aria-label="Dismiss"
        >
          <span className="sr-only">Close</span>×
        </button>
      </div>
    </Alert>
  );
}
