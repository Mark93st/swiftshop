import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingBag, 
  User, 
  Calendar, 
  CreditCard,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { UpdateStatus } from "@/components/admin/UpdateStatus";
import { Pagination } from "@/components/Pagination";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page, q: searchQuery } = await searchParams;
  const ITEMS_PER_PAGE = 20;
  const currentPage = Math.max(1, Number(page) || 1);
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  const where = searchQuery ? {
    OR: [
      { id: { contains: searchQuery, mode: 'insensitive' } },
      { user: { name: { contains: searchQuery, mode: 'insensitive' } } },
      { user: { email: { contains: searchQuery, mode: 'insensitive' } } },
    ]
  } : {};

  const [orders, totalItems] = await Promise.all([
    prisma.order.findMany({
      where: where as any,
      include: {
        user: true,
        orderItems: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: ITEMS_PER_PAGE,
      skip
    }),
    prisma.order.count({ where: where as any })
  ]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Monitor and manage customer orders ({totalItems} total).</p>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50/50">
           <form className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                name="q"
                defaultValue={searchQuery}
                placeholder="Search order ID or customer..." 
                className="pl-8 bg-white" 
              />
           </form>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="px-6 py-4 text-xs uppercase font-bold text-slate-500">Order ID</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-slate-500">Customer</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-slate-500">Status</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-slate-500">Total</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-slate-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-slate-500">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">{order.user?.name || "Guest User"}</span>
                      <span className="text-xs text-slate-500">{order.user?.email || "No email"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <UpdateStatus orderId={order.id} currentStatus={order.status} />
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">
                    ${Number(order.totalAmount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {order.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          baseUrl="/admin/orders" 
          searchParams={searchQuery ? { q: searchQuery } : undefined}
        />
      </div>
    </div>
  );
}
