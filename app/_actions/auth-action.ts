"use server";
import { login, register } from "@/lib/api/auth"
import { setAuthToken, setUserData, clearAuthCookies } from "@/app/_utils/cookies"
import { redirect } from "next/navigation";
import { getErrorMessage } from "@/app/_utils/error-handler"
import type { UserData } from "@/app/_utils/cookies"

// Type definitions
interface AuthActionResult {
    success: boolean
    message: string
    data?: UserData
}

interface RegisterFormData {
    fullName: string
    email: string
    phoneNumber: string
    password: string
    confirmPassword: string
}

interface LoginFormData {
    email: string
    password: string
}

/**
 * Server action to handle user registration
 */
export const handleRegister = async (data: RegisterFormData): Promise<AuthActionResult> => {
    try {
        const response = await register(data)
        if (response.success) {
            return {
                success: true,
                message: 'Registration successful',
                data: response.data ? (response.data as UserData) : undefined
            }
        }
        return {
            success: false,
            message: response.message || 'Registration failed'
        }
    } catch (error: unknown) {
        console.error('Registration action error:', error)
        return { 
            success: false, 
            message: getErrorMessage(error) || 'Registration action failed' 
        }
    }
}

/**
 * Server action to handle user login
 */
export const handleLogin = async (data: LoginFormData): Promise<AuthActionResult> => {
    try {
        const response = await login(data)
        if (response.success && response.token && response.data) {
            await setAuthToken(response.token)
            // Cast to UserData as the backend returns compatible user data
            await setUserData(response.data as UserData)
            return {
                success: true,
                message: 'Login successful',
                data: response.data as UserData
            }
        }
        return {
            success: false,
            message: response.message || 'Login failed'
        }
    } catch (error: unknown) {
        console.error('Login action error:', error)
        return { 
            success: false, 
            message: getErrorMessage(error) || 'Login action failed' 
        }
    }
}

/**
 * Server action to handle user logout
 */
export const handleLogout = async (): Promise<void> => {
    try {
        await clearAuthCookies();
        redirect('/login');
    } catch (error: unknown) {
        console.error('Logout error:', error)
        // Still redirect even if clearing cookies fails
        redirect('/login');
    }
}