'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Ban, CheckCircle } from 'lucide-react';
import { toggleUserStatus } from '@/lib/actions';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UserStatusButtonProps {
  userId: string;
  isActive: boolean;
  isCurrentUser: boolean;
}

export function UserStatusButton({ userId, isActive, isCurrentUser }: UserStatusButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      try {
        const result = await toggleUserStatus(userId, isActive);
        if (result.success) {
          toast.success(`User account ${isActive ? 'suspended' : 'activated'} successfully`);
        } else {
          toast.error(result.message || 'Failed to update user status');
        }
      } catch (error) {
        toast.error('An unexpected error occurred');
      }
    });
  };

  if (isCurrentUser) return null;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 gap-1.5",
            isActive ? "text-red-600 hover:text-red-700 hover:bg-red-50" : "text-green-600 hover:text-green-700 hover:bg-green-50"
          )}
          disabled={isPending}
        >
          {isActive ? (
            <>
              <Ban className="h-3.5 w-3.5" />
              Suspend
            </>
          ) : (
            <>
              <CheckCircle className="h-3.5 w-3.5" />
              Activate
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{isActive ? 'Suspend' : 'Activate'} User Account?</AlertDialogTitle>
          <AlertDialogDescription>
            {isActive 
              ? "The user will no longer be able to log in or place orders until their account is reactivated."
              : "The user will regain access to their account and shopping features."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleToggle} className={cn(isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700")}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}