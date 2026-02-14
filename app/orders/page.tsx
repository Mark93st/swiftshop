import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ExternalLink, Calendar, CreditCard, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: {
      user: {
        email: session.user.email!
      }
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Order History</h1>
          <p className="text-muted-foreground mt-1">Manage and track your recent orders.</p>
        </div>
        <Package className="h-8 w-8 text-muted-foreground hidden sm:block" />
      </div>

      {orders.length === 0 ? (
        <Card className="text-center py-20">
          <CardContent>
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h2 className="text-xl font-semibold mb-2">No orders found</h2>
            <p className="text-muted-foreground mb-6">You haven&apos;t placed any orders yet.</p>
            <Link href="/products" className="text-primary hover:underline font-medium">
              Start Shopping
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-slate-50 border-b py-4">
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-xs uppercase font-bold text-slate-500 mb-1">Date Placed</p>
                      <div className="flex items-center text-sm font-medium">
                        <Calendar className="mr-2 h-4 w-4 text-slate-400" />
                        {order.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs uppercase font-bold text-slate-500 mb-1">Total</p>
                      <div className="flex items-center text-sm font-medium">
                        <CreditCard className="mr-2 h-4 w-4 text-slate-400" />
                        ${Number(order.totalAmount).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge variant={order.status === 'PAID' ? 'default' : 'secondary'} className="mb-2 px-3">
                      {order.status}
                    </Badge>
                    <Button asChild variant="outline" size="sm" className="h-8 text-xs font-bold gap-1">
                      <Link href={`/orders/${order.id}`}>
                        View Details
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y">
                  {order.orderItems.map((item) => (
                    <li key={item.id} className="p-4 flex items-center gap-4">
                      <div className="h-16 w-16 rounded-md bg-slate-100 border overflow-hidden flex-shrink-0">
                        {item.product.imageUrl && (
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.name} 
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link 
                          href={`/products/${item.productId}`}
                          className="font-medium text-slate-900 hover:text-primary truncate block"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-slate-500">
                          Qty: {item.quantity} × ${Number(item.priceAtPurchase).toFixed(2)}
                        </p>
                      </div>
                      <Link href={`/products/${item.productId}`} className="text-slate-400 hover:text-primary">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}