
export const API = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
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
    }
}