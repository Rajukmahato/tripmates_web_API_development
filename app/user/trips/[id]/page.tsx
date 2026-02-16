"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getTripById, joinTrip, leaveTrip, Trip } from "@/lib/api/trips";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import Image from "next/image";

export default function TripDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id as string;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getTripById(tripId);
        setTrip(response.data);
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || "Failed to fetch trip details");
      } finally {
        setLoading(false);
      }
    };

    if (tripId) {
      fetchTrip();
    }
  }, [tripId]);

  const handleJoinTrip = async () => {
    setActionLoading(true);

    try {
      await joinTrip(tripId);
      setJoined(true);
      alert("Successfully joined trip!");
      router.refresh();
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || "Failed to join trip");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveTrip = async () => {
    if (!confirm("Are you sure you want to leave this trip?")) return;

    setActionLoading(true);

    try {
      await leaveTrip(tripId);
      setJoined(false);
      alert("You have left the trip successfully");
      router.refresh();
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || "Failed to leave trip");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading size="lg" text="Loading trip details..." />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <Card className="p-6">
          <div className="text-center">
            <p className="text-lg font-medium text-red-500">{error || "Trip not found"}</p>
            <Link href="/user/trips">
              <Button className="mt-4">Back to Trips</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <Link href="/user/trips">
        <Button variant="outline" className="mb-6">
          ← Back to Trips
        </Button>
      </Link>

      <Card className="overflow-hidden">
        {trip.image && (
          <div className="relative h-96 w-full bg-muted">
            <Image
              src={trip.image}
              alt={trip.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="p-6">
          <h1 className="text-4xl font-bold mb-2">{trip.title}</h1>
          <p className="text-muted-foreground mb-6">{trip.description}</p>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Destination</label>
                <p className="mt-1 text-lg">📍 {trip.destination}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Trip Dates</label>
                <p className="mt-1 text-lg">
                  📅 {new Date(trip.startDate).toLocaleDateString()} to {new Date(trip.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Budget</label>
                <p className="mt-1 text-lg">💰 ${trip.budget}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Participants</label>
                <div className="mt-2 flex items-center gap-2">
                  <div className="text-lg font-medium">{trip.currentMembers}/{trip.maxMembers}</div>
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600"
                      style={{ width: `${(trip.currentMembers / trip.maxMembers) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 border-t pt-6">
            {joined ? (
              <Button
                variant="outline"
                onClick={handleLeaveTrip}
                disabled={actionLoading}
                className="text-red-600 hover:text-red-700"
              >
                {actionLoading ? "Leaving..." : "Leave Trip"}
              </Button>
            ) : (
              <Button
                onClick={handleJoinTrip}
                disabled={actionLoading || trip.currentMembers >= trip.maxMembers}
              >
                {actionLoading ? "Joining..." : "Join Trip"}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
