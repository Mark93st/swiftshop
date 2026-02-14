import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Printer, Truck, Calendar, CreditCard, Package, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user) {
    redirect("/login");
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
      user: true,
    },
  });

  if (!order || (order.userId !== session.user.id && (session.user as any).role !== 'ADMIN')) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link 
          href="/orders" 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Orders
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Order #{order.id.slice(0, 8)}</h1>
            <p className="text-slate-500 mt-1 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Placed on {order.createdAt.toLocaleDateString()} at {order.createdAt.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex gap-3">
             <Badge variant={order.status === 'PAID' ? 'default' : 'secondary'} className="px-4 py-1 text-sm">
                {order.status}
             </Badge>
             <Button variant="outline" size="sm" className="hidden sm:flex">
                <Printer className="h-4 w-4 mr-2" />
                Print Invoice
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Order Content */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="text-lg flex items-center">
                   <Package className="h-5 w-5 mr-2 text-primary" />
                   Order Items
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y">
                  {order.orderItems.map((item) => (
                    <li key={item.id} className="p-6 flex gap-4">
                      <div className="h-20 w-20 rounded-lg bg-slate-100 border overflow-hidden flex-shrink-0">
                        {item.product.imageUrl && (
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.name} 
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                           <h3 className="font-semibold text-slate-900">{item.product.name}</h3>
                           <p className="font-bold text-slate-900">${(Number(item.priceAtPurchase) * item.quantity).toFixed(2)}</p>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-slate-500">
                          Unit Price: ${Number(item.priceAtPurchase).toFixed(2)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="bg-slate-50/50 p-6 flex flex-col gap-3">
                 <div className="flex justify-between text-sm text-slate-600 w-full">
                    <span>Subtotal</span>
                    <span>${Number(order.totalAmount).toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-sm text-slate-600 w-full">
                    <span>Shipping</span>
                    <span>$0.00</span>
                 </div>
                 <div className="flex justify-between text-lg font-bold text-slate-900 w-full pt-3 border-t">
                    <span>Total</span>
                    <span>${Number(order.totalAmount).toFixed(2)}</span>
                 </div>
              </CardFooter>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
             <Card>
                <CardHeader>
                   <CardTitle className="text-lg flex items-center">
                      <Truck className="h-5 w-5 mr-2 text-primary" />
                      Shipping
                   </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                   <p className="font-medium text-slate-900">{order.user?.name}</p>
                   <p className="text-slate-500">Shipping information is managed via Stripe checkout.</p>
                   <div className="pt-4 mt-4 border-t">
                      <p className="text-xs font-bold uppercase text-slate-400 mb-2">Estimated Delivery</p>
                      <p className="font-medium">3-5 Business Days</p>
                   </div>
                </CardContent>
             </Card>

             <Card>
                <CardHeader>
                   <CardTitle className="text-lg flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-primary" />
                      Payment
                   </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                   <p className="text-slate-500">Paid via Stripe</p>
                   {order.stripePaymentId && (
                     <p className="text-xs text-slate-400 font-mono break-all">
                        ID: {order.stripePaymentId}
                     </p>
                   )}
                   <div className="pt-4 mt-4 border-t">
                      <p className="text-xs font-bold uppercase text-slate-400 mb-2">Status</p>
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                         Payment Successful
                      </Badge>
                   </div>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
