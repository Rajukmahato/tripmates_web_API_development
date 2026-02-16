export const API = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        FORGOT_PASSWORD: '/api/auth/forgot-password',
        RESET_PASSWORD: '/api/auth/reset-password',
    },
    ADMIN: {
        USERS: '/api/admin/users',
        USER_BY_ID: (id: string) => `/api/admin/users/${id}`,
        CREATE_USER: '/api/admin/users',
        UPDATE_USER: (id: string) => `/api/admin/users/${id}`,
        DELETE_USER: (id: string) => `/api/admin/users/${id}`,
    },
    USER: {
        PROFILE: (userId: string) => `/api/user/profile/${userId}`,
        UPDATE_PROFILE: (userId: string) => `/api/user/profile/${userId}`,
    },
    TRIPS: {
        LIST: '/api/trips',
        GET: (id: string) => `/api/trips/${id}`,
        CREATE: '/api/trips',
        UPDATE: (id: string) => `/api/trips/${id}`,
        DELETE: (id: string) => `/api/trips/${id}`,
        JOIN: (id: string) => `/api/trips/${id}/join`,
        LEAVE: (id: string) => `/api/trips/${id}/leave`,
    }
}