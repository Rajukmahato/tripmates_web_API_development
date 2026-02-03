import axiosInstance from './axios';
import { API } from './endpoints';
import { User } from "./admin/user";

export interface UserProfileResponse {
    success: boolean;
    data: User;
    message?: string;
}

/**
 * Fetch user profile by user ID
 * @param userId - User ID
 */
export const getUserProfile = async (userId: string): Promise<UserProfileResponse> => {
    const response = await axiosInstance.get(API.USER.PROFILE(userId));
    return response.data;
};

/**
 * Update user profile
 * @param userId - User ID
 * @param formData - FormData containing updated fields
 */
export const updateUserProfile = async (userId: string, formData: FormData): Promise<UserProfileResponse> => {
    const response = await axiosInstance.put(API.USER.UPDATE_PROFILE(userId), formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
