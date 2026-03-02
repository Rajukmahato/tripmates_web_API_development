"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTripSchema, CreateTripFormData } from "@/app/_schemas/trip.schema";
import { getTripById, updateTrip } from "@/lib/api/trips";
import { getDestinations } from "@/lib/api/destinations";
import { Destination } from "@/app/_types/common.types";
import { prepareTripDataForAPI, validateTripData } from "@/app/_utils/trip-helpers";
import { Card } from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Loading } from "@/app/_components/ui/loading";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

export default function EditTripPage() {
  const router = useRouter();
  const params = useParams();
  const tripId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [currentImage, setCurrentImage] = useState<string>("");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [useCustomDestination, setUseCustomDestination] = useState(false);
  const [currentDestinationId, setCurrentDestinationId] = useState<string>("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    details: false,
    activities: false,
    inclusions: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateTripFormData>({
    resolver: zodResolver(createTripSchema),
  });

  // Fetch destinations on mount
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoadingDestinations(true);
        const response = await getDestinations(1, 100, false);
        if (response.success && response.data) {
          setDestinations(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch destinations:", err);
        // If destinations fail to load, allow custom destination entry
        setUseCustomDestination(true);
      } finally {
        setLoadingDestinations(false);
      }
    };

    fetchDestinations();
  }, []);

  // Fetch trip data on mount
  useEffect(() => {
    const fetchTrip = async () => {
      setPageLoading(true);
      setError("");
      try {
        const response = await getTripById(tripId);
        const trip = response.data;

        // Set current image
        if (trip.image) {
          setCurrentImage(trip.image);
        }

        // Check if trip has a destinationId
        if (trip.destinationId) {
          setCurrentDestinationId(trip.destinationId);
          setValue("destinationId", trip.destinationId);
        } else {
          // If no destinationId, use custom destination input
          setUseCustomDestination(true);
        }

        // Populate form fields
        setValue("destination", trip.destination || "");
        setValue("startDate", trip.startDate ? trip.startDate.split("T")[0] : "");
        setValue("endDate", trip.endDate ? trip.endDate.split("T")[0] : "");
        setValue("budget", String(trip.budget || ""));
        setValue("groupSize", trip.groupSize ? String(trip.groupSize) : "");
        setValue("description", trip.description || "");
        setValue("travelType", trip.travelType || undefined);
        setValue("difficulty", trip.difficulty || undefined);
        setValue("distanceMin", trip.distanceMin !== undefined ? String(trip.distanceMin) : "");
        setValue("distanceMax", trip.distanceMax !== undefined ? String(trip.distanceMax) : "");
        setValue("durationMinHours", trip.durationMinHours !== undefined ? String(trip.durationMinHours) : "");
        setValue("durationMaxHours", trip.durationMaxHours !== undefined ? String(trip.durationMaxHours) : "");
        setValue("elevationMin", trip.elevationMin !== undefined ? String(trip.elevationMin) : "");
        setValue("elevationMax", trip.elevationMax !== undefined ? String(trip.elevationMax) : "");
        setValue("groupSizeMin", trip.groupSizeMin !== undefined ? String(trip.groupSizeMin) : "");
        setValue("groupSizeMax", trip.groupSizeMax !== undefined ? String(trip.groupSizeMax) : "");
        setValue("bestSeason", trip.bestSeason || undefined);
        setValue("activities", trip.activities?.join(", ") || "");
        setValue("highlights", trip.highlights?.join(", ") || "");
        setValue("guideIncluded", trip.guideIncluded || false);
        setValue("mealsIncluded", trip.mealsIncluded || false);
        setValue("accommodationType", trip.accommodationType?.join(", ") || "");
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to load trip";
        setError(errorMsg);
      } finally {
        setPageLoading(false);
      }
    };

    if (tripId) {
      fetchTrip();
    }
  }, [tripId, setValue]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      setImageFile(file);
      setError("");

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: CreateTripFormData) => {
    setIsLoading(true);
    setError("");

    try {
      // Prepare data with proper type conversions
      let tripData: any = prepareTripDataForAPI(data);

      // Validate trip data
      const validation = validateTripData(tripData);
      if (!validation.valid) {
        setError(validation.errors[0] || "Invalid trip data");
        setIsLoading(false);
        return;
      }

      // If there's a new image file, use FormData
      let submitData: any = tripData;
      if (imageFile) {
        const formData = new FormData();
        // Add all trip fields
        Object.keys(tripData).forEach((key) => {
          const value = tripData[key];
          // Skip null, undefined, and empty strings for optional fields
          if (value === null || value === undefined || value === "") {
            return;
          }
          if (Array.isArray(value)) {
            // For arrays, append each item separately
            value.forEach((item) => {
              if (item !== null && item !== undefined && item !== "") {
                formData.append(key, String(item));
              }
            });
          } else if (typeof value === 'boolean') {
            // Send booleans as lowercase strings for proper parsing
            formData.append(key, value ? 'true' : 'false');
          } else if (typeof value === 'number') {
            // Send numbers as their string representation
            formData.append(key, value.toString());
          } else {
            // For strings and other types
            formData.append(key, String(value));
          }
        });
        // Add image file
        formData.append("images", imageFile);
        submitData = formData;
      }

      const response = await updateTrip(tripId, submitData);

      if (response.success) {
        alert("Trip updated successfully!");
        router.push(`/user/trips/${tripId}`);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update trip";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading size="lg" text="Loading trip details..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-muted dark:from-background dark:to-slate-900">
      <div className="container-max section-padding">
        <div className="mb-8 animate-slideInUp">
          <Link
            href={`/user/trips/${tripId}`}
            className="inline-flex items-center text-sm text-primary hover:text-primary-dark dark:text-primary dark:hover:text-primary-light mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Trip
          </Link>
          <h1 className="text-4xl font-bold mb-2">Edit Trip</h1>
          <p className="text-lg text-muted-foreground">Update your trip details</p>
        </div>

        <Card className="p-6 card-base">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* ===== BASIC INFO SECTION ===== */}
            <div className="rounded-lg border border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => toggleSection("basic")}
                className="flex w-full items-center justify-between bg-gray-50 p-4 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <h2 className="font-semibold">Basic Information *</h2>
                {expandedSections.basic ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {expandedSections.basic && (
                <div className="space-y-4 p-4">
                  {/* Destination - Dropdown or Custom Input */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Destination *</label>
                    {!useCustomDestination ? (
                      <>
                        <select
                          {...register("destinationId")}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                          disabled={isLoading || loadingDestinations}
                          defaultValue={currentDestinationId}
                          onChange={(e) => {
                            const selectedDest = destinations.find(d => d._id === e.target.value);
                            if (selectedDest) {
                              setValue("destination", selectedDest.name);
                            }
                          }}
                        >
                          <option value="">
                            {loadingDestinations ? "Loading destinations..." : "Select a destination"}
                          </option>
                          {destinations.map((dest) => (
                            <option key={dest._id} value={dest._id}>
                              {dest.name}, {dest.country}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            setUseCustomDestination(true);
                            setValue("destinationId", "");
                          }}
                          className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 text-left mt-1"
                        >
                          Enter custom destination instead
                        </button>
                      </>
                    ) : (
                      <>
                        <Input
                          {...register("destination")}
                          placeholder="e.g., Bali, Indonesia"
                          disabled={isLoading}
                        />
                        {destinations.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setUseCustomDestination(false);
                              setValue("destination", "");
                            }}
                            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 text-left mt-1"
                          >
                            Select from available destinations
                          </button>
                        )}
                      </>
                    )}
                    {errors.destination && (
                      <span className="text-xs text-red-600">
                        {errors.destination.message}
                      </span>
                    )}
                    {errors.destinationId && (
                      <span className="text-xs text-red-600">
                        {errors.destinationId.message}
                      </span>
                    )}
                  </div>

                  {/* Date Range */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium">Start Date *</label>
                      <Input
                        {...register("startDate")}
                        type="date"
                        disabled={isLoading}
                      />
                      {errors.startDate && (
                        <span className="text-xs text-red-600">
                          {errors.startDate.message}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium">End Date *</label>
                      <Input
                        {...register("endDate")}
                        type="date"
                        disabled={isLoading}
                      />
                      {errors.endDate && (
                        <span className="text-xs text-red-600">
                          {errors.endDate.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Budget & Travel Type */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium">Budget (₹) *</label>
                      <Input
                        {...register("budget")}
                        type="number"
                        placeholder="e.g., 50000"
                        disabled={isLoading}
                      />
                      {errors.budget && (
                        <span className="text-xs text-red-600">
                          {errors.budget.message}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium">Travel Type (Optional)</label>
                      <select
                        {...register("travelType")}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                        disabled={isLoading}
                      >
                        <option value="">Select travel type</option>
                        <option value="adventure">Adventure</option>
                        <option value="leisure">Leisure</option>
                        <option value="business">Business</option>
                        <option value="backpacking">Backpacking</option>
                        <option value="cultural">Cultural</option>
                      </select>
                      {errors.travelType && (
                        <span className="text-xs text-red-600">
                          {errors.travelType.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Group Size */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Group Size *</label>
                    <Input
                      {...register("groupSize")}
                      type="number"
                      placeholder="e.g., 5"
                      disabled={isLoading}
                    />
                    {errors.groupSize && (
                      <span className="text-xs text-red-600">
                        {errors.groupSize.message}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Description (Optional)</label>
                    <textarea
                      {...register("description")}
                      rows={4}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                      placeholder="Describe your trip plans, activities, and what you're looking for in travel companions..."
                      disabled={isLoading}
                    />
                    {errors.description && (
                      <span className="text-xs text-red-600">
                        {errors.description.message}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ===== ENHANCED DETAILS SECTION ===== */}
            <div className="rounded-lg border border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => toggleSection("details")}
                className="flex w-full items-center justify-between bg-gray-50 p-4 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <h2 className="font-semibold">Trip Details (Optional)</h2>
                {expandedSections.details ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {expandedSections.details && (
                <div className="space-y-4 p-4">
                  {/* Difficulty */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Difficulty Level</label>
                    <select
                      {...register("difficulty")}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                      disabled={isLoading}
                    >
                      <option value="">Select difficulty</option>
                      <option value="Easy">Easy</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Hard">Hard</option>
                      <option value="Expert">Expert</option>
                      <option value="Extreme">Extreme</option>
                    </select>
                  </div>

                  {/* Distance & Duration */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium">Distance (Min - KM)</label>
                      <Input
                        {...register("distanceMin")}
                        type="number"
                        placeholder="e.g., 400"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium">Distance (Max - KM)</label>
                      <Input
                        {...register("distanceMax")}
                        type="number"
                        placeholder="e.g., 450"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium">Duration (Min - Hours)</label>
                      <Input
                        {...register("durationMinHours")}
                        type="number"
                        placeholder="e.g., 16"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium">Duration (Max - Hours)</label>
                      <Input
                        {...register("durationMaxHours")}
                        type="number"
                        placeholder="e.g., 20"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Elevation */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium">Elevation (Min - m)</label>
                      <Input
                        {...register("elevationMin")}
                        type="number"
                        placeholder="e.g., 1000"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium">Elevation (Max - m)</label>
                      <Input
                        {...register("elevationMax")}
                        type="number"
                        placeholder="e.g., 5000"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Group Size Range */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium">Group Size (Min)</label>
                      <Input
                        {...register("groupSizeMin")}
                        type="number"
                        placeholder="e.g., 2"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium">Group Size (Max)</label>
                      <Input
                        {...register("groupSizeMax")}
                        type="number"
                        placeholder="e.g., 12"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Best Season */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Best Season</label>
                    <select
                      {...register("bestSeason")}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                      disabled={isLoading}
                    >
                      <option value="">Select season</option>
                      <option value="Spring">Spring</option>
                      <option value="Summer">Summer</option>
                      <option value="Fall">Fall</option>
                      <option value="Winter">Winter</option>
                      <option value="Year-round">Year-round</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* ===== ACTIVITIES & HIGHLIGHTS SECTION ===== */}
            <div className="rounded-lg border border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => toggleSection("activities")}
                className="flex w-full items-center justify-between bg-gray-50 p-4 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <h2 className="font-semibold">Activities & Highlights (Optional)</h2>
                {expandedSections.activities ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {expandedSections.activities && (
                <div className="space-y-4 p-4">
                  {/* Activities */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Activities (Comma separated)</label>
                    <Input
                      {...register("activities")}
                      placeholder="e.g., Hiking, Trekking, Photography"
                      disabled={isLoading}
                    />
                    <p className="text-xs text-gray-500">
                      Separate multiple activities with commas
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Key Highlights (Comma separated)</label>
                    <textarea
                      {...register("highlights")}
                      rows={3}
                      placeholder="e.g., Annapurna Base Camp, Poon Hill, Local culture, Mountain views"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                      disabled={isLoading}
                    />
                    <p className="text-xs text-gray-500">
                      Separate multiple highlights with commas
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ===== INCLUSIONS SECTION ===== */}
            <div className="rounded-lg border border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => toggleSection("inclusions")}
                className="flex w-full items-center justify-between bg-gray-50 p-4 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <h2 className="font-semibold">What's Included (Optional)</h2>
                {expandedSections.inclusions ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {expandedSections.inclusions && (
                <div className="space-y-4 p-4">
                  {/* Guide */}
                  <div className="flex items-center gap-2">
                    <input
                      {...register("guideIncluded")}
                      type="checkbox"
                      className="rounded"
                      disabled={isLoading}
                    />
                    <label className="text-sm font-medium">Professional guide included</label>
                  </div>

                  {/* Meals */}
                  <div className="flex items-center gap-2">
                    <input
                      {...register("mealsIncluded")}
                      type="checkbox"
                      className="rounded"
                      disabled={isLoading}
                    />
                    <label className="text-sm font-medium">Meals included</label>
                  </div>

                  {/* Accommodation Type */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">
                      Accommodation Type (Comma separated)
                    </label>
                    <Input
                      {...register("accommodationType")}
                      placeholder="e.g., Guesthouse, Hotel, Camping"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Trip Image */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Trip Image (Optional)</label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isLoading}
                className="cursor-pointer"
              />
              <p className="mt-1 text-xs text-gray-500">
                Max file size: 5MB. Supported formats: JPG, PNG, WebP
              </p>
            </div>

            {/* Current & Preview Images */}
            {(currentImage || imagePreview) && (
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <p className="mb-4 text-sm font-medium">Current Image:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentImage && !imagePreview && (
                    <div>
                      <p className="mb-2 text-xs text-gray-500">Current</p>
                      <div className="relative h-48 w-full rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={currentImage}
                          alt="Current trip"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                  {imagePreview && (
                    <div>
                      <p className="mb-2 text-xs text-gray-500">New</p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview}
                        alt="Trip preview"
                        className="h-48 w-full rounded-lg object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Updating..." : "Update Trip"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
