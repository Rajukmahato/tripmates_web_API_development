"use client";

import { useEffect, useState, useCallback } from "react";
import { getAllTrips, deleteTrip } from "@/lib/api/admin/trips";
import { Trip } from "@/lib/api/trips";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import Link from "next/link";
import { MapPin, Calendar, DollarSign, Users, Trash2 } from "lucide-react";

export default function AdminTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const limit = 10;

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAllTrips(page, limit);
      setTrips(response.data);
      
      if (response.pagination) {
        setTotalPages(response.pagination.pages);
        setTotal(response.pagination.total);
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message || "Failed to fetch trips. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchTrips();
  }, [page, fetchTrips]);

  const handleDelete = async (tripId: string) => {
    if (!confirm("Are you sure you want to delete this trip? This action cannot be undone.")) {
      return;
    }

    setDeletingId(tripId);

    try {
      await deleteTrip(tripId);
      setTrips(trips.filter((trip) => trip._id !== tripId));
      setTotal((prev) => prev - 1);
      alert("Trip deleted successfully");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || "Failed to delete trip");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && trips.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading size="lg" text="Loading trips..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
            Trips Management
          </h1>
          <p className="mt-2 text-muted-foreground text-base">
            Manage all trips in the system ({total} total)
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 animate-slideInDown">
            <p className="text-sm text-red-800 dark:text-red-300 font-medium">
              {error}
            </p>
          </div>
        )}

        {/* Trips List */}
        {trips.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-lg font-semibold text-foreground">No trips found</p>
            <p className="mt-2 text-muted-foreground">
              Trips created by users will appear here
            </p>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {trips.map((trip) => (
                <Card key={trip._id} className="overflow-hidden">
                  <div className="flex flex-col">
                    {/* Trip Info */}
                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex-1">
                          <Link
                            href={`/user/trips/${trip._id}`}
                            className="text-2xl font-bold hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            {trip.destination}
                          </Link>
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {trip.description || "No description provided"}
                          </p>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(trip._id)}
                          disabled={deletingId === trip._id}
                          className="ml-4 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          {deletingId === trip._id ? (
                            "Deleting..."
                          ) : (
                            <>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Destination</p>
                            <p className="font-medium">{trip.destination}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Duration</p>
                            <p className="font-medium">
                              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Budget</p>
                            <p className="font-medium text-blue-600">
                              ₹{trip.budget.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Group Size</p>
                            <p className="font-medium">
                              Max: {trip.groupSize}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                        <span>Status: <span className="capitalize font-medium text-foreground">{trip.status}</span></span>
                        <span>•</span>
                        <span>Created: {formatDate(trip.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Page {page} of {totalPages}
                  </span>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
