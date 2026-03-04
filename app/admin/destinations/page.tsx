"use client";

import { useEffect, useState, useCallback } from "react";
import { getDestinations, Destination } from "@/lib/api/destinations";
import { Button } from "@/app/_components/ui/button";
import { Card } from "@/app/_components/ui/card";
import { Loading } from "@/app/_components/ui/loading";
import { Badge } from "@/app/_components/ui/badge";
import { MapPin, Search, Plus, Edit, Eye } from "lucide-react";
import { Input } from "@/app/_components/ui/input";
import { getMediaUrl } from "@/app/_utils/cn";
import Link from "next/link";
import Image from "next/image";

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);

  const fetchDestinations = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getDestinations(1, 1000, true); // Include inactive for admin
      if (response.success && response.data) {
        setDestinations(response.data);
        setFilteredDestinations(response.data);
      }
    } catch (err) {
      setError("Failed to fetch destinations. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDestinations(destinations);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = destinations.filter(
      (dest) =>
        dest.name.toLowerCase().includes(term) ||
        dest.country.toLowerCase().includes(term) ||
        dest.description?.toLowerCase().includes(term)
    );
    setFilteredDestinations(filtered);
  }, [searchTerm, destinations]);

  if (loading && destinations.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading size="lg" text="Loading destinations..." />
      </div>
    );
  }

  const activeCount = destinations.filter((d) => d.isActive).length;
  const inactiveCount = destinations.length - activeCount;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-muted dark:from-background dark:to-slate-900">
      <div className="container-max section-padding">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-slideInUp">
          <div>
            <h1 className="text-4xl font-bold mb-2">Destinations</h1>
            <p className="text-lg text-muted-foreground">
              Manage travel destinations
            </p>
          </div>
          <Link href="/admin/destinations/create">
            <Button size="lg" className="w-full md:w-auto bg-primary hover:bg-primary-hover text-black">
              <Plus className="mr-2 h-4 w-4" />
              Add Destination
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8 animate-slideInUp" style={{ animationDelay: "0.1s" }}>
          <Card className="p-6 card-base">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Destinations</p>
                <p className="text-3xl font-bold mt-1">{destinations.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 card-base">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-3xl font-bold mt-1 text-green-600">{activeCount}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 card-base">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inactive</p>
                <p className="text-3xl font-bold mt-1 text-orange-600">{inactiveCount}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-6 animate-slideInUp" style={{ animationDelay: "0.2s" }}>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 animate-slideInDown">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Destinations Table/Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loading />
          </div>
        ) : filteredDestinations.length > 0 ? (
          <Card className="overflow-hidden card-base animate-slideInUp" style={{ animationDelay: "0.3s" }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left p-4 font-semibold">Destination</th>
                    <th className="text-left p-4 font-semibold">Country</th>
                    <th className="text-left p-4 font-semibold hidden md:table-cell">Attractions</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-left p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDestinations.map((destination) => (
                    <tr
                      key={destination._id}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {destination.coverImage ? (
                            <div className="relative h-12 w-12 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={getMediaUrl(destination.coverImage) || destination.coverImage}
                                alt={destination.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <MapPin className="h-6 w-6 text-primary/50" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{destination.name}</p>
                            {destination.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {destination.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{destination.country}</span>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {destination.attractions?.length || 0}
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge variant={destination.isActive ? "success" : "default"}>
                          {destination.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/destinations/${destination._id}`}>
                            <Button variant="ghost" size="sm" title="View">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/destinations/${destination._id}/edit`}>
                            <Button variant="ghost" size="sm" title="Edit">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Card className="p-12 text-center card-base animate-slideInUp" style={{ animationDelay: "0.3s" }}>
            <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold mb-2">No destinations found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Get started by creating your first destination"}
            </p>
            {!searchTerm && (
              <Link href="/admin/destinations/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Destination
                </Button>
              </Link>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
