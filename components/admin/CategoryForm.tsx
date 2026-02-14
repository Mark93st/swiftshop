'use client';

import { useActionState } from 'react';
import { upsertCategory, CategoryState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Category } from '@prisma/client';
import { toast } from 'sonner';
import { useEffect } from 'react';

interface CategoryFormProps {
  category?: Category;
}

export default function CategoryForm({ category }: CategoryFormProps) {
  const initialState: CategoryState = { message: null, errors: {} };
  const upsertCategoryWithId = upsertCategory.bind(null, category?.id);
  const [state, dispatch, isPending] = useActionState(upsertCategoryWithId, initialState);

  useEffect(() => {
    if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={dispatch}>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{category ? 'Edit Category' : 'Basic Information'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Category Name</label>
            <Input id="name" name="name" defaultValue={category?.name} placeholder="e.g. Summer Collection" required />
            {state.errors?.name && <p className="text-xs text-red-500">{state.errors.name}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="slug" className="text-sm font-medium">Slug (URL identifier)</label>
            <Input id="slug" name="slug" defaultValue={category?.slug} placeholder="e.g. summer-collection" required />
            <p className="text-[10px] text-muted-foreground">Used in URLs: /products?category=slug</p>
            {state.errors?.slug && <p className="text-xs text-red-500">{state.errors.slug}</p>}
          </div>
          
          {state.message && <p className="text-sm text-red-500 font-medium">{state.message}</p>}

          <div className="flex gap-3 pt-4">
            <Button disabled={isPending}>
              {isPending ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/categories">Cancel</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
