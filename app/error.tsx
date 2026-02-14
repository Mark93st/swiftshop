'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <div className="bg-destructive/10 p-4 rounded-full">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="text-muted-foreground max-w-md">
        We encountered an unexpected error. Please try again later.
      </p>
      <Button onClick={() => reset()} variant="outline">
        Try again
      </Button>
    </div>
  );
}
