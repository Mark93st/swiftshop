import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { auth } from "@/auth";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ProductFilters } from "@/components/ProductFilters";
import { CategoryList } from "@/components/CategoryList";
import { ActiveFilters } from "@/components/ActiveFilters";
import { Button } from "@/components/ui/button";
import { X, SlidersHorizontal, Filter } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; sort?: string; min?: string; max?: string; page?: string }>;
}) {
  const { 
    category: categorySlug, 
    q: searchQuery, 
    sort, 
    min: priceMin, 
    max: priceMax,
    page: pageParam
  } = await searchParams;
  const session = await auth();

  // Pagination constants
  const ITEMS_PER_PAGE = 12;
  const currentPage = Math.max(1, Number(pageParam) || 1);
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  // Parse price filters
  const minPrice = priceMin ? Number(priceMin) : undefined;
  const maxPrice = priceMax ? Number(priceMax) : undefined;

  // Build current query string for links to preserve filters
  const buildQueryString = (overrides: Record<string, string | null>) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (sort) params.set('sort', sort);
    if (priceMin) params.set('min', priceMin);
    if (priceMax) params.set('max', priceMax);
    if (categorySlug) params.set('category', categorySlug);
    if (pageParam && !overrides.page) params.set('page', pageParam);

    Object.entries(overrides).forEach(([key, value]) => {
      if (value === null) params.delete(key);
      else params.set(key, value);
    });

    const str = params.toString();
    return str ? `?${str}` : '';
  };

  // Define sort order
  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  if (sort === 'price_desc') orderBy = { price: 'desc' };
  if (sort === 'name_asc') orderBy = { name: 'asc' };

  // Common where clause
  const where = {
    AND: [
      categorySlug ? { category: { slug: categorySlug } } : {},
      searchQuery ? {
        OR: [
          { name: { contains: searchQuery, mode: 'insensitive' } },
          { description: { contains: searchQuery, mode: 'insensitive' } },
        ]
      } : {},
      minPrice !== undefined ? { price: { gte: minPrice } } : {},
      maxPrice !== undefined ? { price: { lte: maxPrice } } : {},
    ]
  };

  // Fetch products, categories, and total count in parallel
  const [products, totalItems, categoriesData] = await Promise.all([
    prisma.product.findMany({
      where: where as any,
      include: {
        category: true,
        favorites: session?.user?.id ? {
          where: {
            userId: session.user.id
          }
        } : false
      },
      orderBy,
      take: ITEMS_PER_PAGE,
      skip: skip
    }),
    prisma.product.count({ where: where as any }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true } // Select only needed fields to avoid Date serialization issues
    })
  ]);

  // Cast to Category type compatible with client component if needed, or update component types
  const categories = categoriesData as any[]; 

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container py-8 md:py-12 mx-auto px-4">
        {/* Mobile Filter Trigger */}
        <div className="lg:hidden mb-6 flex justify-between items-center">
           <h1 className="text-2xl font-bold text-slate-900">Products</h1>
           <Sheet>
             <SheetTrigger asChild>
               <Button variant="outline" size="sm" className="gap-2">
                 <Filter className="h-4 w-4" />
                 Filters
               </Button>
             </SheetTrigger>
             <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
               <SheetHeader className="mb-6">
                 <SheetTitle className="text-left flex items-center gap-2">
                   <SlidersHorizontal className="h-5 w-5" />
                   Filters
                 </SheetTitle>
               </SheetHeader>
               <div className="space-y-8 pb-8">
                 <CategoryList categories={categories} />
                 <ProductFilters />
               </div>
             </SheetContent>
           </Sheet>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-72 space-y-8 flex-shrink-0">
            <div className="bg-white p-6 rounded-2xl border shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                 <SlidersHorizontal className="h-5 w-5 text-primary" />
                 <h2 className="text-lg font-bold">Filters</h2>
              </div>
              
              <div className="space-y-8">
                <CategoryList categories={categories} />
                <ProductFilters />
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            <div className="hidden lg:flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {searchQuery ? `Results for "${searchQuery}"` : 
                   categorySlug ? categories.find(c => c.slug === categorySlug)?.name : 
                   "All Products"}
                </h1>
                <p className="text-sm text-slate-500 mt-1">{totalItems} products available</p>
              </div>
            </div>

            <ActiveFilters />

            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border shadow-sm px-4 text-center">
                <div className="bg-slate-100 p-6 rounded-full mb-6">
                   <X className="h-12 w-12 text-slate-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">No products found</h2>
                <p className="text-slate-500 mb-8 max-w-sm">
                  We couldn&apos;t find any products matching your current filters. Try adjusting your search or clearing the filters.
                </p>
                <Button asChild variant="outline">
                   <Link href="/products">Clear All Filters</Link>
                </Button>
              </div>
            ) : (
              <div className="grid justify-center gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                  {products.map((product, index) => (
                    <FadeIn key={product.id} delay={index * 0.05}>
                      <ProductCard 
                        id={product.id}
                        name={product.name}
                        price={Number(product.price)}
                        imageUrl={product.imageUrl || undefined}
                        category={product.category?.name}
                        isFavorited={Array.isArray(product.favorites) && product.favorites.length > 0}
                        stock={product.stock}
                      />
                    </FadeIn>
                  ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <Button
                  asChild
                  variant="outline"
                  disabled={currentPage <= 1}
                  className={cn(currentPage <= 1 && "pointer-events-none opacity-50")}
                >
                  <Link href={`/products${buildQueryString({ page: (currentPage - 1).toString() })}`}>
                    Previous
                  </Link>
                </Button>
                
                <div className="flex items-center gap-2">
                   <span className="text-sm font-medium text-slate-900">Page {currentPage}</span>
                   <span className="text-sm text-slate-500">of {totalPages}</span>
                </div>

                <Button
                  asChild
                  variant="outline"
                  disabled={currentPage >= totalPages}
                  className={cn(currentPage >= totalPages && "pointer-events-none opacity-50")}
                >
                  <Link href={`/products${buildQueryString({ page: (currentPage + 1).toString() })}`}>
                    Next
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}