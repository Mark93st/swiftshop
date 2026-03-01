import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Package } from "lucide-react";
import { ProfileForm } from "@/components/ProfileForm";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      _count: {
        select: { orders: true, favorites: true }
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Info & Edit Form */}
        <div className="md:col-span-2 space-y-8 min-w-0">
          <Card className="overflow-hidden">
            <CardHeader className="p-0 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-6 sm:p-0">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div className="min-w-0 flex-1 text-center sm:text-left overflow-hidden">
                  <CardTitle className="text-2xl break-all sm:break-words leading-tight">
                    {user.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Member since {user.createdAt.toLocaleDateString()}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6">
              <div className="flex items-center gap-3 text-sm p-3 bg-slate-50 rounded-lg min-w-0 overflow-hidden border">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="truncate flex-1 font-medium">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm p-3 bg-slate-50 rounded-lg shrink-0 border">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">Joined {user.createdAt.toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          <ProfileForm user={{ id: user.id, name: user.name, email: user.email }} />
        </div>

        {/* Statistics/Overview */}
        <div className="md:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Activity Overview</h2>
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user._count.orders}</div>
              <p className="text-xs text-muted-foreground">Orders placed to date</p>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Favorites</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user._count.favorites}</div>
              <p className="text-xs text-muted-foreground">Items in your wishlist</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
