"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createDestination, CreateDestinationData } from "@/lib/api/destinations";
import { Card } from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { FileInput } from "@/app/_components/ui/file-input";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

interface DestinationFormData {
  name: string;
  country: string;
  description: string;
  attractions: string;
  bestTimeToVisit: string;
  travelTips: string;
}

export default function CreateDestinationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [attractionsList, setAttractionsList] = useState<string[]>([]);
  const [attractionInput, setAttractionInput] = useState("");
  const [travelTipsList, setTravelTipsList] = useState<string[]>([]);
  const [travelTipInput, setTravelTipInput] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DestinationFormData>();

  const addAttraction = () => {
    if (attractionInput.trim()) {
      setAttractionsList([...attractionsList, attractionInput.trim()]);
      setAttractionInput("");
    }
  };

  const removeAttraction = (index: number) => {
    setAttractionsList(attractionsList.filter((_, i) => i !== index));
  };

  const addTravelTip = () => {
    if (travelTipInput.trim()) {
      setTravelTipsList([...travelTipsList, travelTipInput.trim()]);
      setTravelTipInput("");
    }
  };

  const removeTravelTip = (index: number) => {
    setTravelTipsList(travelTipsList.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: DestinationFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const destinationData: CreateDestinationData = {
        name: data.name,
        country: data.country,
        description: data.description || undefined,
        coverImageFile: coverImageFile || undefined,
        attractions: attractionsList.length > 0 ? attractionsList : undefined,
        bestTimeToVisit: data.bestTimeToVisit || undefined,
        travelTips: travelTipsList.length > 0 ? travelTipsList : undefined,
      };

      const response = await createDestination(destinationData);

      if (response.success) {
        router.push("/admin/destinations");
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to create destination";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-muted dark:from-background dark:to-slate-900">
      <div className="container-max section-padding">
        <div className="mb-8 animate-slideInUp">
          <Link
            href="/admin/destinations"
            className="inline-flex items-center text-sm text-primary hover:text-primary-dark dark:text-primary dark:hover:text-primary-light mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Destinations
          </Link>
          <h1 className="text-4xl font-bold mb-2">Create Destination</h1>
          <p className="text-lg text-muted-foreground">Add a new travel destination</p>
        </div>

        <Card className="p-6 card-base max-w-3xl">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Basic Information</h2>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Destination Name *</label>
                <Input
                  {...register("name", { 
                    required: "Destination name is required",
                    minLength: { value: 2, message: "Name must be at least 2 characters" }
                  })}
                  placeholder="e.g., Paris"
                  disabled={isLoading}
                />
                {errors.name && (
                  <span className="text-xs text-red-600">{errors.name.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Country *</label>
                <Input
                  {...register("country", { 
                    required: "Country is required",
                    minLength: { value: 2, message: "Country must be at least 2 characters" }
                  })}
                  placeholder="e.g., France"
                  disabled={isLoading}
                />
                {errors.country && (
                  <span className="text-xs text-red-600">{errors.country.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Cover Image</label>
                <FileInput
                  onChange={(file) => setCoverImageFile(file)}
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  {...register("description")}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                  placeholder="Describe the destination..."
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Best Time to Visit</label>
                <Input
                  {...register("bestTimeToVisit")}
                  placeholder="e.g., April to October"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Attractions */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Attractions</h2>
              
              <div className="flex gap-2">
                <Input
                  value={attractionInput}
                  onChange={(e) => setAttractionInput(e.target.value)}
                  placeholder="Add an attraction..."
                  disabled={isLoading}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addAttraction();
                    }
                  }}
                />
                <Button type="button" onClick={addAttraction} disabled={isLoading}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {attractionsList.length > 0 && (
                <div className="space-y-2">
                  {attractionsList.map((attraction, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      <span className="flex-1">{attraction}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttraction(index)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Travel Tips */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Travel Tips</h2>
              
              <div className="flex gap-2">
                <Input
                  value={travelTipInput}
                  onChange={(e) => setTravelTipInput(e.target.value)}
                  placeholder="Add a travel tip..."
                  disabled={isLoading}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTravelTip();
                    }
                  }}
                />
                <Button type="button" onClick={addTravelTip} disabled={isLoading}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {travelTipsList.length > 0 && (
                <div className="space-y-2">
                  {travelTipsList.map((tip, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      <span className="flex-1">{tip}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTravelTip(index)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Creating..." : "Create Destination"}
              </Button>
              <Link href="/admin/destinations" className="flex-1">
                <Button type="button" variant="outline" className="w-full" disabled={isLoading}>
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
