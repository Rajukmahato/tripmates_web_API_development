"use client";

import { useEffect, useState } from "react";
import {
  getSentRequests,
  cancelRequest,
  PartnerRequest,
} from "@/lib/api/partner-requests";
import { RequestCard } from "@/app/user/requests/_components/RequestCard";
import { Card } from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import { Loading } from "@/app/_components/ui/loading";
import Link from "next/link";
import { Send } from "lucide-react";

export default function SentRequestsPage() {
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
      const response = await getSentRequests(page, limit);
      setRequests(response.data);
      
      if (response.pagination) {
        setTotalPages(response.pagination.pages);
        setTotal(response.pagination.total);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Failed to fetch sent requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleCancel = async (requestId: string) => {
    try {
      await cancelRequest(requestId);
      alert("Request cancelled successfully");
      fetchRequests(); // Refresh the list
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || "Failed to cancel request");
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
    <div className="min-h-screen bg-gradient-to-b from-white to-muted dark:from-background dark:to-slate-900">
      <div className="container-max section-padding">
        {/* Header Section */}
        <div className="mb-8 animate-slideInUp">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Sent Requests</h1>
              <p className="text-lg text-muted-foreground">
                Track your requests to join trips
              </p>
            </div>
            
            <Link href="/user/requests/received">
              <Button variant="outline" size="lg" className="w-full md:w-auto">
                View Received Requests
              </Button>
            </Link>
          </div>

          {/* Tabs */}
          <div className="mt-8 flex gap-2 border-b border-border">
            <Link href="/user/requests/received">
              <button className="px-6 py-3 font-semibold text-muted-foreground hover:text-foreground transition-colors">
                Received
              </button>
            </Link>
            <Link href="/user/requests/sent">
              <button className="border-b-2 border-primary px-6 py-3 font-semibold text-primary transition-colors">
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
                <Send className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                No requests sent
              </h3>
              <p className="mt-2 text-muted-foreground">
                Find trips that interest you and send join requests
              </p>
              <Link href="/user/trips">
                <Button className="mt-6">Explore Trips</Button>
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
                  type="sent"
                  onCancel={handleCancel}
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
