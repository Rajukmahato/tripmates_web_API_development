'use client';

import React, { createContext, useContext, useCallback, useState } from 'react';
import { Review } from '@/app/_types/common.types';
import { useAuth } from './AuthContext';
import {
  submitReview as submitReviewAPI,
  getUserReviews,
  getMyReviews,
} from '@/lib/api/reviews';

interface ReviewContextType {
  reviews: Record<string, Review[]>;
  myReviews: Review[];
  isLoadingReviews: boolean;
  isSubmittingReview: boolean;
  error: string | null;

  // Actions
  fetchUserReviews: (userId: string) => Promise<void>;
  fetchMyReviews: () => Promise<void>;
  submitReview: (
    revieweeId: string,
    tripId: string,
    rating: number,
    comment?: string
  ) => Promise<void>;
  clearError: () => void;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const [reviews, setReviews] = useState<Record<string, Review[]>>({});
  const [myReviews, setMyReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserReviews = useCallback(async (userId: string) => {
    if (!user) return;

    setIsLoadingReviews(true);
    setError(null);

    try {
      const response = await getUserReviews(userId);
      const data = response.data || [];
      setReviews((prev) => ({
        ...prev,
        [userId]: data,
      }));
    } catch (err) {
      console.error('Failed to fetch user reviews:', err);
      setError('Failed to load reviews');
    } finally {
      setIsLoadingReviews(false);
    }
  }, [user]);

  const fetchMyReviews = useCallback(async () => {
    if (!user) return;

    setIsLoadingReviews(true);
    setError(null);

    try {
      const response = await getMyReviews();
      const data = response.data || [];
      setMyReviews(data);
    } catch (err) {
      console.error('Failed to fetch my reviews:', err);
      setError('Failed to load reviews');
    } finally {
      setIsLoadingReviews(false);
    }
  }, [user]);

  const submitReview = useCallback(
    async (
      revieweeId: string,
      tripId: string,
      rating: number,
      comment?: string
    ) => {
      if (!user) return;

      setIsSubmittingReview(true);
      setError(null);

      try {
        const newReview = await submitReviewAPI({
          revieweeId,
          tripId,
          rating,
          comment,
        });

        // Add to user reviews
        setReviews((prev) => ({
          ...prev,
          [revieweeId]: [
            newReview,
            ...(prev[revieweeId] || []),
          ],
        }));

        // Add to my reviews if needed
        setMyReviews((prev) => [newReview, ...prev]);
      } catch (err) {
        console.error('Failed to submit review:', err);
        setError('Failed to submit review');
        throw err;
      } finally {
        setIsSubmittingReview(false);
      }
    },
    [user]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: ReviewContextType = {
    reviews,
    myReviews,
    isLoadingReviews,
    isSubmittingReview,
    error,
    fetchUserReviews,
    fetchMyReviews,
    submitReview,
    clearError,
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReview() {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReview must be used within ReviewProvider');
  }
  return context;
}
