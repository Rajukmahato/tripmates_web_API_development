import axiosInstance from "./axios";
import { Trip } from "./trips";
import { User } from "./admin/user";

/**
 * Partner Request Interface
 */
export interface PartnerRequest {
  _id: string;
  trip: Trip;
  sender: User;
  receiver: User;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  message?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * API Response Interfaces
 */
export interface PartnerRequestResponse {
  success: boolean;
  data: PartnerRequest;
  message?: string;
}

export interface PartnerRequestsListResponse {
  success: boolean;
  data: PartnerRequest[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
}

/**
 * Send join request to trip owner
 */
export const sendJoinRequest = async (
  tripId: string,
  message?: string
): Promise<PartnerRequestResponse> => {
  const response = await axiosInstance.post("/api/partner-requests", {
    tripId,
    message,
  });
  return response.data;
};

/**
 * Get all received partner requests
 */
export const getReceivedRequests = async (
  page = 1,
  limit = 10
): Promise<PartnerRequestsListResponse> => {
  const response = await axiosInstance.get(
    `/api/partner-requests/received?page=${page}&limit=${limit}`
  );
  return response.data;
};

/**
 * Get all sent partner requests
 */
export const getSentRequests = async (
  page = 1,
  limit = 10
): Promise<PartnerRequestsListResponse> => {
  const response = await axiosInstance.get(
    `/api/partner-requests/sent?page=${page}&limit=${limit}`
  );
  return response.data;
};

/**
 * Accept a partner request
 */
export const acceptRequest = async (
  requestId: string
): Promise<PartnerRequestResponse> => {
  const response = await axiosInstance.put(
    `/api/partner-requests/${requestId}/accept`
  );
  return response.data;
};

/**
 * Reject a partner request
 */
export const rejectRequest = async (
  requestId: string
): Promise<PartnerRequestResponse> => {
  const response = await axiosInstance.put(
    `/api/partner-requests/${requestId}/reject`
  );
  return response.data;
};

/**
 * Cancel a sent partner request
 */
export const cancelRequest = async (
  requestId: string
): Promise<PartnerRequestResponse> => {
  const response = await axiosInstance.delete(
    `/api/partner-requests/${requestId}`
  );
  return response.data;
};

/**
 * Get partner request by ID
 */
export const getRequestById = async (
  requestId: string
): Promise<PartnerRequestResponse> => {
  const response = await axiosInstance.get(
    `/api/partner-requests/${requestId}`
  );
  return response.data;
};
