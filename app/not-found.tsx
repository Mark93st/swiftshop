import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="bg-slate-100 p-6 rounded-full">
        <FileQuestion className="h-12 w-12 text-slate-400" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900">Page Not Found</h2>
      <p className="text-slate-500 max-w-md">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
      </p>
      <Button asChild className="mt-4">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
