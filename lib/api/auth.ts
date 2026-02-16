/* eslint-disable @typescript-eslint/no-explicit-any */
//import { LoginData, RegisterData } from "@/app/(auth)/schema"
import axios from "./axios"
import { API } from "./endpoints"


export const register = async (registerData: any) => {
    try {
        const response = await axios.post(API.AUTH.REGISTER, registerData)
        return response.data
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Registration failed')
    }
}

export const login = async (loginData: any) => {
    try {
        const response = await axios.post(API.AUTH.LOGIN, loginData)
        return response.data
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Login failed')
    }
}

export const forgotPassword = async (email: string) => {
    try {
        const response = await axios.post(API.AUTH.FORGOT_PASSWORD, { email })
        return response.data
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to process forgot password request')
    }
}

export const resetPassword = async (token: string, password: string, confirmPassword: string) => {
    try {
        const response = await axios.post(API.AUTH.RESET_PASSWORD, { token, password, confirmPassword })
        return response.data
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to reset password')
    }
}