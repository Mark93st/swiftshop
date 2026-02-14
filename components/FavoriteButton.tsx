'use client';

import { useOptimistic, useTransition } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toggleFavorite } from '@/lib/actions';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface FavoriteButtonProps {
  productId: string;
  initialIsFavorited?: boolean;
  className?: string;
}

export function FavoriteButton({ productId, initialIsFavorited = false, className }: FavoriteButtonProps) {
  const [optimisticIsFavorited, setOptimisticIsFavorited] = useOptimistic(
    initialIsFavorited,
    (state, newValue: boolean) => newValue
  );
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newState = !optimisticIsFavorited;

    startTransition(async () => {
      setOptimisticIsFavorited(newState);
      try {
        await toggleFavorite(productId);
        router.refresh();
      } catch (error) {
        // useOptimistic automatically reverts when the transition ends (on error)
        if (error instanceof Error && error.message.includes('logged in')) {
          toast.error('Please login to favorite items');
          router.push('/login');
        } else {
          toast.error('Failed to update favorite');
        }
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all shadow-sm",
        className
      )}
      onClick={handleToggle}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-colors",
          optimisticIsFavorited ? "fill-red-500 text-red-500" : "text-slate-600"
        )}
      />
      <span className="sr-only">Favorite</span>
    </Button>
  );
}
