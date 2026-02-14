'use client';

import { useTransition } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { updateUserRole } from '@/lib/actions';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface RoleSwitcherProps {
  userId: string;
  currentRole: 'USER' | 'ADMIN';
  isCurrentUser: boolean;
}

export function RoleSwitcher({ userId, currentRole, isCurrentUser }: RoleSwitcherProps) {
  const [isPending, startTransition] = useTransition();

  const handleRoleChange = (newRole: 'USER' | 'ADMIN') => {
    if (newRole === currentRole) return;
    
    startTransition(async () => {
      try {
        const result = await updateUserRole(userId, newRole);
        if (result.success) {
          toast.success(`User role updated to ${newRole}`);
        } else {
          toast.error(result.message || 'Failed to update role');
        }
      } catch (error) {
        toast.error('An unexpected error occurred');
      }
    });
  };

  return (
    <div className={cn("w-32", isPending && "opacity-50")}>
      <Select 
        defaultValue={currentRole} 
        onValueChange={(val) => handleRoleChange(val as any)}
        disabled={isPending || isCurrentUser}
      >
        <SelectTrigger className="h-8 text-xs font-medium">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="USER">User</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
