'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export function ActiveFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const min = searchParams.get('min');
  const max = searchParams.get('max');
  const q = searchParams.get('q');
  const category = searchParams.get('category');

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.push(`/products?${params.toString()}`);
  };

  const removePrice = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('min');
    params.delete('max');
    router.push(`/products?${params.toString()}`);
  };

  if (!min && !max && !q && !category) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {category && (
        <Badge variant="secondary" className="px-3 py-1 text-sm font-medium gap-2 hover:bg-slate-200">
          Category: {category}
          <button onClick={() => removeFilter('category')} className="hover:text-red-500">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
      
      {q && (
        <Badge variant="secondary" className="px-3 py-1 text-sm font-medium gap-2 hover:bg-slate-200">
          Search: &quot;{q}&quot;
          <button onClick={() => removeFilter('q')} className="hover:text-red-500">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {(min || max) && (
        <Badge variant="secondary" className="px-3 py-1 text-sm font-medium gap-2 hover:bg-slate-200">
          Price: ${min || '0'} - ${max || '∞'}
          <button onClick={removePrice} className="hover:text-red-500">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
      
      <button 
        onClick={() => router.push('/products')} 
        className="text-xs text-slate-500 hover:text-primary underline ml-2"
      >
        Clear all
      </button>
    </div>
  );
}
