'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    stock: number;
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [mounted, setMounted] = useState(false);
  const { addItem, items } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default values for SSR before hydration
  let itemsInCart = 0;
  if (mounted) {
    const cartItem = items.find((i) => i.id === product.id);
    itemsInCart = cartItem?.quantity || 0;
  }
  
  // Calculate true remaining stock
  const remainingStock = Math.max(0, product.stock - itemsInCart);
  const isOutOfStock = remainingStock <= 0;

  const increment = () => setQuantity((prev) => (prev < remainingStock ? prev + 1 : prev));
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity,
    });
    setQuantity(1); // Reset local quantity after adding
    toast.success(`Added ${quantity} ${product.name} to cart`);
  };

  // Prevent flash of incorrect state during SSR by maintaining structure but hiding text/disabling interaction slightly
  if (!mounted) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center border rounded-lg overflow-hidden">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none border-r" disabled>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-medium">1</span>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none border-l" disabled>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-sm font-medium text-muted-foreground opacity-0">Loading...</span>
        </div>
        <Button size="lg" className="w-full gap-2 h-12 text-base font-semibold" disabled>
          <ShoppingCart className="h-5 w-5" />
          Add to Cart
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className={cn(
          "flex items-center border rounded-lg overflow-hidden",
          isOutOfStock && "opacity-50 pointer-events-none"
        )}>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-none border-r"
            onClick={decrement}
            disabled={isOutOfStock}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-none border-l"
            onClick={increment}
            disabled={isOutOfStock || quantity >= remainingStock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <span className={cn(
          "text-sm font-medium",
          isOutOfStock ? "text-red-500" : "text-green-600"
        )}>
          {isOutOfStock 
            ? "Out of Stock" 
            : itemsInCart > 0 
              ? `${remainingStock} available (you have ${itemsInCart})`
              : `${remainingStock} available`}
        </span>
      </div>
      <Button 
        size="lg" 
        className="w-full gap-2 h-12 text-base font-semibold" 
        onClick={handleAddToCart}
        disabled={isOutOfStock}
      >
        {isOutOfStock ? "Unavailable" : (
          <>
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </>
        )}
      </Button>
    </div>
  );
}
