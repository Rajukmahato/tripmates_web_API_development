"use client";

import { useEffect, useState } from "react";
import { getAllTrips, Trip, TripsListResponse } from "@/lib/api/trips";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import Link from "next/link";
import Image from "next/image";

export default function UserTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 6;

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      setError("");

      try {
        const response: TripsListResponse = await getAllTrips(page, limit);
        setTrips(response.data);
        if (response.pagination) {
          setTotalPages(response.pagination.pages);
          setTotal(response.pagination.total);
        }
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || "Failed to fetch trips");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [page]);

  if (loading && trips.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading size="lg" text="Loading trips..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Available Trips</h1>
          <p className="mt-2 text-muted-foreground">
            Find and join exciting trips with fellow travelers ({total} trips available)
          </p>
        </div>
        <Link href="/user/trips/create">
          <Button>Create Trip</Button>
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Trips Grid */}
      {trips.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-lg font-medium text-muted-foreground">No trips available</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Be the first to create a trip!
          </p>
          <Link href="/user/trips/create">
            <Button className="mt-4">Create First Trip</Button>
          </Link>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <Card key={trip._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {trip.image && (
                  <div className="relative h-48 w-full bg-muted">
                    <Image
                      src={trip.image}
                      alt={trip.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold line-clamp-1">{trip.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {trip.description}
                  </p>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">📍 Destination:</span>
                      <span className="font-medium">{trip.destination}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">💰 Budget:</span>
                      <span className="font-medium">${trip.budget}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">👥 Members:</span>
                      <span className="font-medium">
                        {trip.currentMembers}/{trip.maxMembers}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">📅 Dates:</span>
                      <span className="font-medium text-xs">
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <Link href={`/user/trips/${trip._id}`} className="block mt-4">
                    <Button className="w-full" variant="outline">
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between border-t pt-4">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || loading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
