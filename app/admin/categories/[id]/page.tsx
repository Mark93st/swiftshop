import { prisma } from "@/lib/prisma";
import CategoryForm from "@/components/admin/CategoryForm";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: { id }
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Edit Category</h1>
        <p className="text-muted-foreground">Update category name and slug.</p>
      </div>
      <CategoryForm category={category} />
    </div>
  );
}
