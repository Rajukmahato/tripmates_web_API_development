'use client';

import { useEffect, useState } from 'react';
import { Report } from '@/app/_types/common.types';
import { getReports, markReportAsReviewed, resolveReport, getReportStats } from '@/lib/api/admin/reports';
import { Button } from '@/app/_components/ui/button';
import { Card } from '@/app/_components/ui/card';
import { Badge } from '@/app/_components/ui/badge';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2 } from 'lucide-react';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'reviewed' | 'resolved'>('all');
  const [actioningReportId, setActioningReportId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ pending: 0, reviewed: 0, resolved: 0 });
  const limit = 10;

  useEffect(() => {
    fetchReports();
    fetchStats();
  }, [page, statusFilter]);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const status = statusFilter === 'all' ? undefined : (statusFilter as 'pending' | 'reviewed' | 'resolved');
      const data = await getReports(status, page, limit);
      setReports(Array.isArray(data?.data) ? data.data : []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      toast.error('Failed to load reports');
      console.error('Error:', error);
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getReportStats();
      setStats({
        pending: data.pendingReports || 0,
        reviewed: data.reviewedReports || 0,
        resolved: data.resolvedReports || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleMarkReviewed = async (reportId: string) => {
    setActioningReportId(reportId);
    try {
      const updated = await markReportAsReviewed(reportId);
      setReports((prev) =>
        prev.map((r) => (r._id === reportId ? updated : r))
      );
      fetchStats();
      toast.success('Report marked as reviewed');
    } catch (error) {
      toast.error('Failed to update report');
      console.error('Error:', error);
    } finally {
      setActioningReportId(null);
    }
  };

  const handleResolve = async (reportId: string) => {
    setActioningReportId(reportId);
    try {
      const updated = await resolveReport(reportId);
      setReports((prev) =>
        prev.map((r) => (r._id === reportId ? updated : r))
      );
      fetchStats();
      toast.success('Report resolved');
    } catch (error) {
      toast.error('Failed to resolve report');
      console.error('Error:', error);
    } finally {
      setActioningReportId(null);
    }
  };

  // API already filters by status, so we can use reports directly

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-muted dark:from-background dark:to-slate-900">
      <div className="container-max section-padding">
        <div className="mb-8 animate-slideInUp">
          <h1 className="text-4xl font-bold mb-2">
            Reports & Complaints
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage user reports and complaints
          </p>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Reviewed</p>
          <p className="text-3xl font-bold text-blue-600">{stats.reviewed}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Resolved</p>
          <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <Button
          onClick={() => { setStatusFilter('all'); setPage(1); }}
          variant={statusFilter === 'all' ? 'default' : 'outline'}
          size="sm"
        >
          All
        </Button>
        <Button
          onClick={() => { setStatusFilter('pending'); setPage(1); }}
          variant={statusFilter === 'pending' ? 'default' : 'outline'}
          size="sm"
        >
          Pending
        </Button>
        <Button
          onClick={() => { setStatusFilter('reviewed'); setPage(1); }}
          variant={statusFilter === 'reviewed' ? 'default' : 'outline'}
          size="sm"
        >
          Reviewed
        </Button>
        <Button
          onClick={() => { setStatusFilter('resolved'); setPage(1); }}
          variant={statusFilter === 'resolved' ? 'default' : 'outline'}
          size="sm"
        >
          Resolved
        </Button>
      </div>

      {/* Reports Table */}
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Loading reports...
          </div>
        ) : reports.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No reports found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Reporter
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Reported User
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Status
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
                {reports.map((report) => (
                  <tr key={report._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {report.reporter.fullName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {report.reportedUser.fullName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      <div>
                        <p className="font-medium">{report.reason}</p>
                        {report.description && (
                          <p className="text-xs mt-1 text-gray-500">
                            {report.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Badge className={`${getStatusColor(report.status)}`}>
                        {report.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {formatDistanceToNow(new Date(report.createdAt), {
                        addSuffix: true,
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      {report.status === 'pending' && (
                        <>
                          <Button
                            onClick={() => handleMarkReviewed(report._id)}
                            disabled={actioningReportId === report._id}
                            size="sm"
                            variant="outline"
                          >
                            {actioningReportId === report._id
                              ? 'Processing...'
                              : 'Mark Reviewed'}
                          </Button>
                          <Button
                            onClick={() => handleResolve(report._id)}
                            disabled={actioningReportId === report._id}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {actioningReportId === report._id
                              ? 'Processing...'
                              : 'Resolve'}
                          </Button>
                        </>
                      )}
                      {report.status === 'reviewed' && (
                        <Button
                          onClick={() => handleResolve(report._id)}
                          disabled={actioningReportId === report._id}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {actioningReportId === report._id
                            ? 'Processing...'
                            : 'Resolve'}
                        </Button>
                      )}
                      {report.status === 'resolved' && (
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Resolved
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              <Button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isLoading}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  </div>
);
}
