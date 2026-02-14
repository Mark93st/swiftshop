import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Layers,
  ArrowLeft,
  Menu
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  if (!isAdmin) {
    redirect("/");
  }

  const menuItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: Layers },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Users", href: "/admin/users", icon: Users },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-slate-50">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="text-[10px] uppercase font-bold px-2 py-0">Admin</Badge>
          <span className="font-bold text-sm">SwiftShop Control</span>
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <div className="p-6">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-left">Admin Panel</SheetTitle>
              </SheetHeader>
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 transition-colors"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 mt-4 border-t">
                  <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-500 rounded-md hover:bg-slate-100 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Store
                  </Link>
                </div>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:block">
        <div className="p-6 sticky top-0">
          <Link href="/" className="flex items-center text-sm font-medium text-slate-500 hover:text-primary mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Store
          </Link>
          <div className="mb-6 px-3 py-2 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest text-center">Admin Access</p>
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 transition-colors"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
