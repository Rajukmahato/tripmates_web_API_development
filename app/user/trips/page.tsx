"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getAllTrips, Trip, TripsListResponse } from "@/lib/api/trips";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/ui/loading";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Search, Filter, X } from "lucide-react";

export default function UserTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);

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

  // Apply filters
  useEffect(() => {
    let filtered = trips;

    // Search by destination
    if (searchQuery) {
      filtered = filtered.filter(
        (trip) =>
          trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by start date
    if (startDate) {
      filtered = filtered.filter(
        (trip) => new Date(trip.startDate) >= new Date(startDate)
      );
    }

    // Filter by end date
    if (endDate) {
      filtered = filtered.filter(
        (trip) => new Date(trip.endDate) <= new Date(endDate)
      );
    }

    // Filter by budget range
    if (minBudget) {
      filtered = filtered.filter(
        (trip) => trip.budget >= Number(minBudget)
      );
    }

    if (maxBudget) {
      filtered = filtered.filter(
        (trip) => trip.budget <= Number(maxBudget)
      );
    }

    setFilteredTrips(filtered);
  }, [trips, searchQuery, startDate, endDate, minBudget, maxBudget]);

  const clearFilters = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setMinBudget("");
    setMaxBudget("");
  };

  const hasActiveFilters = searchQuery || startDate || endDate || minBudget || maxBudget;
  const displayTrips = hasActiveFilters ? filteredTrips : trips;

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
        <div className="mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
              Trips
            </h1>
            <p className="mt-2 text-muted-foreground text-base">
              Discover and join amazing trips ({total} available)
            </p>
          </div>
          <Link href="/user/trips/create">
            <Button size="lg">
              Create Trip
            </Button>
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 animate-slideInDown">
            <p className="text-sm text-red-800 dark:text-red-300 font-medium">{error}</p>
          </div>
        )}

        {/* Search and Filters */}
        <Card className="mb-6 p-4">
          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="default" className="ml-1">
                  {[searchQuery, startDate, endDate, minBudget, maxBudget].filter(Boolean).length}
                </Badge>
              )}
            </Button>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 grid gap-4 border-t pt-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">End Date</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Min Budget (₹)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={minBudget}
                  onChange={(e) => setMinBudget(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Max Budget (₹)</label>
                <Input
                  type="number"
                  placeholder="100000"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap gap-2">
              {searchQuery && (
                <Badge variant="info" className="flex items-center gap-1">
                  Search: {searchQuery}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSearchQuery("")}
                  />
                </Badge>
              )}
              {startDate && (
                <Badge variant="info" className="flex items-center gap-1">
                  From: {new Date(startDate).toLocaleDateString()}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setStartDate("")}
                  />
                </Badge>
              )}
              {endDate && (
                <Badge variant="info" className="flex items-center gap-1">
                  To: {new Date(endDate).toLocaleDateString()}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setEndDate("")}
                  />
                </Badge>
              )}
              {minBudget && (
                <Badge variant="info" className="flex items-center gap-1">
                  Min: ₹{Number(minBudget).toLocaleString()}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setMinBudget("")}
                  />
                </Badge>
              )}
              {maxBudget && (
                <Badge variant="info" className="flex items-center gap-1">
                  Max: ₹{Number(maxBudget).toLocaleString()}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setMaxBudget("")}
                  />
                </Badge>
              )}
            </div>
          )}
        </Card>

        {/* Trips Grid */}
        {displayTrips.length === 0 ? (
          <Card variant="gradient" className="p-12 text-center">
            <p className="text-lg font-semibold text-foreground">
              {hasActiveFilters ? "No trips match your filters" : "No trips yet"}
            </p>
            <p className="mt-2 text-muted-foreground">
              {hasActiveFilters
                ? "Try adjusting your search or filters"
                : "Create your first trip to get started"}
            </p>
            {hasActiveFilters ? (
              <Button size="lg" className="mt-6" onClick={clearFilters}>
                Clear Filters
              </Button>
            ) : (
              <Link href="/user/trips/create">
                <Button size="lg" className="mt-6">
                  Create First Trip
                </Button>
              </Link>
            )}
          </Card>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayTrips.map((trip) => (
                <div
                  key={trip._id}
                  className="group animate-slideInUp hover:scale-102 transition-transform duration-300"
                >
                  <Card variant="elevated" className="h-full overflow-hidden cursor-pointer">
                    <div>
                      <h3 className="text-lg font-bold text-foreground line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                        {trip.destination}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                        {trip.description || "No description provided"}
                      </p>

                      <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">📍 Destination</span>
                          <span className="font-semibold text-foreground">{trip.destination}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">💰 Budget</span>
                          <span className="font-semibold text-blue-600">₹{trip.budget?.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">🎒 Travel Type</span>
                          <Badge variant="info" size="sm" className="capitalize">
                            {trip.travelType}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">📅 Duration</span>
                          <span className="font-semibold text-foreground text-xs">
                            {new Date(trip.startDate).toLocaleDateString()} -{" "}
                            {new Date(trip.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">👥 Group Size</span>
                            <Badge variant="primary" size="sm">
                              Max: {trip.groupSize}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <Link href={`/user/trips/${trip._id}`} className="block">
                        <Button
                          fullWidth
                          className="group/btn"
                        >
                          View Details
                          <span className="transition-transform group-hover/btn:translate-x-1">→</span>
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t pt-6 gap-4">
                <p className="text-sm text-muted-foreground font-medium">
                  Page <span className="font-bold text-foreground">{page}</span> of <span className="font-bold text-foreground">{totalPages}</span>
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || loading}
                  >
                    ← Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || loading}
                  >
                    Next →
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
