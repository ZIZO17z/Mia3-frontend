'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6">
          <h2 className="text-foreground text-2xl font-bold">Something went wrong!</h2>
          <p className="text-muted-foreground mt-2">
            An unexpected error occurred. Please try again.
          </p>
        </div>

        <div className="space-y-4">
          <Button onClick={reset} className="w-full">
            Try again
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = '/')} className="w-full">
            Go to homepage
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="text-muted-foreground cursor-pointer text-sm">
              Error details (development only)
            </summary>
            <pre className="mt-2 text-xs whitespace-pre-wrap text-red-500">{error.message}</pre>
          </details>
        )}
      </div>
    </div>
  );
}
