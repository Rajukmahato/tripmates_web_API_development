'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/app/_components/ui/button';
import { Card } from '@/app/_components/ui/card';
import { StarRating } from './StarRating';
import { useReview } from '@/app/_context/ReviewContext';
import toast from 'react-hot-toast';
import { useState } from 'react';

const reviewSchema = z.object({
  comment: z
    .string()
    .max(500, 'Comment must be less than 500 characters')
    .optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  revieweeId: string;
  tripId: string;
  onSuccess?: () => void;
}

export function ReviewForm({
  revieweeId,
  tripId,
  onSuccess,
}: ReviewFormProps) {
  const { submitReview, isSubmittingReview, error } = useReview();
  const [rating, setRating] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
  });

  const onSubmit = async (data: ReviewFormData) => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      await submitReview(revieweeId, tripId, rating, data.comment);
      toast.success('Review submitted successfully');
      reset();
      setRating(0);
      onSuccess?.();
    } catch {
      toast.error(error || 'Failed to submit review');
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
            Rating
          </label>
          <StarRating
            value={rating}
            onChange={setRating}
            size="lg"
          />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {rating > 0
              ? `You rated ${rating} star${rating !== 1 ? 's' : ''}`
              : 'Select a rating'}
          </p>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Comment (Optional)
          </label>
          <textarea
            id="comment"
            {...register('comment')}
            maxLength={500}
            placeholder="Share your experience with this trip partner..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none"
            rows={4}
          />
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Maximum 500 characters
          </p>
          {errors.comment && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              {errors.comment.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmittingReview || rating === 0}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </Card>
  );
}
