'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useReview } from '@/app/_context/ReviewContext';
import { ReviewCard } from '@/app/user/reviews/_components/ReviewCard';
import { Avatar } from '@/app/_components/ui/avatar';
import { Button } from '@/app/_components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { apiClient } from '@/lib/api/axios';
import { StarRating } from '@/app/user/reviews/_components/StarRating';

export default function UserReviewsPage() {
  const params = useParams();
  const userId = params.id as string;
  const { reviews, fetchUserReviews, isLoadingReviews } = useReview();
  const [userData, setUserData] = useState<{ _id: string; fullName: string; email: string; bio?: string; profileImage?: string } | null>(null);

  useEffect(() => {
    if (userId) {
      // Fetch user data
      apiClient
        .get(`/api/users/${userId}`)
        .then((res) => {
          setUserData(res.data.data || res.data);
        })
        .catch((err) => console.error('Failed to fetch user:', err));

      // Fetch reviews
      fetchUserReviews(userId);
    }
  }, [userId, fetchUserReviews]);

  const userReviews = reviews[userId] || [];
  const averageRating =
    userReviews.length > 0
      ? (
          userReviews.reduce((sum, review) => sum + review.rating, 0) /
          userReviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-muted dark:from-background dark:to-slate-900">
      <div className="container-max section-padding">
        {/* Header */}
        <div className="mb-8 animate-slideInUp">
          <Link href="/user/trips">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        {/* User Info and Rating */}
        {userData && (
          <div className="card-base rounded-lg p-8 mb-8">
            <div className="flex items-start gap-6">
              <Avatar 
                size="lg"
                className="h-24 w-24 flex-shrink-0"
                name={userData.fullName}
                profileImagePath={userData.profileImage}
              />

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {userData.fullName}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {userData.email}
                </p>
                {userData.bio && (
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {userData.bio}
                  </p>
                )}

                {/* Rating Summary */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-yellow-400">
                      {averageRating}
                    </span>
                    <div className="flex flex-col">
                      <StarRating
                        value={Math.round(Number(averageRating))}
                        readOnly
                        size="sm"
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {userReviews.length} review{userReviews.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Reviews
          </h2>

          {isLoadingReviews ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Loading reviews...</p>
            </div>
          ) : userReviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No reviews yet
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Be the first to review this user
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {userReviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
