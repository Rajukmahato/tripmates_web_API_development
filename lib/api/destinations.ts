import axiosInstance from './axios';

export interface Destination {
  _id: string;
  name: string;
  country: string;
  description?: string;
  coverImage?: string;
  attractions?: string[];
  bestTimeToVisit?: string;
  travelTips?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DestinationResponse {
  success: boolean;
  message: string;
  data: Destination[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
}

export interface SingleDestinationResponse {
  success: boolean;
  message: string;
  data: Destination;
}

export interface CreateDestinationData {
  name: string;
  country: string;
  description?: string;
  coverImage?: string;
  coverImageFile?: File;
  attractions?: string[];
  bestTimeToVisit?: string;
  travelTips?: string[];
}

export interface UpdateDestinationData {
  name?: string;
  country?: string;
  description?: string;
  coverImage?: string;
  coverImageFile?: File;
  attractions?: string[];
  bestTimeToVisit?: string;
  travelTips?: string[];
}

/**
 * Get all destinations
 */
export const getDestinations = async (
  page: number = 1,
  limit: number = 100,
  includeInactive: boolean = false
): Promise<DestinationResponse> => {
  const response = await axiosInstance.get('/api/destinations', {
    params: { page, limit, includeInactive },
  });
  return response.data;
};

/**
 * Search destinations by name or country
 */
export const searchDestinations = async (
  searchTerm: string,
  page: number = 1,
  limit: number = 20
): Promise<DestinationResponse> => {
  const response = await axiosInstance.get('/api/destinations/search', {
    params: { q: searchTerm, page, limit },
  });
  return response.data;
};

/**
 * Get a single destination by ID
 */
export const getDestinationById = async (id: string): Promise<SingleDestinationResponse> => {
  const response = await axiosInstance.get(`/api/destinations/${id}`);
  return response.data;
};

/**
 * Create a new destination (Admin only)
 */
export const createDestination = async (data: CreateDestinationData): Promise<SingleDestinationResponse> => {
  const { coverImageFile, ...payload } = data;

  if (coverImageFile) {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('country', payload.country);

    if (payload.description) formData.append('description', payload.description);
    if (payload.bestTimeToVisit) formData.append('bestTimeToVisit', payload.bestTimeToVisit);
    if (payload.attractions && payload.attractions.length > 0) {
      formData.append('attractions', JSON.stringify(payload.attractions));
    }
    if (payload.travelTips && payload.travelTips.length > 0) {
      formData.append('travelTips', JSON.stringify(payload.travelTips));
    }
    formData.append('coverImage', coverImageFile);

    const response = await axiosInstance.post('/api/destinations', formData);
    return response.data;
  }

  const response = await axiosInstance.post('/api/destinations', payload);
  return response.data;
};

/**
 * Update a destination (Admin only)
 */
export const updateDestination = async (id: string, data: UpdateDestinationData): Promise<SingleDestinationResponse> => {
  const { coverImageFile, ...payload } = data;

  if (coverImageFile) {
    const formData = new FormData();

    if (payload.name) formData.append('name', payload.name);
    if (payload.country) formData.append('country', payload.country);
    if (payload.description !== undefined) formData.append('description', payload.description);
    if (payload.coverImage !== undefined) formData.append('coverImage', payload.coverImage);
    if (payload.bestTimeToVisit !== undefined) formData.append('bestTimeToVisit', payload.bestTimeToVisit);
    if (payload.attractions) formData.append('attractions', JSON.stringify(payload.attractions));
    if (payload.travelTips) formData.append('travelTips', JSON.stringify(payload.travelTips));

    formData.append('coverImage', coverImageFile);

    const response = await axiosInstance.put(`/api/destinations/${id}`, formData);
    return response.data;
  }

  const response = await axiosInstance.put(`/api/destinations/${id}`, payload);
  return response.data;
};

/**
 * Update destination status (Admin only)
 */
export const updateDestinationStatus = async (id: string, isActive: boolean): Promise<SingleDestinationResponse> => {
  const response = await axiosInstance.put(`/api/destinations/${id}/status`, { isActive });
  return response.data;
};

/**
 * Delete a destination (Admin only)
 */
export const deleteDestination = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await axiosInstance.delete(`/api/destinations/${id}`);
  return response.data;
};

/**
 * Get destination statistics (Admin dashboard)
 */
export const getDestinationStats = async (): Promise<{
  success: boolean;
  data: {
    totalDestinations: number;
    activeDestinations: number;
    inactiveDestinations: number;
  };
}> => {
  const response = await axiosInstance.get('/api/destinations/admin/stats');
  return response.data;
};
