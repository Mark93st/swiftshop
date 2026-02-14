'use client';

import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store';
import Link from 'next/link';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { FavoriteButton } from './FavoriteButton';
import Image from 'next/image';
import { toast } from 'sonner';
import { useState } from 'react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
  isFavorited?: boolean;
  stock: number;
}

export function ProductCard({ id, name, price, imageUrl, category, isFavorited = false, stock }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const isOutOfStock = stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem({
      id,
      name,
      price,
      imageUrl,
      quantity,
    });
    toast.success(`Added ${quantity} ${name} to cart`);
    setQuantity(1);
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md flex flex-col h-full">
      <Link href={`/products/${id}`} className="block relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'}
          alt={name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </Link>
      
      <div className="absolute top-2 right-2 z-20">
        <FavoriteButton productId={id} initialIsFavorited={isFavorited} />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <Link href={`/products/${id}`} className="hover:text-primary transition-colors">
          <h3 className="text-lg font-bold text-slate-900 truncate">{name}</h3>
        </Link>
        {category && <p className="text-sm text-slate-500 mb-2">{category}</p>}
        
        <div className="flex flex-col gap-3 mt-auto pt-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900">${price.toFixed(2)}</span>
            <div className="flex items-center border rounded-md overflow-hidden bg-slate-50 h-8">
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuantity(q => Math.max(1, q - 1)); }}
                className="px-2 hover:bg-slate-200 transition-colors"
                disabled={isOutOfStock}
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-8 text-center text-xs font-medium">{quantity}</span>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuantity(q => q + 1); }}
                className="px-2 hover:bg-slate-200 transition-colors"
                disabled={isOutOfStock}
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>
          
          <Button 
            size="sm" 
            className="w-full gap-1.5 h-9 relative z-20" 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            variant={isOutOfStock ? "secondary" : "default"}
          >
            {isOutOfStock ? "Sold Out" : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
