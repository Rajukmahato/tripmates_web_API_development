"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { 
  getDestinationById, 
  updateDestination, 
  updateDestinationStatus,
  deleteDestination,
  UpdateDestinationData 
} from "@/lib/api/destinations";
import { Destination } from "@/app/_types/common.types";
import { Card } from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { FileInput } from "@/app/_components/ui/file-input";
import { Loading } from "@/app/_components/ui/loading";
import { Dialog } from "@/app/_components/ui/dialog";
import { Badge } from "@/app/_components/ui/badge";
import { ArrowLeft, Plus, Trash2, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface DestinationFormData {
  name: string;
  country: string;
  description: string;
  coverImage: string;
  bestTimeToVisit: string;
}

export default function EditDestinationPage() {
  const router = useRouter();
  const params = useParams();
  const destinationId = params.id as string;

  const [destination, setDestination] = useState<Destination | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [attractionsList, setAttractionsList] = useState<string[]>([]);
  const [attractionInput, setAttractionInput] = useState("");
  const [travelTipsList, setTravelTipsList] = useState<string[]>([]);
  const [travelTipInput, setTravelTipInput] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<DestinationFormData>();

  const fetchDestination = useCallback(async () => {
    setPageLoading(true);
    setError("");
    try {
      const response = await getDestinationById(destinationId);
      if (response.success && response.data) {
        const dest = response.data;
        setDestination(dest);
        
        // Populate form fields
        setValue("name", dest.name);
        setValue("country", dest.country);
        setValue("description", dest.description || "");
        setValue(
          "coverImage",
          dest.coverImage && /^https?:\/\//.test(dest.coverImage) ? dest.coverImage : ""
        );
        setValue("bestTimeToVisit", dest.bestTimeToVisit || "");
        
        // Set arrays
        setAttractionsList(dest.attractions || []);
        setTravelTipsList(dest.travelTips || []);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to load destination";
      setError(errorMsg);
    } finally {
      setPageLoading(false);
    }
  }, [destinationId, setValue]);

  useEffect(() => {
    if (destinationId) {
      fetchDestination();
    }
  }, [destinationId, fetchDestination]);

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
      const destinationData: UpdateDestinationData = {
        name: data.name,
        country: data.country,
        description: data.description || undefined,
        coverImage: coverImageFile ? undefined : (data.coverImage || undefined),
        coverImageFile: coverImageFile || undefined,
        attractions: attractionsList.length > 0 ? attractionsList : undefined,
        bestTimeToVisit: data.bestTimeToVisit || undefined,
        travelTips: travelTipsList.length > 0 ? travelTipsList : undefined,
      };

      const response = await updateDestination(destinationId, destinationData);

      if (response.success) {
        router.push("/admin/destinations");
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update destination";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!destination) return;
    
    setIsLoading(true);
    try {
      const response = await updateDestinationStatus(destinationId, !destination.isActive);
      if (response.success) {
        setDestination({ ...destination, isActive: !destination.isActive });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update status";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteDestination(destinationId);
      router.push("/admin/destinations");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete destination";
      setError(errorMsg);
      setDeleteDialog(false);
    } finally {
      setDeleting(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Loading destination..." />
      </div>
    );
  }

  if (error && !destination) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-muted dark:from-background dark:to-slate-900">
        <div className="container-max section-padding">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Destination Not Found</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Link href="/admin/destinations">
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
        <div className="mb-8 animate-slideInUp">
          <Link
            href="/admin/destinations"
            className="inline-flex items-center text-sm text-primary hover:text-primary-dark dark:text-primary dark:hover:text-primary-light mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Destinations
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Edit Destination</h1>
              <p className="text-lg text-muted-foreground">Update destination information</p>
            </div>
            {destination && (
              <Badge variant={destination.isActive ? "success" : "default"}>
                {destination.isActive ? "Active" : "Inactive"}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="p-6 card-base">
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
                    <label className="text-sm font-medium">Current / New Cover Image</label>
                    <FileInput
                      onChange={(file) => setCoverImageFile(file)}
                      currentImagePath={destination?.coverImage}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Or Use Cover Image URL</label>
                    <Input
                      {...register("coverImage")}
                      placeholder="https://example.com/image.jpg"
                      disabled={isLoading}
                      type="url"
                    />
                    <p className="text-xs text-muted-foreground">
                      Uploading a file will replace the current backend image. URL works as an alternative.
                    </p>
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
                    {isLoading ? "Saving..." : "Save Changes"}
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

          {/* Sidebar Actions */}
          <div className="space-y-4">
            <Card className="p-6 card-base">
              <h3 className="text-lg font-semibold mb-4">Actions</h3>
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleToggleStatus}
                  disabled={isLoading}
                >
                  {destination?.isActive ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                  onClick={() => setDeleteDialog(true)}
                  disabled={isLoading}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Destination
                </Button>
              </div>
            </Card>

            {destination && (
              <Card className="p-6 card-base">
                <h3 className="text-lg font-semibold mb-4">Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Created:</span>
                    <p className="font-medium">{new Date(destination.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last Updated:</span>
                    <p className="font-medium">{new Date(destination.updatedAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <p className="font-medium">{destination.isActive ? "Active" : "Inactive"}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Delete Destination</h3>
              <p className="text-sm text-muted-foreground">This action cannot be undone</p>
            </div>
          </div>
          <p className="text-muted-foreground mb-6">
            Are you sure you want to delete <strong>{destination?.name}</strong>? 
            All associated data will be permanently removed.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setDeleteDialog(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
