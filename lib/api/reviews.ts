import { apiClient } from '@/lib/api/axios';
import { Review } from '@/lib/types';

interface SubmitReviewPayload {
  revieweeId: string;
  tripId: string;
  rating: number;
  comment?: string;
}

export async function submitReview(
  payload: SubmitReviewPayload
): Promise<Review> {
  try {
    const response = await apiClient.post('/api/reviews', payload);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
}

export interface ReviewsResponse {
  success: boolean;
  data: Review[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export async function getUserReviews(userId: string, page = 1, limit = 10): Promise<ReviewsResponse> {
  try {
    const response = await apiClient.get(`/api/reviews/user/${userId}?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    throw error;
  }
}

export async function getMyReviews(page = 1, limit = 10): Promise<ReviewsResponse> {
  try {
    const response = await apiClient.get(`/api/reviews/my?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching my reviews:', error);
    throw error;
  }
}

export async function getAllReviews(page = 1, limit = 10): Promise<ReviewsResponse> {
  try {
    const response = await apiClient.get(`/api/reviews/admin/all?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    throw error;
  }
}

export async function deleteReview(reviewId: string): Promise<void> {
  try {
    await apiClient.delete(`/api/reviews/${reviewId}`);
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
}
