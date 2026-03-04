'use client';

import { useEffect, useState } from 'react';
import { Review } from '@/app/_types/common.types';
import { getAllReviews, deleteReview } from '@/lib/api/admin/reviews';
import { Button } from '@/app/_components/ui/button';
import { Card } from '@/app/_components/ui/card';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { StarRating } from '@/app/user/reviews/_components/StarRating';
import { Trash2 } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ratingFilter, setRatingFilter] = useState<'all' | 1 | 2 | 3 | 4 | 5>('all');
  const [actioningReviewId, setActioningReviewId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const data = await getAllReviews();
      setReviews(data);
    } catch (error) {
      toast.error('Failed to load reviews');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    setActioningReviewId(reviewId);
    try {
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      setDeleteConfirm(null);
      toast.success('Review deleted');
    } catch (error) {
      toast.error('Failed to delete review');
      console.error('Error:', error);
    } finally {
      setActioningReviewId(null);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    if (ratingFilter === 'all') return true;
    return review.rating === ratingFilter;
  });

  const ratingStats = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-muted dark:from-background dark:to-slate-900">
      <div className="container-max section-padding">
        <div className="mb-8 animate-slideInUp">
          <h1 className="text-4xl font-bold mb-2">
            Reviews Monitoring
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage user reviews and ratings
          </p>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
        <Card className="p-4">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Average</p>
          <p className="text-2xl font-bold text-yellow-600">{averageRating}</p>
        </Card>
        {[5, 4, 3, 2, 1].map((rating) => (
          <Card key={rating} className="p-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {rating}★
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {ratingStats[rating as keyof typeof ratingStats]}
            </p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <Button
          onClick={() => setRatingFilter('all')}
          variant={ratingFilter === 'all' ? 'default' : 'outline'}
          size="sm"
        >
          All
        </Button>
        {[5, 4, 3, 2, 1].map((rating) => (
          <Button
            key={rating}
            onClick={() => setRatingFilter(rating as 1 | 2 | 3 | 4 | 5)}
            variant={ratingFilter === rating ? 'default' : 'outline'}
            size="sm"
          >
            {rating}★ ({ratingStats[rating as keyof typeof ratingStats]})
          </Button>
        ))}
      </div>

      {/* Reviews Table */}
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Loading reviews...
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No reviews found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Reviewer
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Reviewee
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Trip
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Comment
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredReviews.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {review.reviewer.fullName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {review.reviewee.fullName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {review.trip.destination}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <StarRating value={review.rating} readOnly size="sm" />
                        <span className="font-semibold">{review.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                      <p className="truncate">
                        {review.comment || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {formatDistanceToNow(new Date(review.createdAt), {
                        addSuffix: true,
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {deleteConfirm === review._id ? (
                        <div className="space-x-2">
                          <Button
                            onClick={() => handleDeleteReview(review._id)}
                            disabled={actioningReviewId === review._id}
                            size="sm"
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {actioningReviewId === review._id
                              ? 'Deleting...'
                              : 'Confirm'}
                          </Button>
                          <Button
                            onClick={() => setDeleteConfirm(null)}
                            disabled={actioningReviewId === review._id}
                            size="sm"
                            variant="outline"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setDeleteConfirm(review._id)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  </div>
);
}
