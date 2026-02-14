'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteCategory } from '@/lib/actions';
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

interface DeleteCategoryButtonProps {
  id: string;
}

export function DeleteCategoryButton({ id }: DeleteCategoryButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteCategory(id);
        if (result.success) {
          toast.success('Category deleted successfully');
        } else {
          toast.error(result.message || 'Failed to delete category');
        }
      } catch (error) {
        toast.error('An unexpected error occurred');
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:text-red-600"
          disabled={isPending}
        >
          <Trash2 className="h-4 w-4 text-slate-400" />
          <span className="sr-only">Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Category?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove this category. This action is only possible if there are no products linked to it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}