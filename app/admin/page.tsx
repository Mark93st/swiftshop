import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  Package, 
  ShoppingBag, 
  Users,
  TrendingUp,
  Clock
} from "lucide-react";
import { RevenueChart } from "@/components/admin/RevenueChart";

export default async function AdminDashboardPage() {
  // Fetch stats in parallel
  const [
    totalSales,
    ordersCount,
    productsCount,
    usersCount,
    recentOrders,
    paidOrders
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: 'PAID' }
    }),
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    }),
    prisma.order.findMany({
      where: { status: 'PAID' },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true, totalAmount: true }
    })
  ]);

  // Aggregate revenue by month
  const monthlyRevenue: Record<string, number> = {};
  
  for (const order of paidOrders) {
    const month = order.createdAt.toLocaleDateString('en-US', { month: 'short' });
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(order.totalAmount);
  }

  const chartData = Object.entries(monthlyRevenue).map(([name, total]) => ({
    name,
    total
  }));

  const stats = [
    {
      label: "Total Revenue",
      value: `$${Number(totalSales._sum.totalAmount || 0).toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      label: "Total Orders",
      value: ordersCount,
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      label: "Products",
      value: productsCount,
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      label: "Customers",
      value: usersCount,
      icon: Users,
      color: "text-orange-600",
      bg: "bg-orange-50"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back, Admin. Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <div className={`${stat.bg} p-2 rounded-full`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <RevenueChart data={chartData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-slate-400" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between text-sm border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{order.user?.name || "Guest"}</p>
                    <p className="text-slate-500 text-xs">{order.createdAt.toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${Number(order.totalAmount).toFixed(2)}</p>
                    <p className="text-xs text-primary">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions / Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-slate-400" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-500">Database Connection</span>
                   <span className="text-green-600 font-medium">Healthy</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-500">Stripe Integration</span>
                   <span className="text-green-600 font-medium">Active</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-500">Email Service</span>
                   <span className="text-slate-500 font-medium">Not Configured</span>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
