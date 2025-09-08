'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            <div className="mb-6">
              <h1 className="text-foreground text-3xl font-bold">Application Error</h1>
              <p className="text-muted-foreground mt-2">
                A critical error occurred. Please refresh the page or try again later.
              </p>
            </div>

            <div className="space-y-4">
              <Button onClick={reset} className="w-full">
                Try again
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = '/')}
                className="w-full"
              >
                Reload application
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="text-muted-foreground cursor-pointer text-sm">
                  Error details (development only)
                </summary>
                <pre className="mt-2 text-xs whitespace-pre-wrap text-red-500">
                  {error.message}
                  {error.stack && (
                    <>
                      {'\n\nStack trace:\n'}
                      {error.stack}
                    </>
                  )}
                </pre>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
