'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { ReviewForm } from '@/app/user/reviews/_components/ReviewForm';
import { Button } from '@/app/_components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api/axios';

function SubmitReviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const revieweeId = searchParams.get('revieweeId');
  const tripId = searchParams.get('tripId');
  const [revieweeData, setRevieweeData] = useState<{ fullName: string } | null>(null);
  const [tripData, setTripData] = useState<{ destination: string } | null>(null);

  useEffect(() => {
    if (!revieweeId || !tripId) {
      router.push('/user/trips');
      return;
    }

    // Fetch reviewee data
    apiClient
      .get(`/api/users/${revieweeId}`)
      .then((res) => {
        setRevieweeData(res.data.data || res.data);
      })
      .catch((err) => console.error('Failed to fetch reviewee:', err));

    // Fetch trip data
    apiClient
      .get(`/api/trips/${tripId}`)
      .then((res) => {
        setTripData(res.data.data || res.data);
      })
      .catch((err) => console.error('Failed to fetch trip:', err));
  }, [revieweeId, tripId, router]);

  if (!revieweeId || !tripId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-muted dark:from-background dark:to-slate-900">
      <div className="container-max section-padding">
        {/* Header */}
        <div className="mb-8 animate-slideInUp">
          <Link href="/user/trips">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Trips
            </Button>
          </Link>
          
          <h1 className="text-4xl font-bold mb-2">
            Leave a Review
          </h1>
          <p className="text-lg text-muted-foreground">
            Share your experience with {revieweeData?.fullName}
          </p>
        </div>

        {/* Trip and Reviewee Info */}
        {tripData && revieweeData && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Trip</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {tripData.destination}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Reviewing</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {revieweeData.fullName}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Review Form */}
        <ReviewForm
          revieweeId={revieweeId}
          tripId={tripId}
          onSuccess={() => router.push('/user/trips')}
        />
      </div>
    </div>
  );
}

export default function SubmitReviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SubmitReviewContent />
    </Suspense>
  );
}
