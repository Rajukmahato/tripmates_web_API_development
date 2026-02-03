import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Get full URL for profile image
export function getProfileImageUrl(profileImagePath?: string | null): string | null {
  if (!profileImagePath) return null;
  
  // If already a full URL, return as is
  if (profileImagePath.startsWith('http')) return profileImagePath;
  
  // Construct full URL with backend base URL
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050';
  return `${baseUrl}${profileImagePath}`;
}
