import axiosInstance from "../axios";
import { Trip, TripsListResponse } from "../trips";

/**
 * Get all trips for admin (with pagination)
 */
export const getAllTrips = async (
  page = 1,
  limit = 10
): Promise<TripsListResponse> => {
  const response = await axiosInstance.get(
    `/api/admin/trips?page=${page}&limit=${limit}`
  );
  return response.data;
};

/**
 * Delete a trip (admin only)
 */
export const deleteTrip = async (
  tripId: string
): Promise<{ success: boolean; message: string }> => {
  const response = await axiosInstance.delete(`/api/admin/trips/${tripId}`);
  return response.data;
};

/**
 * Get trip statistics (admin dashboard)
 */
export const getTripStats = async (): Promise<{
  success: boolean;
  data: {
    totalTrips: number;
    activeTrips: number;
    completedTrips: number;
    cancelledTrips: number;
  };
}> => {
  const response = await axiosInstance.get("/api/admin/trips/stats");
  return response.data;
};
