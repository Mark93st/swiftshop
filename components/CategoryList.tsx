'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Category } from '@prisma/client';

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  // Helper to build query string
  const buildQueryString = (catSlug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (catSlug) {
      params.set('category', catSlug);
    } else {
      params.delete('category');
    }
    params.delete('page'); // Reset pagination
    return `?${params.toString()}`;
  };

  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Categories</h3>
      <div className="flex flex-col gap-1">
        <Link 
          href={`/products${buildQueryString(null)}`}
          className={cn(
            "text-sm px-3 py-2 rounded-lg transition-colors flex items-center justify-between",
            !currentCategory ? "bg-primary/10 text-primary font-bold" : "text-slate-600 hover:bg-slate-100"
          )}
        >
          All Products
        </Link>
        {categories.map((cat) => (
          <Link 
            key={cat.id}
            href={`/products${buildQueryString(cat.slug)}`}
            className={cn(
              "text-sm px-3 py-2 rounded-lg transition-colors flex items-center justify-between",
              currentCategory === cat.slug ? "bg-primary/10 text-primary font-bold" : "text-slate-600 hover:bg-slate-100"
            )}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
