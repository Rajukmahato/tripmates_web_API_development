import { apiClient } from '@/lib/api/axios';
import { Report } from '@/lib/types';

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

export interface ReportStats {
  totalReports: number;
  pendingReports: number;
  reviewedReports: number;
  resolvedReports: number;
  rejectedReports?: number;
}

export async function getReports(status?: 'pending' | 'reviewed' | 'resolved', page = 1, limit = 10): Promise<ReportsResponse> {
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

export async function getReportStats(): Promise<ReportStats> {
  try {
    const response = await apiClient.get('/api/reports/admin/stats');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching report stats:', error);
    throw error;
  }
}

export async function getReportById(reportId: string): Promise<Report> {
  try {
    const response = await apiClient.get(`/api/reports/admin/${reportId}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching report:', error);
    throw error;
  }
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

export async function markReportAsReviewed(reportId: string, adminNote?: string): Promise<Report> {
  try {
    const response = await apiClient.put(`/api/reports/admin/${reportId}/review`, {
      adminNote,
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error marking report as reviewed:', error);
    throw error;
  }
}

export async function resolveReport(reportId: string): Promise<Report> {
  try {
    const response = await apiClient.put(`/api/reports/admin/${reportId}/resolve`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error resolving report:', error);
    throw error;
  }
}
