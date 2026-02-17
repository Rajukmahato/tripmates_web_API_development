"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTripSchema, CreateTripFormData } from "../schema";
import { createTrip } from "@/lib/api/trips";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreateTripPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTripFormData>({
    resolver: zodResolver(createTripSchema),
  });

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
      // Convert string values to numbers
      const tripData = {
        destination: data.destination,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        budget: Number(data.budget),
        travelType: data.travelType,
        groupSize: Number(data.groupSize),
      };

      // If there's an image, use FormData; otherwise send as JSON
      if (imageFile) {
        const formData = new FormData();
        formData.append("destination", data.destination);
        formData.append("description", data.description || "");
        formData.append("startDate", data.startDate);
        formData.append("endDate", data.endDate);
        formData.append("budget", String(Number(data.budget)));
        formData.append("travelType", data.travelType);
        formData.append("groupSize", String(Number(data.groupSize)));
        formData.append("image", imageFile);

        const response = await createTrip(tripData);
        
        if (response.success) {
          alert("Trip created successfully!");
          router.push(`/user/trips/${response.data._id}`);
        }
      } else {
        // Send as regular JSON if no image
        const response = await createTrip(tripData);
        
        if (response.success) {
          alert("Trip created successfully!");
          router.push(`/user/trips/${response.data._id}`);
        }
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Failed to create trip");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl p-6">
      <div className="mb-6">
        <Link
          href="/user/trips"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Trips
        </Link>
      </div>

      <Card className="p-6">
        <h1 className="mb-6 text-2xl font-bold">Create New Trip</h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Destination */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Destination *</label>
            <Input
              {...register("destination")}
              placeholder="e.g., Bali, Indonesia"
              disabled={isLoading}
            />
            {errors.destination && (
              <span className="text-xs text-red-600">{errors.destination.message}</span>
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
                <span className="text-xs text-red-600">{errors.startDate.message}</span>
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
                <span className="text-xs text-red-600">{errors.endDate.message}</span>
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
                <span className="text-xs text-red-600">{errors.budget.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Travel Type *</label>
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
              </select>
              {errors.travelType && (
                <span className="text-xs text-red-600">{errors.travelType.message}</span>
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
              <span className="text-xs text-red-600">{errors.groupSize.message}</span>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Description (Optional)</label>
            <textarea
              {...register("description")}
              rows={5}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
              placeholder="Describe your trip plans, activities, and what you're looking for in travel companions..."
              disabled={isLoading}
            />
            {errors.description && (
              <span className="text-xs text-red-600">{errors.description.message}</span>
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
            {error && <span className="text-xs text-red-600">{error}</span>}
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <p className="mb-2 text-sm font-medium">Image Preview:</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Trip preview"
                className="h-48 w-full rounded-lg object-cover"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Creating..." : "Create Trip"}
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

      {/* Guidelines Card */}
      <Card className="mt-6 p-6">
        <h2 className="mb-3 text-lg font-semibold">Trip Creation Guidelines</h2>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li>• Be specific about your destination and travel plans</li>
          <li>• Set a realistic budget that covers major expenses</li>
          <li>• Choose appropriate dates - trips in the past cannot be created</li>
          <li>• Write a detailed description to attract compatible travel partners</li>
          <li>• Add a relevant image to make your trip more appealing</li>
        </ul>
      </Card>
    </div>
  );
}
