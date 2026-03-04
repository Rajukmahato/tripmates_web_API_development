import { apiClient } from '@/lib/api/axios';
import { Review } from '@/lib/types';

export async function getAllReviews(): Promise<Review[]> {
  try {
    const response = await apiClient.get('/api/reviews/admin/all');
    const data = response.data.data || response.data;
    
    // Ensure we return an array
    if (Array.isArray(data)) {
      return data;
    }
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      return data.reviews || data.data || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
}

export async function deleteReview(reviewId: string): Promise<void> {
  try {
    await apiClient.delete(`/api/reviews/admin/${reviewId}`);
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
}

/**
 * Get review statistics (Admin dashboard)
 */
export async function getReviewStats(): Promise<{
  totalReviews: number;
  averageRating: number;
  pendingReviews: number;
}> {
  try {
    const response = await apiClient.get('/api/reviews/admin/stats');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching review stats:', error);
    throw error;
  }
}
