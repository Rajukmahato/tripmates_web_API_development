"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDestinationById, Destination } from "@/lib/api/destinations";
import { searchTrips } from "@/lib/api/trips";
import { Trip } from "@/app/_types/common.types";
import { Card } from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import { Loading } from "@/app/_components/ui/loading";
import { Badge } from "@/app/_components/ui/badge";
import { getMediaUrl } from "@/app/_utils/cn";
import { ArrowLeft, MapPin, Calendar, Lightbulb, Star, Users, DollarSign } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/app/_utils/date";

export default function DestinationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const destinationId = params.id as string;

  const [destination, setDestination] = useState<Destination | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTrips, setIsLoadingTrips] = useState(false);
  const [error, setError] = useState("");

  const fetchDestination = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await getDestinationById(destinationId);
      if (response.success && response.data) {
        setDestination(response.data);
        // Fetch trips for this destination
        fetchTripsForDestination(response.data.name);
      }
    } catch (err) {
      setError("Failed to load destination details");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [destinationId]);

  const fetchTripsForDestination = async (destinationName: string) => {
    setIsLoadingTrips(true);
    try {
      const response = await searchTrips({ 
        destination: destinationName, 
        limit: 6 
      });
      if (response.success && response.data) {
        setTrips(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch trips:", err);
    } finally {
      setIsLoadingTrips(false);
    }
  };

  useEffect(() => {
    if (destinationId) {
      fetchDestination();
    }
  }, [destinationId, fetchDestination]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-muted dark:from-background dark:to-slate-900">
        <div className="container-max section-padding">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Destination Not Found</h2>
            <p className="text-muted-foreground mb-6">{error || "The destination you're looking for doesn't exist."}</p>
            <Link href="/destinations">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Destinations
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-muted dark:from-background dark:to-slate-900">
      <div className="container-max section-padding">
        {/* Back Button */}
        <div className="mb-6 animate-slideInUp">
          <Link
            href="/destinations"
            className="inline-flex items-center text-sm text-primary hover:text-primary-dark dark:text-primary dark:hover:text-primary-light"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Destinations
          </Link>
        </div>

        {/* Header with Image */}
        <div className="mb-8 animate-slideInUp" style={{ animationDelay: "0.1s" }}>
          {destination.coverImage && (
            <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-6 shadow-lg">
              <Image
                src={getMediaUrl(destination.coverImage) || destination.coverImage}
                alt={destination.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{destination.name}</h1>
                <p className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {destination.country}
                </p>
              </div>
            </div>
          )}

          {!destination.coverImage && (
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{destination.name}</h1>
              <p className="text-lg text-muted-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {destination.country}
              </p>
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {destination.description && (
              <Card className="p-6 card-base animate-slideInUp" style={{ animationDelay: "0.2s" }}>
                <h2 className="text-2xl font-semibold mb-4">About</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {destination.description}
                </p>
              </Card>
            )}

            {/* Attractions */}
            {destination.attractions && destination.attractions.length > 0 && (
              <Card className="p-6 card-base animate-slideInUp" style={{ animationDelay: "0.3s" }}>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Star className="h-6 w-6 text-primary" />
                  Top Attractions
                </h2>
                <ul className="space-y-2">
                  {destination.attractions.map((attraction, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-muted-foreground">{attraction}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Travel Tips */}
            {destination.travelTips && destination.travelTips.length > 0 && (
              <Card className="p-6 card-base animate-slideInUp" style={{ animationDelay: "0.4s" }}>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-primary" />
                  Travel Tips
                </h2>
                <ul className="space-y-3">
                  {destination.travelTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-primary/5">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Best Time to Visit */}
            {destination.bestTimeToVisit && (
              <Card className="p-6 card-base animate-slideInUp" style={{ animationDelay: "0.2s" }}>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Best Time to Visit
                </h3>
                <p className="text-muted-foreground">{destination.bestTimeToVisit}</p>
              </Card>
            )}

            {/* Plan Your Trip */}
            <Card className="p-6 card-base animate-slideInUp" style={{ animationDelay: "0.3s" }}>
              <h3 className="text-lg font-semibold mb-4">Plan Your Trip</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Ready to explore {destination.name}? Create a trip and find travel companions!
              </p>
              <Button 
                className="w-full"
                onClick={() => router.push("/user/trips/create")}
              >
                Create a Trip
              </Button>
            </Card>

        {/* Trips Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Trips to {destination.name}</h2>
            <Button 
              variant="outline" 
              onClick={() => router.push(`/user/trips/create?destination=${encodeURIComponent(destination.name)}`)}
            >
              Plan a Trip
            </Button>
          </div>

          {isLoadingTrips && (
            <div className="flex justify-center py-12">
              <Loading />
            </div>
          )}

          {!isLoadingTrips && trips.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trips.map((trip, index) => (
                <Link
                  key={trip._id}
                  href={`/user/trips/${trip._id}`}
                  className="animate-slideInUp"
                  style={{ animationDelay: `${0.05 * index}s` }}
                >
                  <Card className="h-full overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer card-base">
                    {/* Image */}
                    {trip.image && (
                      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary/10 to-purple-600/10">
                        <Image
                          src={trip.image}
                          alt={trip.destination}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-1">
                          {trip.destination}
                        </h3>
                        <Badge variant={trip.status === 'open' ? 'success' : 'default'}>
                          {trip.status}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {trip.description}
                      </p>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(trip.startDate)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            <span>₹{trip.budget.toLocaleString()}</span>
                          </div>
                          {trip.groupSize && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>{trip.groupSize}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {!isLoadingTrips && trips.length === 0 && (
            <Card className="p-12 text-center card-base">
              <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-semibold mb-2">No trips yet</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to plan a trip to {destination.name}!
              </p>
              <Button onClick={() => router.push(`/user/trips/create?destination=${encodeURIComponent(destination.name)}`)}>
                Create a Trip
              </Button>
            </Card>
          )}
        </div>

            {/* Info Card */}
            <Card className="p-6 card-base bg-gradient-to-br from-primary/5 to-purple-600/5 animate-slideInUp" style={{ animationDelay: "0.4s" }}>
              <h3 className="text-lg font-semibold mb-3">Quick Facts</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">{destination.country}</span>
                </div>
                {destination.attractions && destination.attractions.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Attractions:</span>
                    <span className="font-medium">{destination.attractions.length}</span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
