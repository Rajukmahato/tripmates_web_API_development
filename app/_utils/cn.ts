import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Get full URL for backend-served media paths
export function getMediaUrl(mediaPath?: string | null): string | null {
  if (!mediaPath) return null;

  if (mediaPath.startsWith('http://') || mediaPath.startsWith('https://')) {
    return mediaPath;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050';
  return `${baseUrl}${mediaPath.startsWith('/') ? '' : '/'}${mediaPath}`;
}

// Get full URL for profile image
export function getProfileImageUrl(profileImagePath?: string | null): string | null {
  const fullUrl = getMediaUrl(profileImagePath);
  if (!fullUrl) return null;

  // Add cache-busting parameter to force fresh fetch after backend header changes
  return fullUrl + '?v=2';
}
