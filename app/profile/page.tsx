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
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Info & Edit Form */}
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <CardDescription>Member since {user.createdAt.toLocaleDateString()}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-sm p-3 bg-slate-50 rounded-lg">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm p-3 bg-slate-50 rounded-lg">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {user.createdAt.toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          <ProfileForm user={{ id: user.id, name: user.name, email: user.email }} />
        </div>

        {/* Statistics/Overview */}
        <div className="md:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Activity Overview</h2>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user._count.orders}</div>
              <p className="text-xs text-muted-foreground">Orders placed to date</p>
            </CardContent>
          </Card>
          
          <Card>
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
