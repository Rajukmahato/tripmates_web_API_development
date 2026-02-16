import axiosInstance from "./axios";
import { API } from "./endpoints";

export interface Trip {
  _id: string;
  title: string;
  description: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  maxMembers: number;
  currentMembers: number;
  createdBy: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TripResponse {
  success: boolean;
  data: Trip;
  message?: string;
}

export interface TripsListResponse {
  success: boolean;
  data: Trip[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Get all available trips with pagination
 */
export const getAllTrips = async (page = 1, limit = 10): Promise<TripsListResponse> => {
  const response = await axiosInstance.get(`${API.TRIPS.LIST}?page=${page}&limit=${limit}`);
  return response.data;
};

/**
 * Get trip by ID
 */
export const getTripById = async (tripId: string): Promise<TripResponse> => {
  const response = await axiosInstance.get(API.TRIPS.GET(tripId));
  return response.data;
};

/**
 * Create new trip
 */
export const createTrip = async (tripData: Partial<Trip>): Promise<TripResponse> => {
  const response = await axiosInstance.post(API.TRIPS.CREATE, tripData);
  return response.data;
};

/**
 * Update trip
 */
export const updateTrip = async (tripId: string, tripData: Partial<Trip>): Promise<TripResponse> => {
  const response = await axiosInstance.put(API.TRIPS.UPDATE(tripId), tripData);
  return response.data;
};

/**
 * Delete trip
 */
export const deleteTrip = async (tripId: string): Promise<{ success: boolean; message: string }> => {
  const response = await axiosInstance.delete(API.TRIPS.DELETE(tripId));
  return response.data;
};

/**
 * Join trip
 */
export const joinTrip = async (tripId: string): Promise<TripResponse> => {
  const response = await axiosInstance.post(API.TRIPS.JOIN(tripId), {});
  return response.data;
};

/**
 * Leave trip
 */
export const leaveTrip = async (tripId: string): Promise<{ success: boolean; message: string }> => {
  const response = await axiosInstance.post(API.TRIPS.LEAVE(tripId), {});
  return response.data;
};
