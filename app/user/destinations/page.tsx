"use client";

import { useEffect, useState } from "react";
import { getDestinations, searchDestinations, Destination } from "@/lib/api/destinations";
import { Card } from "@/app/_components/ui/card";
import { Input } from "@/app/_components/ui/input";
import { Loading } from "@/app/_components/ui/loading";
import { getMediaUrl } from "@/app/_utils/cn";
import { Search, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await getDestinations(1, 100, false);
      if (response.success && response.data) {
        setDestinations(response.data);
      }
    } catch (err) {
      setError("Failed to load destinations");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      fetchDestinations();
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const response = await searchDestinations(term, 1, 100);
      if (response.success && response.data) {
        setDestinations(response.data);
      }
    } catch (err) {
      setError("Failed to search destinations");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-muted dark:from-background dark:to-slate-900">
      <div className="container-max section-padding">
        {/* Header */}
        <div className="mb-8 animate-slideInUp">
          <h1 className="text-4xl font-bold mb-2">Explore Destinations</h1>
          <p className="text-lg text-muted-foreground">
            Discover amazing places for your next adventure
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl animate-slideInUp" style={{ animationDelay: "0.1s" }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search destinations by name or country..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loading />
          </div>
        )}

        {/* Destinations Grid */}
        {!isLoading && destinations.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {destinations.map((destination, index) => (
              <Link
                key={destination._id}
                href={`/user/destinations/${destination._id}`}
                className="animate-slideInUp"
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                <Card className="h-full overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer card-base">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-purple-600/10">
                    {destination.coverImage ? (
                        <Image
                          src={getMediaUrl(destination.coverImage) || destination.coverImage}
                        alt={destination.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MapPin className="h-16 w-16 text-primary/30" />
                      </div>
                    )}
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                      {destination.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {destination.country}
                    </p>

                    {destination.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {destination.description}
                      </p>
                    )}

                    {/* Attractions Count */}
                    {destination.attractions && destination.attractions.length > 0 && (
                      <div className="mt-3 text-xs text-primary font-medium">
                        {destination.attractions.length} attraction{destination.attractions.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && destinations.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold mb-2">No destinations found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "Try adjusting your search terms" : "No destinations available at the moment"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
