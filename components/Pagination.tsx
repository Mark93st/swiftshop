'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string>;
}

export function Pagination({ currentPage, totalPages, baseUrl, searchParams }: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
    }
    params.set('page', page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-4 py-8">
      <Button
        asChild
        variant="outline"
        size="sm"
        className={cn(currentPage <= 1 && "pointer-events-none opacity-50")}
      >
        <Link href={buildUrl(currentPage - 1)}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Link>
      </Button>
      
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Page {currentPage}</span>
        <span className="text-sm text-slate-500">of {totalPages}</span>
      </div>

      <Button
        asChild
        variant="outline"
        size="sm"
        className={cn(currentPage >= totalPages && "pointer-events-none opacity-50")}
      >
        <Link href={buildUrl(currentPage + 1)}>
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </Button>
    </div>
  );
}
