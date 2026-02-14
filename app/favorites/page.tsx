import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function FavoritesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const favorites = await prisma.favorite.findMany({
    where: {
      userId: session.user.id!
    },
    include: {
      product: {
        include: {
          category: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="h-8 w-8 text-red-500 fill-red-500" />
        <h1 className="text-3xl font-bold">My Favorites</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border shadow-sm">
          <Heart className="h-12 w-12 text-slate-200 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-8">
            Save items you love to find them easily later.
          </p>
          <Button asChild>
            <Link href="/products">Explore Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid justify-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {favorites.map((fav) => (
            <ProductCard 
              key={fav.productId}
              id={fav.productId}
              name={fav.product.name}
              price={Number(fav.product.price)}
              imageUrl={fav.product.imageUrl || undefined}
              category={fav.product.category?.name}
              isFavorited={true}
              stock={fav.product.stock}
            />
          ))}
        </div>
      )}
    </div>
  );
}
