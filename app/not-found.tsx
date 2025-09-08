import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6">
          <h1 className="text-foreground text-6xl font-bold">404</h1>
          <h2 className="text-foreground mt-2 text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/">Go to homepage</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/components">View components</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
