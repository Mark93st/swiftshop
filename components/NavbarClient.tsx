'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, Search, Heart, User, LogOut, Package, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { signOut } from 'next-auth/react';
import { useDebounce } from '@/hooks/use-debounce';
import { UserMenu } from './UserMenu';

interface NavbarClientProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function NavbarClient({ user }: NavbarClientProps) {
  const totalItems = useCartStore((state) => state.totalItems());
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Avoid hydration mismatch by waiting until mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync debounced search with URL
  useEffect(() => {
    const currentQ = searchParams.get('q') || '';
    if (debouncedSearch !== currentQ) {
       // Only push if we are searching for something or clearing it
       if (debouncedSearch) {
         router.push(`/products?q=${encodeURIComponent(debouncedSearch)}`);
       } else if (currentQ) {
         // If we cleared the search, go back to products (preserving other params would be ideal but simple is fine for nav bar)
         router.push('/products');
       }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Sync local state if URL changes externally
  useEffect(() => {
    const urlQ = searchParams.get('q') || '';
    if (urlQ !== searchQuery) {
      setSearchQuery(urlQ);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Immediate trigger on enter
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center mx-auto px-4 gap-4">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl tracking-tight">
              SwiftShop
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/products" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Products
            </Link>
            <Link href="/products" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Categories
            </Link>
            <Link href="/about" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              About
            </Link>
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="hidden md:flex w-full max-w-sm items-center space-x-2">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full bg-muted/50 focus-visible:bg-background transition-all"
              />
            </form>
          </div>
          
          <div className="flex items-center gap-2">
             <Link href="/favorites">
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Favorites</span>
                </Button>
             </Link>
             <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {mounted && totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                      {totalItems}
                    </span>
                  )}
                  <span className="sr-only">Cart</span>
                </Button>
             </Link>

             <UserMenu user={user} />

             <Sheet>
               <SheetTrigger asChild>
                 <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                 </Button>
               </SheetTrigger>
               <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                 <SheetHeader>
                   <SheetTitle className="text-left">SwiftShop Menu</SheetTitle>
                 </SheetHeader>
                 <nav className="flex flex-col gap-4 mt-8">
                   <Link href="/products" className="text-lg font-medium hover:text-primary transition-colors border-b pb-2">
                     Products
                   </Link>
                   <Link href="/products" className="text-lg font-medium hover:text-primary transition-colors border-b pb-2">
                     Categories
                   </Link>
                   <Link href="/about" className="text-lg font-medium hover:text-primary transition-colors border-b pb-2">
                     About
                   </Link>
                   <Link href="/favorites" className="text-lg font-medium hover:text-primary transition-colors border-b pb-2 flex items-center gap-2">
                     <Heart className="h-5 w-5" /> Favorites
                   </Link>
                   
                   {!user && (
                     <Link href="/login" className="text-lg font-medium hover:text-primary transition-colors border-b pb-2">
                       Login / Register
                     </Link>
                   )}

                   {user && (
                     <>
                       {(user as any)?.role === 'ADMIN' && (
                         <Link href="/admin" className="text-lg font-bold text-primary transition-colors border-b pb-2 flex items-center gap-2">
                           <LayoutDashboard className="h-5 w-5" /> Admin Dashboard
                         </Link>
                       )}
                       <Link href="/profile" className="text-lg font-medium hover:text-primary transition-colors border-b pb-2 flex items-center gap-2">
                         <User className="h-5 w-5" /> Profile
                       </Link>
                       <Link href="/orders" className="text-lg font-medium hover:text-primary transition-colors border-b pb-2 flex items-center gap-2">
                         <Package className="h-5 w-5" /> Orders
                       </Link>
                       <Button 
                         variant="destructive" 
                         className="w-full justify-start gap-2 mt-4"
                         onClick={() => signOut({ callbackUrl: '/' })}
                       >
                         <LogOut className="h-5 w-5" /> Sign Out
                       </Button>
                     </>
                   )}
                 </nav>
               </SheetContent>
             </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
