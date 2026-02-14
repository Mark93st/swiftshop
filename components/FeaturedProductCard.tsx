'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/store';
import Link from 'next/link';
import { toast } from 'sonner';

interface FeaturedProductCardProps {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  category?: string;
  stock: number;
}

export function FeaturedProductCard({
  id,
  name,
  price,
  description,
  imageUrl,
  category,
  stock,
}: FeaturedProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const isOutOfStock = stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addItem({
      id,
      name,
      price,
      imageUrl,
      quantity: 1,
    });
    toast.success(`Added ${name} to cart`);
  };

  return (
    <Card className="group overflow-hidden border-none shadow-none bg-transparent">
      <Link href={`/products/${id}`} className="block">
        <div className="relative w-full h-[300px] lg:h-[350px] overflow-hidden rounded-xl bg-muted group-hover:opacity-90 transition-opacity">
          <Image
            src={imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'}
            alt={name}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 right-4 flex flex-col gap-2 items-end z-10">
            {category && (
              <Badge className="bg-background/80 backdrop-blur text-foreground border-none hover:bg-background/90">
                {category}
              </Badge>
            )}
            {isOutOfStock && (
              <Badge variant="destructive" className="uppercase text-[10px] font-bold">
                Out of Stock
              </Badge>
            )}
          </div>
        </div>
      </Link>
      <CardHeader className="px-0 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
            {name}
          </CardTitle>
          <span className="font-bold text-lg">${price.toFixed(2)}</span>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-4">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {description}
        </p>
      </CardContent>
      <CardFooter className="px-0">
        <Button 
          className="w-full rounded-xl" 
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          variant={isOutOfStock ? "secondary" : "default"}
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
