import { format, parseISO, formatDistance, differenceInDays, isAfter, isBefore, isToday, isTomorrow, isYesterday } from "date-fns";

/**
 * Format a date string to a readable format
 * @param dateString - ISO date string
 * @param formatStr - Format pattern (default: "MMM d, yyyy")
 * @returns Formatted date string
 */
export const formatDate = (dateString: string, formatStr = "MMM d, yyyy"): string => {
  try {
    return format(parseISO(dateString), formatStr);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

/**
 * Format a date range
 * @param startDate - Start date ISO string
 * @param endDate - End date ISO string
 * @returns Formatted date range string
 */
export const formatDateRange = (startDate: string, endDate: string): string => {
  try {
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    return `${start} - ${end}`;
  } catch (error) {
    console.error("Error formatting date range:", error);
    return `${startDate} - ${endDate}`;
  }
};

/**
 * Format date with time
 * @param dateString - ISO date string
 * @returns Formatted date with time
 */
export const formatDateTime = (dateString: string): string => {
  return formatDate(dateString, "MMM d, yyyy 'at' h:mm a");
};

/**
 * Format date to relative time (e.g., "2 days ago", "in 3 hours")
 * @param dateString - ISO date string
 * @returns Relative time string
 */
export const formatRelativeTime = (dateString: string): string => {
  try {
    return formatDistance(parseISO(dateString), new Date(), { addSuffix: true });
  } catch (error) {
    console.error("Error formatting relative time:", error);
    return dateString;
  }
};

/**
 * Get trip duration in days
 * @param startDate - Start date ISO string
 * @param endDate - End date ISO string
 * @returns Number of days
 */
export const getTripDuration = (startDate: string, endDate: string): number => {
  try {
    return differenceInDays(parseISO(endDate), parseISO(startDate)) + 1;
  } catch (error) {
    console.error("Error calculating trip duration:", error);
    return 0;
  }
};

/**
 * Check if a date is in the past
 * @param dateString - ISO date string
 * @returns True if date is in the past
 */
export const isPastDate = (dateString: string): boolean => {
  try {
    return isBefore(parseISO(dateString), new Date());
  } catch {
    return false;
  }
};

/**
 * Check if a date is in the future
 * @param dateString - ISO date string
 * @returns True if date is in the future
 */
export const isFutureDate = (dateString: string): boolean => {
  try {
    return isAfter(parseISO(dateString), new Date());
  } catch {
    return false;
  }
};

/**
 * Check if trip is ongoing
 * @param startDate - Start date ISO string
 * @param endDate - End date ISO string
 * @returns True if trip is currently ongoing
 */
export const isTripOngoing = (startDate: string, endDate: string): boolean => {
  try {
    const now = new Date();
    return isAfter(now, parseISO(startDate)) && isBefore(now, parseISO(endDate));
  } catch {
    return false;
  }
};

/**
 * Get trip status based on dates
 * @param startDate - Start date ISO string
 * @param endDate - End date ISO string
 * @returns Trip status string
 */
export const getTripStatus = (startDate: string, endDate: string): "upcoming" | "ongoing" | "completed" => {
  if (isTripOngoing(startDate, endDate)) return "ongoing";
  if (isPastDate(endDate)) return "completed";
  return "upcoming";
};

/**
 * Format date with context (Today, Tomorrow, Yesterday, or date)
 * @param dateString - ISO date string
 * @returns Contextual date string
 */
export const formatDateWithContext = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isYesterday(date)) return "Yesterday";
    return formatDate(dateString);
  } catch {
    return formatDate(dateString);
  }
};

/**
 * Get month and year
 * @param dateString - ISO date string
 * @returns Month and year string
 */
export const formatMonthYear = (dateString: string): string => {
  return formatDate(dateString, "MMMM yyyy");
};

/**
 * Get day of week
 * @param dateString - ISO date string
 * @returns Day of week
 */
export const formatDayOfWeek = (dateString: string): string => {
  return formatDate(dateString, "EEEE");
};

/**
 * Format date for input fields (YYYY-MM-DD)
 * @param dateString - ISO date string
 * @returns Date string in YYYY-MM-DD format
 */
export const formatDateForInput = (dateString: string): string => {
  return formatDate(dateString, "yyyy-MM-dd");
};

/**
 * Get days until date
 * @param dateString - ISO date string
 * @returns Number of days (negative if past)
 */
export const getDaysUntil = (dateString: string): number => {
  try {
    return differenceInDays(parseISO(dateString), new Date());
  } catch {
    return 0;
  }
};
