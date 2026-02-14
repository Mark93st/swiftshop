import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">New Product</h1>
        <p className="text-muted-foreground">Add a new item to your store.</p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
