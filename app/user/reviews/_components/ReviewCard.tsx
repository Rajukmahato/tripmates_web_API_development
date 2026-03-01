'use client';

import { Review } from '@/app/_types/common.types';
import { StarRating } from './StarRating';
import { Card } from '@/app/_components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {review.reviewer.fullName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formatDistanceToNow(new Date(review.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
          <StarRating value={review.rating} readOnly size="sm" />
        </div>

        {/* Rating display */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-yellow-400">
              {review.rating}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              out of 5
            </span>
          </div>
        </div>

        {/* Comment */}
        {review.comment && (
          <div className="mb-4">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {review.comment}
            </p>
          </div>
        )}

        {/* Trip info */}
        {review.trip && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Trip: <span className="font-medium">{review.trip.destination}</span>
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
