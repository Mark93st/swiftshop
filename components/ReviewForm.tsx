'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { submitReview } from '@/lib/actions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ReviewFormProps {
  productId: string;
  initialRating?: number;
  initialComment?: string;
  onSuccess?: () => void;
}

export function ReviewForm({ productId, initialRating = 5, initialComment = '', onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await submitReview(productId, rating, comment);
      if (result.success) {
        toast.success(result.message);
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-slate-50 p-6 rounded-2xl border">
      <h3 className="font-bold text-lg">Write a Review</h3>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none transition-transform hover:scale-110"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
            >
              <Star
                className={cn(
                  "h-6 w-6 transition-colors",
                  (hoveredRating || rating) >= star
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-slate-300"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="comment" className="text-sm font-medium text-slate-700">Your Feedback</label>
        <Textarea
          id="comment"
          placeholder="What did you like or dislike? How was the quality?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="bg-white"
          required
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
        {isLoading ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
}
