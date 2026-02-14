import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit, 
  ExternalLink 
} from "lucide-react";
import Link from "next/link";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { Pagination } from "@/components/Pagination";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const ITEMS_PER_PAGE = 20;
  const currentPage = Math.max(1, Number(page) || 1);
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  const [products, totalItems] = await Promise.all([
    prisma.product.findMany({
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: ITEMS_PER_PAGE,
      skip
    }),
    prisma.product.count()
  ]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your store inventory ({totalItems} total).</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="px-6 py-4 text-xs uppercase font-bold text-slate-500">Product</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-slate-500">Category</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-slate-500">Price</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-slate-500">Stock</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded border bg-slate-100 overflow-hidden">
                        {product.imageUrl && (
                          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                        )}
                      </div>
                      <span className="font-medium text-slate-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="secondary">{product.category?.name || "Uncategorized"}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    ${Number(product.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={product.stock < 10 ? "text-red-500 font-bold" : ""}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <Button variant="ghost" size="icon" asChild title="View on Store">
                          <Link href={`/products/${product.id}`} target="_blank">
                             <ExternalLink className="h-4 w-4 text-slate-400" />
                          </Link>
                       </Button>
                       <Button variant="ghost" size="icon" asChild title="Edit Product">
                          <Link href={`/admin/products/${product.id}`}>
                             <Edit className="h-4 w-4 text-slate-400" />
                          </Link>
                       </Button>
                       <DeleteProductButton id={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/admin/products" />
      </div>
    </div>
  );
}
