"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getTripById, Trip } from "@/lib/api/trips";
import { sendJoinRequest } from "@/lib/api/partner-requests";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { Input } from "@/components/ui/input";

export default function TripDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id as string;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");

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

  const handleSendRequest = async () => {
    setActionLoading(true);

    try {
      await sendJoinRequest(tripId, requestMessage);
      alert("Request sent successfully! The trip owner will review your request.");
      setShowRequestModal(false);
      setRequestMessage("");
      router.push("/requests/sent");
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || "Failed to send request");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 animate-fadeIn">
      <div className="max-w-4xl mx-auto">
        <Link href="/user/trips">
          <Button variant="ghost" className="mb-6">
            Back to Trips
          </Button>
        </Link>

        <Card variant="elevated" className="overflow-hidden">
          <div className="p-8">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-foreground mb-2">{trip.destination}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">{trip.description || "No description provided"}</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 mb-8">
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                  <label className="text-sm font-semibold text-muted-foreground block mb-2">
                    📍 Destination
                  </label>
                  <p className="text-lg font-bold text-foreground">{trip.destination}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                  <label className="text-sm font-semibold text-muted-foreground block mb-2">
                    🎒 Travel Type
                  </label>
                  <Badge variant="info" size="lg" className="capitalize">
                    {trip.travelType}
                  </Badge>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                  <label className="text-sm font-semibold text-muted-foreground block mb-2">
                    📅 Trip Dates
                  </label>
                  <p className="text-lg font-bold text-foreground">
                    {new Date(trip.startDate).toLocaleDateString()} to{" "}
                    {new Date(trip.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <label className="text-sm font-semibold text-muted-foreground block mb-2">
                    💰 Budget
                  </label>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    ₹{trip.budget?.toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                  <label className="text-sm font-semibold text-muted-foreground block mb-3">
                    👥 Group Size
                  </label>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="primary" size="lg">
                      Max: {trip.groupSize}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 border-t pt-6">
              <Button
                size="lg"
                onClick={() => setShowRequestModal(true)}
                disabled={actionLoading}
                className="flex-1"
              >
                {actionLoading ? "Sending..." : "Send Join Request"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Request Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="w-full max-w-md p-6">
              <h2 className="mb-4 text-2xl font-bold">Send Join Request</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Send a request to the trip owner. Include a message to introduce yourself!
              </p>
              
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">
                  Message (Optional)
                </label>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="Hi! I'm interested in joining your trip because..."
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                  maxLength={500}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {requestMessage.length}/500 characters
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSendRequest}
                  disabled={actionLoading}
                  className="flex-1"
                >
                  {actionLoading ? "Sending..." : "Send Request"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRequestModal(false);
                    setRequestMessage("");
                  }}
                  disabled={actionLoading}
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
