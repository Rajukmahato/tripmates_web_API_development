/**
 * Shared TypeScript interfaces for TripMates application
 */

// ============================================
// USER TYPES
// ============================================

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
  isBlocked?: boolean;
}

// ============================================
// TRIP TYPES
// ============================================

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
  createdBy: string | User; // Can be populated
  image?: string;
  status?: "open" | "closed" | "completed" | "cancelled";
  members?: User[];
  createdAt: string;
  updatedAt: string;
}

export type TravelType = "adventure" | "leisure" | "business" | "backpacking" | "cultural";

// ============================================
// PARTNER REQUEST TYPES
// ============================================

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

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  totalPages?: number; // Alternative field name
  totalCount?: number; // Alternative field name
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
  message?: string;
}

// Specific response types
export type UserResponse = ApiResponse<User>;
export type TripResponse = ApiResponse<Trip>;
export type PartnerRequestResponse = ApiResponse<PartnerRequest>;

export type UsersListResponse = PaginatedResponse<User>;
export type TripsListResponse = PaginatedResponse<Trip>;
export type PartnerRequestsListResponse = PaginatedResponse<PartnerRequest>;

// ============================================
// AUTHENTICATION TYPES
// ============================================

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  fullName: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message?: string;
}

// ============================================
// FORM DATA TYPES
// ============================================

export interface CreateTripFormData {
  title: string;
  description: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  maxMembers: string;
  image?: File;
}

export interface UpdateProfileFormData {
  fullName?: string;
  phoneNumber?: string;
  bio?: string;
  location?: string;
  profileImage?: File;
}

export interface SendRequestFormData {
  tripId: string;
  message?: string;
}

// ============================================
// FILTER TYPES
// ============================================

export interface TripFilters {
  destination?: string;
  startDate?: string;
  endDate?: string;
  minBudget?: number;
  maxBudget?: number;
  travelType?: TravelType;
  availableSpots?: boolean;
}

export interface UserFilters {
  role?: "user" | "admin";
  isBlocked?: boolean;
  search?: string;
}

// ============================================
// UTILITY TYPES
// ============================================

export type SortOrder = "asc" | "desc";

export interface SortOptions {
  field: string;
  order: SortOrder;
}

export type LoadingState = "idle" | "loading" | "success" | "error";

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// ============================================
// CONTEXT TYPES
// ============================================

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (credentials: AuthCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
}

// ============================================
// COMPONENT PROP TYPES
// ============================================

export interface CardProps {
  variant?: "default" | "elevated" | "gradient" | "outline";
  className?: string;
  children: React.ReactNode;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "danger" | "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export interface BadgeProps {
  variant?: "default" | "primary" | "secondary" | "destructive" | "outline" | "warning";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}
