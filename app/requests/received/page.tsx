"use client";

import { useEffect, useState } from "react";
import {
  getReceivedRequests,
  acceptRequest,
  rejectRequest,
  PartnerRequest,
} from "@/lib/api/partner-requests";
import { RequestCard } from "@/components/requests/RequestCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import Link from "next/link";
import { Inbox } from "lucide-react";

export default function ReceivedRequestsPage() {
  const [requests, setRequests] = useState<PartnerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 10;

  const fetchRequests = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getReceivedRequests(page, limit);
      setRequests(response.data);
      
      if (response.pagination) {
        setTotalPages(response.pagination.pages);
        setTotal(response.pagination.total);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Failed to fetch received requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleAccept = async (requestId: string) => {
    try {
      await acceptRequest(requestId);
      alert("Request accepted successfully!");
      fetchRequests(); // Refresh the list
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || "Failed to accept request");
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await rejectRequest(requestId);
      alert("Request rejected");
      fetchRequests(); // Refresh the list
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || "Failed to reject request");
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading && requests.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading size="lg" text="Loading requests..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                Received Requests
              </h1>
              <p className="mt-2 text-muted-foreground">
                Manage requests from travelers who want to join your trips ({total} total)
              </p>
            </div>
            
            <Link href="/requests/sent">
              <Button variant="outline">View Sent Requests</Button>
            </Link>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex gap-2 border-b border-gray-200 dark:border-gray-800">
            <Link href="/requests/received">
              <button className="border-b-2 border-blue-600 px-4 py-2 font-medium text-blue-600">
                Received
              </button>
            </Link>
            <Link href="/requests/sent">
              <button className="px-4 py-2 font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                Sent
              </button>
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-sm font-medium text-red-800 dark:text-red-300">
              {error}
            </p>
          </div>
        )}

        {/* Requests List */}
        {requests.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center">
              <div className="mb-4 rounded-full bg-gray-100 p-6 dark:bg-gray-800">
                <Inbox className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                No requests received
              </h3>
              <p className="mt-2 text-muted-foreground">
                When travelers request to join your trips, they will appear here
              </p>
              <Link href="/user/trips">
                <Button className="mt-6">Browse Trips</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <>
            <div className="space-y-6">
              {requests.map((request) => (
                <RequestCard
                  key={request._id}
                  request={request}
                  type="received"
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1 || loading}
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "outline"}
                        onClick={() => handlePageChange(pageNum)}
                        disabled={loading}
                        size="sm"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages || loading}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
