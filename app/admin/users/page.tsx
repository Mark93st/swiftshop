import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { 
  User as UserIcon, 
  Mail, 
  Calendar,
  Shield,
  Ban
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RoleSwitcher } from "@/components/admin/RoleSwitcher";
import { UserStatusButton } from "@/components/admin/UserStatusButton";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/Pagination";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const session = await auth();
  const currentUserId = session?.user?.id;

  const ITEMS_PER_PAGE = 20;
  const currentPage = Math.max(1, Number(page) || 1);
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  const [users, totalItems] = await Promise.all([
    prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        _count: {
          select: { orders: true }
        }
      },
      take: ITEMS_PER_PAGE,
      skip
    }),
    prisma.user.count()
  ]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground">View and manage customer accounts ({totalItems} total).</p>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="px-6 py-4 text-xs uppercase font-bold text-slate-500">User</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-slate-500">Status</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-slate-500">Role</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-slate-500 text-center">Orders</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-slate-500">Joined</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id} className={cn("hover:bg-slate-50 transition-colors", !user.isActive && "bg-slate-50/50 opacity-80")}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <UserIcon className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{user.name || "Anonymous"}</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.isActive ? (
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Active</Badge>
                    ) : (
                      <Badge variant="destructive" className="gap-1">
                        <Ban className="h-3 w-3" />
                        Suspended
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <RoleSwitcher 
                      userId={user.id} 
                      currentRole={user.role as any} 
                      isCurrentUser={user.id === currentUserId}
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium">{user._count.orders}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {user.createdAt.toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <UserStatusButton 
                      userId={user.id} 
                      isActive={user.isActive} 
                      isCurrentUser={user.id === currentUserId} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/admin/users" />
      </div>
    </div>
  );
}
