import axiosInstance from "../axios";
import { API } from "../endpoints";

export interface User {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: "user" | "admin";
    bio?: string;
    location?: string;
    profileImage?: string;
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedUsersResponse {
    success: boolean;
    data: User[];
    pagination: {
        currentPage: number | null;
        totalPages: number;
        totalCount: number;
        limit: number;
    };
}

export interface UserResponse {
    success: boolean;
    data: User;
    message?: string;
}

/**
 * Fetch all users with pagination
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 10)
 */
export const getAllUsers = async (page = 1, limit = 10): Promise<PaginatedUsersResponse> => {
    const response = await axiosInstance.get(`${API.ADMIN.USERS}?page=${page}&limit=${limit}`);
    return response.data;
};

/**
 * Fetch a single user by ID
 * @param id - User ID
 */
export const getUserById = async (id: string): Promise<UserResponse> => {
    const response = await axiosInstance.get(API.ADMIN.USER_BY_ID(id));
    return response.data;
};

/**
 * Create a new user (Admin only)
 * @param formData - FormData containing user details and optional profileImage
 */
export const createUser = async (formData: FormData): Promise<UserResponse> => {
    const response = await axiosInstance.post(API.ADMIN.CREATE_USER, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

/**
 * Update user details (Admin only)
 * @param id - User ID
 * @param formData - FormData containing updated fields
 */
export const updateUser = async (id: string, formData: FormData): Promise<UserResponse> => {
    const response = await axiosInstance.put(API.ADMIN.UPDATE_USER(id), formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

/**
 * Delete a user (Admin only)
 * @param id - User ID
 */
export const deleteUser = async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.delete(API.ADMIN.DELETE_USER(id));
    return response.data;
};
