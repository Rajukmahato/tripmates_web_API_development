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
  profileImagePath?: string;
  createdAt: string;
  updatedAt: string;
  isBlocked?: boolean;
}

// ============================================
// DESTINATION TYPES
// ============================================

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

// ============================================
// TRIP TYPES
// ============================================

export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
  location?: string;
}

export interface Trip {
  _id: string;
  title?: string;
  description: string;
  destination: string;
  destinationId?: string; // Reference to Destination model
  startDate: string;
  endDate: string;
  budget: number;
  groupSize?: number; // Basic group size (max members)
  maxMembers?: number;
  currentMembers?: number;
  createdBy?: string | User; // Can be populated
  image?: string;
  status?: "open" | "closed" | "completed" | "cancelled";
  members?: User[];
  itinerary?: ItineraryItem[]; // v2: Day-by-day itinerary
  travelChecklist?: string[]; // v2: Travel checklist items
  notes?: string; // v2: Additional trip notes
  
  // ===== NEW OPTIONAL FIELDS =====
  distanceMin?: number;
  distanceMax?: number;
  distanceUnit?: string;
  durationMinHours?: number;
  durationMaxHours?: number;
  difficulty?: "Easy" | "Moderate" | "Hard" | "Expert" | "Extreme";
  physicalDemand?: "Light" | "Moderate" | "Strenuous" | "Very Strenuous";
  skilLevelRequired?: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  fitnessLevel?: string;
  groupSizeMin?: number;
  groupSizeMax?: number;
  averageRating?: number;
  reviewCount?: number;
  favoriteCount?: number;
  activities?: string[];
  bestSeason?: "Spring" | "Summer" | "Fall" | "Winter" | "Year-round";
  bestMonths?: number[];
  elevationMin?: number;
  elevationMax?: number;
  elevationUnit?: string;
  guideIncluded?: boolean;
  guidingLevel?: "Self-guided" | "Optional Guide" | "Professional Guide";
  mealsIncluded?: boolean;
  mealsIncludedInfo?: {
    breakfast?: boolean;
    lunch?: boolean;
    dinner?: boolean;
    snacks?: boolean;
    beverages?: boolean;
  };
  accommodationType?: string[];
  accommodationStandard?: "Budget" | "Mid-range" | "Luxury" | "Mixed";
  inclusions?: string[];
  exclusions?: string[];
  highlights?: string[];
  keyAttractions?: Array<{
    name: string;
    description?: string;
    type?: string;
  }>;
  routeHighlights?: Array<{
    day: number;
    location: string;
    highlights: string[];
    elevation?: number;
    activities?: string[];
  }>;
  images?: string[];
  videoUrl?: string;
  gallery?: Array<{
    url: string;
    caption?: string;
  }>;
  hasGroupChat?: boolean;
  emergencySupportPhone?: string;
  isFeatured?: boolean;
  isPublic?: boolean;
  
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

// ============================================// CHAT & MESSAGE TYPES
// ============================================

export interface Message {
  _id: string;
  sender: User;
  receiver?: User;
  content: string;
  type?: "private" | "group";
  groupId?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  participant: User;
  lastMessage?: Message;
  unreadCount?: number;
  updatedAt: string;
}

// ============================================
// REVIEW TYPES
// ============================================

export interface Review {
  _id: string;
  reviewer: User;
  reviewee: User;
  trip: Trip;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export interface Notification {
  _id: string;
  recipient: User;
  type: "request" | "message" | "review" | "match" | "system";
  title: string;
  message?: string;
  body?: string; // Alternative field name for message content
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

// ============================================
// REPORT TYPES
// ============================================

export interface Report {
  _id: string;
  reporter: User;
  reportedUser: User;
  trip?: Trip;
  reason: string;
  description: string;
  status: "pending" | "reviewed" | "resolved";
  reviewedBy?: User;
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

// ============================================
// ANALYTICS TYPES
// ============================================

export interface AnalyticsOverview {
  totalUsers: number;
  totalTrips: number;
  totalMatches: number;
  totalChats: number;
  activeUsersToday: number;
  activeUsers?: number;
  userGrowthRate?: number;
  tripGrowthRate?: number;
  averageUsersPerTrip?: number;
  systemPerformance?: SystemPerformance;
}

export interface AnalyticsPeriodData {
  label: string;
  count: number;
  period?: string;
  trend?: number;
  change?: number;
}

export interface MatchStats {
  totalRequests: number;
  acceptedRequests: number;
  rejectedRequests: number;
  matchRate: number;
}

export interface SystemPerformance {
  averageResponseTime: number;
  activeConnections: number;
  databaseStatus: "healthy" | "degraded" | "down";
}
