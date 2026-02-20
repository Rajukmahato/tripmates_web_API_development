/**
 * Trip Helper Utilities
 * Provides backward compatibility and utility functions for enhanced trip fields
 */

import { Trip } from "@/app/_types/common.types";

// Backend API URL for image serving
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050';

/**
 * Get full image URL from relative path
 * Converts paths like "/uploads/trips/image.jpg" to "http://localhost:5050/uploads/trips/image.jpg"
 */
export function getTripImageUrl(imagePath?: string | null): string {
  if (!imagePath) return '';
  
  // If already a full URL (starts with http:// or https://), return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path, prepend backend URL
  const fullUrl = `${BACKEND_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  
  // Add cache-busting parameter to force fresh fetch after backend header changes
  const cacheBuster = '?v=2';
  
  return fullUrl + cacheBuster;
}

/**
 * Get trip duration in days
 */
export function getTripDurationDays(trip: Trip): number {
  if (!trip.startDate || !trip.endDate) return 0;
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Calculate total participants in a trip
 * Always returns 1 (creator) + number of other members
 * Ensures creator is not double-counted if they appear in the members array
 * 
 * @param trip - The trip object (can be from different sources with different structures)
 * @returns Total number of participants (creator + members)
 */
export function getTotalParticipants(trip: Trip | Record<string, unknown>): number {
  // Start with 1 for the creator
  let total = 1;
  
  // Get creator ID - handle different property names and types
  const creatorObj = (trip as Record<string, unknown>).creator || (trip as Record<string, unknown>).createdBy;
  const creatorId = typeof creatorObj === 'object' && creatorObj 
    ? (creatorObj as Record<string, unknown>)._id 
    : creatorObj;
  
  // Add members, but make sure we don't count the creator twice
  const members = (trip as Record<string, unknown>).members;
  if (members && Array.isArray(members) && members.length > 0) {
    // Count members that are not the creator
    const nonCreatorMembers = members.filter((member: unknown) => {
      const memberId = typeof member === 'object' && member 
        ? (member as Record<string, unknown>)._id 
        : member;
      return memberId !== creatorId;
    });
    
    total += nonCreatorMembers.length;
  }
  
  return total;
}

/**
 * Format distance display
 */
export function formatDistance(
  minDistance?: number,
  maxDistance?: number,
  unit?: string
): string | null {
  if (!minDistance && !maxDistance) return null;
  const distUnit = unit || "KM";
  if (minDistance && maxDistance) {
    return `${minDistance} to ${maxDistance} ${distUnit}`;
  }
  if (minDistance) return `${minDistance} ${distUnit}`;
  if (maxDistance) return `Up to ${maxDistance} ${distUnit}`;
  return null;
}

/**
 * Format duration in hours display
 */
export function formatDuration(
  minHours?: number,
  maxHours?: number
): string | null {
  if (!minHours && !maxHours) return null;
  if (minHours && maxHours) {
    return `${minHours} to ${maxHours} hrs`;
  }
  if (minHours) return `${minHours} hrs`;
  if (maxHours) return `Up to ${maxHours} hrs`;
  return null;
}

/**
 * Format elevation display
 */
export function formatElevation(
  minElev?: number,
  maxElev?: number,
  unit?: string
): string | null {
  if (!minElev && !maxElev) return null;
  const elevUnit = unit || "m";
  if (minElev && maxElev) {
    return `${minElev} - ${maxElev} ${elevUnit}`;
  }
  if (minElev) return `${minElev} ${elevUnit}`;
  if (maxElev) return `Up to ${maxElev} ${elevUnit}`;
  return null;
}

/**
 * Format group size display
 */
export function formatGroupSize(
  minSize?: number,
  maxSize?: number,
  fallbackMax?: number
): string | null {
  if (minSize && maxSize) {
    return `${minSize}-${maxSize} people`;
  }
  if (minSize) return `${minSize}+ people`;
  if (maxSize) return `Up to ${maxSize} people`;
  if (fallbackMax) return `1-${fallbackMax} people`;
  return null;
}

/**
 * Get rating percentage for visual display
 */
export function getRatingPercentage(rating?: number): number {
  if (!rating) return 0;
  return Math.min((rating / 5) * 100, 100);
}

/**
 * Format rating display
 */
export function formatRating(
  rating?: number,
  reviewCount?: number
): string | null {
  if (!rating && !reviewCount) return null;
  if (rating && reviewCount) {
    return `${rating.toFixed(1)} (${formatReviewCount(reviewCount)})`;
  }
  if (rating) return rating.toFixed(1);
  return null;
}

/**
 * Format review count (e.g., 4500 -> 4.5k)
 */
export function formatReviewCount(count?: number): string {
  if (!count) return "0";
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

/**
 * Get difficulty color for UI
 */
export function getDifficultyColor(
  difficulty?: string
): string {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "bg-green-100 text-green-800";
    case "moderate":
      return "bg-yellow-100 text-yellow-800";
    case "hard":
      return "bg-orange-100 text-orange-800";
    case "expert":
      return "bg-red-100 text-red-800";
    case "extreme":
      return "bg-red-200 text-red-900";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

/**
 * Get activity icon (can be extended)
 */
export function getActivityIcon(activity: string): string {
  const iconMap: Record<string, string> = {
    Hiking: "🥾",
    Trekking: "⛰️",
    "Mountain Climbing": "🧗",
    Photography: "📸",
    Kayaking: "🛶",
    Camping: "⛺",
    "Wildlife Safari": "🦁",
    "Cultural Tour": "🏛️",
    Beach: "🏖️",
    "City Tour": "🏙️",
    "Food & Wine": "🍷",
  };
  return iconMap[activity] || "📍";
}

/**
 * Parse comma-separated string to array
 */
export function parseStringToArray(value?: string): string[] {
  if (!value) return [];
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

/**
 * Convert array to comma-separated string
 */
export function parseArrayToString(value?: string[]): string {
  if (!value) return "";
  return value.join(", ");
}

/**
 * Prepare trip data for API submission
 * Converts string numbers to actual numbers, parses arrays, etc.
 */
export function prepareTripDataForAPI(data: Record<string, unknown>): Partial<Trip> {
  const prepared: Partial<Trip> = { ...data };

  // Convert string numbers to numbers
  if (typeof data.budget === "string") {
    prepared.budget = parseFloat(data.budget);
  }
  if (typeof data.distanceMin === "string" && data.distanceMin) {
    prepared.distanceMin = parseFloat(data.distanceMin);
  }
  if (typeof data.distanceMax === "string" && data.distanceMax) {
    prepared.distanceMax = parseFloat(data.distanceMax);
  }
  if (typeof data.durationMinHours === "string" && data.durationMinHours) {
    prepared.durationMinHours = parseFloat(data.durationMinHours);
  }
  if (typeof data.durationMaxHours === "string" && data.durationMaxHours) {
    prepared.durationMaxHours = parseFloat(data.durationMaxHours);
  }
  if (typeof data.groupSize === "string" && data.groupSize) {
    prepared.groupSize = parseFloat(data.groupSize);
  }
  if (typeof data.groupSizeMin === "string" && data.groupSizeMin) {
    prepared.groupSizeMin = parseFloat(data.groupSizeMin);
  }
  if (typeof data.groupSizeMax === "string" && data.groupSizeMax) {
    prepared.groupSizeMax = parseFloat(data.groupSizeMax);
  }
  if (typeof data.elevationMin === "string" && data.elevationMin) {
    prepared.elevationMin = parseFloat(data.elevationMin);
  }
  if (typeof data.elevationMax === "string" && data.elevationMax) {
    prepared.elevationMax = parseFloat(data.elevationMax);
  }

  // Parse comma-separated arrays
  if (typeof data.activities === "string" && data.activities) {
    prepared.activities = parseStringToArray(data.activities);
  }
  if (typeof data.highlights === "string" && data.highlights) {
    prepared.highlights = parseStringToArray(data.highlights);
  }
  if (typeof data.accommodationType === "string" && data.accommodationType) {
    prepared.accommodationType = parseStringToArray(data.accommodationType);
  }
  if (typeof data.inclusions === "string" && data.inclusions) {
    prepared.inclusions = parseStringToArray(data.inclusions);
  }
  if (typeof data.exclusions === "string" && data.exclusions) {
    prepared.exclusions = parseStringToArray(data.exclusions);
  }

  // Convert boolean strings
  if (typeof data.guideIncluded === "string") {
    prepared.guideIncluded = data.guideIncluded === "true";
  }
  if (typeof data.mealsIncluded === "string") {
    prepared.mealsIncluded = data.mealsIncluded === "true";
  }
  if (typeof data.hasGroupChat === "string") {
    prepared.hasGroupChat = data.hasGroupChat === "true";
  }
  if (typeof data.isPublic === "string") {
    prepared.isPublic = data.isPublic === "true";
  }

  return prepared;
}

/**
 * Check if trip has enhanced details
 */
export function hasEnhancedDetails(trip: Trip): boolean {
  return !!(
    trip.difficulty ||
    trip.activities?.length ||
    trip.highlights?.length ||
    trip.averageRating ||
    trip.routeHighlights?.length ||
    trip.guideIncluded ||
    trip.mealsIncluded
  );
}

/**
 * Get trip completeness percentage
 */
export function getTripCompletenessPercentage(trip: Trip): number {
  let fieldsPresent = 0;
  let totalFields = 0;

  const essentialFields: (keyof Trip)[] = [
    "title",
    "description",
    "destination",
    "startDate",
    "endDate",
    "budget",
  ];
  const enhancedFields: (keyof Trip)[] = [
    "difficulty",
    "highlights",
    "activities",
    "bestSeason",
    "guideIncluded",
    "mealsIncluded",
    "accommodationType",
    "images",
    "averageRating",
  ];

  // Check essential fields
  essentialFields.forEach((field) => {
    totalFields++;
    if (trip[field]) fieldsPresent++;
  });

  // Check enhanced fields
  enhancedFields.forEach((field) => {
    totalFields++;
    if (trip[field]) fieldsPresent++;
  });

  return Math.round((fieldsPresent / totalFields) * 100);
}

/**
 * Get trip summary for quick view
 */
export function getTripSummary(trip: Trip): string {
  const parts: string[] = [];

  if (trip.difficulty) parts.push(`Difficulty: ${trip.difficulty}`);
  if (trip.destination) parts.push(`Destination: ${trip.destination}`);
  const duration = getTripDurationDays(trip);
  if (duration) parts.push(`Duration: ${duration} days`);
  if (trip.budget) parts.push(`Budget: $${trip.budget}`);

  return parts.join(" | ");
}

/**
 * Validate trip data before submission
 */
export function validateTripData(data: Partial<Trip>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Essential validations
  if (!data.destination) errors.push("Destination is required");
  if (!data.startDate) errors.push("Start date is required");
  if (!data.endDate) errors.push("End date is required");
  if (!data.budget || data.budget <= 0) errors.push("Valid budget is required");

  // Date validations
  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (end <= start) errors.push("End date must be after start date");
  }

  // Enhanced field validations
  if (
    data.distanceMin &&
    data.distanceMax &&
    data.distanceMin > data.distanceMax
  ) {
    errors.push("Min distance cannot be greater than max distance");
  }

  if (
    data.durationMinHours &&
    data.durationMaxHours &&
    data.durationMinHours > data.durationMaxHours
  ) {
    errors.push("Min duration cannot be greater than max duration");
  }

  if (data.groupSizeMin && data.groupSizeMax && data.groupSizeMin > data.groupSizeMax) {
    errors.push("Min group size cannot be greater than max group size");
  }

  if (data.elevationMin && data.elevationMax && data.elevationMin > data.elevationMax) {
    errors.push("Min elevation cannot be greater than max elevation");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
