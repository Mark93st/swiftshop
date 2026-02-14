'use client';

import { useActionState } from 'react';
import { upsertProduct, ProductState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Product, Category } from '@prisma/client';
import { toast } from 'sonner';
import { useEffect } from 'react';

interface ProductFormProps {
  product?: Product;
  categories: Category[];
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const initialState: ProductState = { message: null, errors: {} };
  const upsertProductWithId = upsertProduct.bind(null, product?.id);
  const [state, dispatch, isPending] = useActionState(upsertProductWithId, initialState);

  useEffect(() => {
    if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={dispatch}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Product Name</label>
                <Input id="name" name="name" defaultValue={product?.name} placeholder="e.g. Premium Cotton Tee" required />
                {state.errors?.name && <p className="text-xs text-red-500">{state.errors.name}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <textarea
                  id="description"
                  name="description"
                  defaultValue={product?.description}
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  placeholder="Tell customers more about this product..."
                  required
                />
                {state.errors?.description && <p className="text-xs text-red-500">{state.errors.description}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & Stock</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">Price ($)</label>
                <Input id="price" name="price" type="number" step="0.01" defaultValue={Number(product?.price || 0)} required />
                {state.errors?.price && <p className="text-xs text-red-500">{state.errors.price}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="stock" className="text-sm font-medium">Inventory Stock</label>
                <Input id="stock" name="stock" type="number" defaultValue={product?.stock || 0} required />
                {state.errors?.stock && <p className="text-xs text-red-500">{state.errors.stock}</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Media & Category */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="categoryId" className="text-sm font-medium">Category</label>
                <select
                  id="categoryId"
                  name="categoryId"
                  defaultValue={product?.categoryId || ''}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {state.errors?.categoryId && <p className="text-xs text-red-500">{state.errors.categoryId}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="imageUrl" className="text-sm font-medium">Image URL</label>
                <Input id="imageUrl" name="imageUrl" defaultValue={product?.imageUrl || ''} placeholder="https://..." />
                {state.errors?.imageUrl && <p className="text-xs text-red-500">{state.errors.imageUrl}</p>}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <Button size="lg" className="w-full" disabled={isPending}>
              {isPending ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </Button>
            <Button variant="outline" size="lg" className="w-full" asChild>
              <Link href="/admin/products">Cancel</Link>
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
