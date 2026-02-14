import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { Star, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReviewForm } from './ReviewForm';

interface ProductReviewsProps {
  productId: string;
}

export async function ProductReviews({ productId }: ProductReviewsProps) {
  const session = await auth();
  const userId = session?.user?.id;

  const reviews = await prisma.review.findMany({
    where: { productId },
    include: {
      user: {
        select: { name: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  // Check if user has purchased the product to show the review form
  let canReview = false;
  if (userId) {
    const purchase = await prisma.order.findFirst({
      where: {
        userId,
        status: 'PAID',
        orderItems: { some: { productId } }
      }
    });
    canReview = !!purchase;
  }

  const userReview = userId ? reviews.find(r => (r as any).userId === userId) : null;

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Customer Reviews</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-5 w-5",
                    averageRating >= star ? "fill-yellow-400 text-yellow-400" : "text-slate-300"
                  )}
                />
              ))}
            </div>
            <span className="font-bold text-lg">{averageRating.toFixed(1)}</span>
            <span className="text-slate-500 text-sm">({reviews.length} reviews)</span>
          </div>
        </div>

        {canReview && !userReview && (
          <div className="hidden md:block text-sm text-slate-500 italic">
            You&apos;ve purchased this item. Share your thoughts!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Review List */}
        <div className="lg:col-span-2 space-y-8">
          {reviews.length === 0 ? (
            <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed">
              <p className="text-slate-500">No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="space-y-3 border-b pb-8 last:border-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                       <User className="h-4 w-4 text-slate-400" />
                    </div>
                    <span className="font-bold text-slate-900">{review.user.name}</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {review.createdAt.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "h-4 w-4",
                        review.rating >= star ? "fill-yellow-400 text-yellow-400" : "text-slate-300"
                      )}
                    />
                  ))}
                </div>
                <p className="text-slate-600 leading-relaxed italic">
                  &quot;{review.comment}&quot;
                </p>
              </div>
            ))
          )}
        </div>

        {/* Sidebar: Write Review */}
        <div className="lg:col-span-1">
          {canReview ? (
            <div className="sticky top-24">
              <ReviewForm 
                productId={productId} 
                initialRating={userReview?.rating} 
                initialComment={userReview?.comment || ''}
              />
            </div>
          ) : (
            <div className="bg-slate-50 p-6 rounded-2xl border text-center">
               <p className="text-sm text-slate-500">
                 Only verified purchasers can leave a review.
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
