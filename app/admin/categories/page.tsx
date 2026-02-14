import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit } from "lucide-react";
import Link from "next/link";
import { DeleteCategoryButton } from "@/components/admin/DeleteCategoryButton";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: {
      name: 'asc'
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Manage product categories and slugs.</p>
        </div>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden max-w-4xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b">
              <th className="px-6 py-4 text-xs uppercase font-bold text-slate-500">Name</th>
              <th className="px-6 py-4 text-xs uppercase font-bold text-slate-500">Slug</th>
              <th className="px-6 py-4 text-xs uppercase font-bold text-slate-500 text-center">Products</th>
              <th className="px-6 py-4 text-xs uppercase font-bold text-slate-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{cat.name}</td>
                <td className="px-6 py-4 text-sm font-mono text-slate-500">{cat.slug}</td>
                <td className="px-6 py-4 text-center">
                  <Badge variant="secondary">{cat._count.products}</Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/categories/${cat.id}`}>
                        <Edit className="h-4 w-4 text-slate-400" />
                      </Link>
                    </Button>
                    <DeleteCategoryButton id={cat.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
