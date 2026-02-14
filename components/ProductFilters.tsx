'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [minPrice, setMinPrice] = useState(searchParams.get('min') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max') || '');
  const [search, setSearch] = useState(searchParams.get('q') || '');
  
  // Debounce search value
  const debouncedSearch = useDebounce(search, 500);

  // Effect to sync URL with debounced search
  useEffect(() => {
    const currentQ = searchParams.get('q') || '';
    if (debouncedSearch !== currentQ) {
      const params = new URLSearchParams(searchParams.toString());
      if (debouncedSearch) {
        params.set('q', debouncedSearch);
      } else {
        params.delete('q');
      }
      params.delete('page'); // Reset to page 1 on search
      router.push(`/products?${params.toString()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]); // Only trigger when the debounced value actually changes

  // Sync local state if URL changes externally (e.g. back button, navbar search)
  useEffect(() => {
    const urlQ = searchParams.get('q') || '';
    if (urlQ !== search) {
      setSearch(urlQ);
    }
    setMinPrice(searchParams.get('min') || '');
    setMaxPrice(searchParams.get('max') || '');
  }, [searchParams]); // We purposefully exclude 'search' to avoid loops

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    
    params.delete('page'); // Reset pagination on filter change
    router.push(`/products?${params.toString()}`);
  };

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ min: minPrice, max: maxPrice });
  };

  const clearAll = () => {
    router.push('/products');
  };

  const hasActiveFilters = searchParams.has('q') || 
                          searchParams.has('category') || 
                          searchParams.has('min') || 
                          searchParams.has('max') || 
                          searchParams.has('sort');

  return (
    <div className="space-y-8">
      {/* Search */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Search</h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search products..."
            className="pl-9 pr-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
             <button 
               type="button" 
               onClick={() => { setSearch(''); }}
               className="absolute right-2 top-2.5"
             >
                <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
             </button>
          )}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Sort By</h3>
        <Select 
          value={searchParams.get('sort') || 'newest'} 
          onValueChange={(value) => updateFilters({ sort: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Newest First" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="name_asc">Name: A to Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Price Range</h3>
        <form onSubmit={handlePriceApply} className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-2 text-slate-400 text-xs">$</span>
              <Input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="pl-6 h-9"
              />
            </div>
            <span className="text-slate-400">-</span>
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-2 text-slate-400 text-xs">$</span>
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="pl-6 h-9"
              />
            </div>
          </div>
          <Button type="submit" variant="secondary" size="sm" className="w-full">
            Apply Price Range
          </Button>
        </form>
      </div>

      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-slate-500 hover:text-red-600 h-8"
          onClick={clearAll}
        >
          <X className="mr-2 h-3 w-3" />
          Clear All Filters
        </Button>
      )}
    </div>
  );
}
