import { apiClient } from '@/lib/api/axios';
import { AnalyticsOverview, AnalyticsPeriodData, SystemPerformance, MatchStats } from '@/lib/types';

/**
 * Admin Analytics API Functions (v2)
 * Handles analytics and statistics for admins
 */

// ============================================
// ANALYTICS OVERVIEW
// ============================================

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  try {
    const response = await apiClient.get('/api/admin/analytics/overview');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    throw error;
  }
}

// ============================================
// USER ANALYTICS
// ============================================

export async function getUserGrowth(
  period: 'week' | 'month' | 'year' = 'month'
): Promise<AnalyticsPeriodData[]> {
  try {
    const response = await apiClient.get('/api/admin/analytics/users', {
      params: { period },
    });
    const data = response.data.data || response.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching user growth:', error);
    throw error;
  }
}

// ============================================
// TRIP ANALYTICS
// ============================================

export async function getTripTrends(
  period: 'week' | 'month' | 'year' = 'month'
): Promise<AnalyticsPeriodData[]> {
  try {
    const response = await apiClient.get('/api/admin/analytics/trips', {
      params: { period },
    });
    const data = response.data.data || response.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching trip trends:', error);
    throw error;
  }
}

// ============================================
// MATCH STATISTICS
// ============================================

export async function getMatchStats(): Promise<MatchStats> {
  try {
    const response = await apiClient.get('/api/admin/analytics/matches');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching match statistics:', error);
    throw error;
  }
}

// ============================================
// SYSTEM PERFORMANCE
// ============================================

export async function getPerformanceMetrics(): Promise<SystemPerformance> {
  try {
    const response = await apiClient.get('/api/admin/analytics/performance');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    throw error;
  }
}
