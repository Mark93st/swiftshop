import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id }
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
  ]);

  if (!product) {
    notFound();
  }

  // Convert Decimal and Dates to plain types for Client Component
  const serializableProduct = {
    ...product,
    price: Number(product.price),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground">Modify product details and pricing.</p>
      </div>
      <ProductForm product={serializableProduct as any} categories={categories} />
    </div>
  );
}
