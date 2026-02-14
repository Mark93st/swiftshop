import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductReviews } from "@/components/ProductReviews";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | SwiftShop`,
    description: product.description.slice(0, 160), // standard SEO description length
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.imageUrl ? [product.imageUrl] : [],
      type: 'website',
    },
  };
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container py-8 mx-auto px-4">
        <Link 
          href="/products" 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-2xl p-6 shadow-sm border">
          {/* Product Image */}
          <div className="aspect-square relative overflow-hidden rounded-xl bg-slate-100 border">
            <Image
              src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-6">
              {product.category && (
                <Badge variant="secondary" className="mb-4">
                  {product.category.name}
                </Badge>
              )}
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{product.name}</h1>
              <p className="text-2xl font-bold text-primary">${Number(product.price).toFixed(2)}</p>
            </div>

            <div className="prose prose-slate mb-8">
              <p className="text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="space-y-6 mb-8 pt-6 border-t">
               <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Truck className="h-5 w-5 text-primary" />
                  <span>Free shipping on orders over $100</span>
               </div>
               <div className="flex items-center gap-3 text-sm text-slate-600">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <span>2-year warranty included</span>
               </div>
               <div className="flex items-center gap-3 text-sm text-slate-600">
                  <RefreshCw className="h-5 w-5 text-primary" />
                  <span>30-day easy returns</span>
               </div>
            </div>

            <div className="mt-auto">
               <AddToCartButton 
                 product={{
                   id: product.id,
                   name: product.name,
                   price: Number(product.price),
                   imageUrl: product.imageUrl || undefined,
                   stock: product.stock
                 }} 
               />
               <p className="text-xs text-center text-slate-400 mt-4">
                  Secure checkout powered by Stripe
               </p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-20 pt-20 border-t">
           <ProductReviews productId={product.id} />
        </div>
      </div>
    </div>
  );
}
