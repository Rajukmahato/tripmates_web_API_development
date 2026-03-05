import { apiClient } from '@/lib/api/axios';
import { Report } from '@/lib/types';

/**
 * User Reports API Functions
 * Allows users to report violations and inappropriate behavior
 */

// ============================================
// USER REPORT SUBMISSION
// ============================================

export interface SubmitReportPayload {
  reportedUserId: string;
  tripId?: string;
  reason: string;
  description: string;
  evidence?: string;
}

export interface ReportStats {
  totalReports: number;
  pendingReports: number;
  reviewedReports: number;
  resolvedReports: number;
}

/**
 * Submit a report against a user for violations
 */
export async function submitReport(reportData: SubmitReportPayload): Promise<Report> {
  try {
    const response = await apiClient.post('/api/reports/', reportData);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error submitting report:', error);
    throw error;
  }
}

/**
 * Get report statistics (for display purposes)
 */
export async function getReportStats(): Promise<ReportStats> {
  try {
    const response = await apiClient.get('/api/reports/admin/stats');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching report stats:', error);
    throw error;
  }
}

/**
 * Get report by ID
 */
export async function getReportById(reportId: string): Promise<Report> {
  try {
    const response = await apiClient.get(`/api/reports/admin/${reportId}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching report:', error);
    throw error;
  }
}

/**
 * Get all reports for a specific user
 */
export interface ReportsResponse {
  success: boolean;
  data: Report[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export async function getReportsForUser(userId: string, page = 1, limit = 10): Promise<ReportsResponse> {
  try {
    const response = await apiClient.get(`/api/reports/admin/user/${userId}?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reports for user:', error);
    throw error;
  }
}

export async function getAllReports(status?: 'pending' | 'reviewed' | 'resolved', page = 1, limit = 10): Promise<ReportsResponse> {
  try {
    let url = `/api/reports/admin/all?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
}
