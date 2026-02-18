import {
  getTripImageUrl,
  getTripDurationDays,
  getTotalParticipants,
  formatDistance,
  formatDuration,
  formatElevation,
  formatGroupSize,
  getRatingPercentage,
  formatRating,
  formatReviewCount,
  getDifficultyColor,
  getActivityIcon,
  parseStringToArray,
  parseArrayToString,
  prepareTripDataForAPI,
  hasEnhancedDetails,
  getTripCompletenessPercentage,
  getTripSummary,
  validateTripData,
} from '@/app/_utils/trip-helpers';
import type { Trip } from '@/app/_types/common.types';

const makeTrip = (overrides: Partial<Trip> = {}): Trip => ({
  _id: 'trip-1',
  description: 'A trip description',
  destination: 'Kathmandu',
  startDate: '2026-03-10T00:00:00.000Z',
  endDate: '2026-03-12T00:00:00.000Z',
  budget: 1000,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

describe('trip-helpers utils', () => {
  it('handles image URL generation', () => {
    expect(getTripImageUrl()).toBe('');
    expect(getTripImageUrl('https://cdn.example.com/a.jpg')).toBe('https://cdn.example.com/a.jpg');
    expect(getTripImageUrl('/uploads/trips/a.jpg')).toBe('http://localhost:5050/uploads/trips/a.jpg?v=2');
    expect(getTripImageUrl('uploads/trips/a.jpg')).toBe('http://localhost:5050/uploads/trips/a.jpg?v=2');
  });

  it('calculates duration and participant totals', () => {
    expect(getTripDurationDays(makeTrip())).toBe(2);
    expect(getTripDurationDays(makeTrip({ startDate: '' }))).toBe(0);

    const trip = {
      ...makeTrip(),
      creator: { _id: 'user-1' },
      members: [{ _id: 'user-1' }, { _id: 'user-2' }],
    };
    expect(getTotalParticipants(trip)).toBe(2);
  });

  it('formats distance variants', () => {
    expect(formatDistance(5, 10, 'KM')).toBe('5 to 10 KM');
    expect(formatDistance(5, undefined, 'mi')).toBe('5 mi');
    expect(formatDistance(undefined, 10, 'KM')).toBe('Up to 10 KM');
    expect(formatDistance()).toBeNull();
  });

  it('formats duration variants', () => {
    expect(formatDuration(2, 4)).toBe('2 to 4 hrs');
    expect(formatDuration(2)).toBe('2 hrs');
    expect(formatDuration(undefined, 4)).toBe('Up to 4 hrs');
    expect(formatDuration()).toBeNull();
  });

  it('formats elevation and group size variants', () => {
    expect(formatElevation(100, 300, 'm')).toBe('100 - 300 m');
    expect(formatElevation(undefined, 300, 'ft')).toBe('Up to 300 ft');
    expect(formatElevation()).toBeNull();

    expect(formatGroupSize(2, 8)).toBe('2-8 people');
    expect(formatGroupSize(3)).toBe('3+ people');
    expect(formatGroupSize(undefined, 8)).toBe('Up to 8 people');
    expect(formatGroupSize(undefined, undefined, 12)).toBe('1-12 people');
    expect(formatGroupSize()).toBeNull();
  });

  it('formats rating percentage, rating text, and review counts', () => {
    expect(getRatingPercentage(6)).toBe(100);
    expect(getRatingPercentage()).toBe(0);

    expect(formatRating(4.56, 4500)).toBe('4.6 (4.5k)');
    expect(formatRating(4.56)).toBe('4.6');
    expect(formatRating()).toBeNull();

    expect(formatReviewCount(1450)).toBe('1.4k');
    expect(formatReviewCount(12)).toBe('12');
    expect(formatReviewCount()).toBe('0');
  });

  it('maps difficulty colors and activity icons', () => {
    expect(getDifficultyColor('Easy')).toBe('bg-green-100 text-green-800');
    expect(getDifficultyColor('Unknown')).toBe('bg-gray-100 text-gray-800');
    expect(getActivityIcon('Hiking')).toBe('🥾');
    expect(getActivityIcon('Unknown')).toBe('📍');
  });

  it('parses and formats activity data', () => {
    expect(parseStringToArray(' hike, camp ,  ,photo ')).toEqual(['hike', 'camp', 'photo']);
    expect(parseStringToArray()).toEqual([]);
    expect(parseArrayToString(['hike', 'camp'])).toBe('hike, camp');
    expect(parseArrayToString()).toBe('');
  });

  it('prepares API payload with type conversions', () => {
    const prepared = prepareTripDataForAPI({
      budget: '1500',
      distanceMin: '10',
      activities: 'Hiking, Trekking',
      guideIncluded: 'true',
      isPublic: 'false',
    });

    expect(prepared.budget).toBe(1500);
    expect(prepared.distanceMin).toBe(10);
    expect(prepared.activities).toEqual(['Hiking', 'Trekking']);
    expect(prepared.guideIncluded).toBe(true);
    expect(prepared.isPublic).toBe(false);
  });

  it('keeps empty numeric-like fields unchanged during preparation', () => {
    const prepared = prepareTripDataForAPI({
      distanceMin: '',
      groupSizeMax: '',
      elevationMin: '',
    });

    expect(prepared.distanceMin).toBe('');
    expect(prepared.groupSizeMax).toBe('');
    expect(prepared.elevationMin).toBe('');
  });

  it('detects enhanced details and completeness', () => {
    expect(hasEnhancedDetails(makeTrip({ difficulty: 'Moderate' }))).toBe(true);
    expect(hasEnhancedDetails(makeTrip())).toBe(false);

    expect(getTripCompletenessPercentage(makeTrip())).toBe(33);
    expect(
      getTripCompletenessPercentage(
        makeTrip({
          title: 'Everest Base Camp',
          difficulty: 'Hard',
          highlights: ['Kala Patthar'],
          activities: ['Trekking'],
          bestSeason: 'Spring',
          guideIncluded: true,
          mealsIncluded: true,
          accommodationType: ['Lodge'],
          images: ['a.jpg'],
          averageRating: 4.7,
        })
      )
    ).toBe(100);
  });

  it('builds trip summary from available fields', () => {
    const summary = getTripSummary(
      makeTrip({
        difficulty: 'Moderate',
        destination: 'Pokhara',
        startDate: '2026-03-10T00:00:00.000Z',
        endDate: '2026-03-14T00:00:00.000Z',
        budget: 900,
      })
    );

    expect(summary).toContain('Difficulty: Moderate');
    expect(summary).toContain('Destination: Pokhara');
    expect(summary).toContain('Duration: 4 days');
    expect(summary).toContain('Budget: $900');
  });

  it('validates successful trip payload', () => {
    const result = validateTripData(makeTrip());
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('validates required fields and range constraints', () => {
    const requiredFieldResult = validateTripData({});
    expect(requiredFieldResult.valid).toBe(false);
    expect(requiredFieldResult.errors).toEqual([
      'Destination is required',
      'Start date is required',
      'End date is required',
      'Valid budget is required',
    ]);

    const rangeResult = validateTripData({
      destination: 'Pokhara',
      startDate: '2026-03-10T00:00:00.000Z',
      endDate: '2026-03-09T00:00:00.000Z',
      budget: 100,
      distanceMin: 10,
      distanceMax: 5,
      durationMinHours: 8,
      durationMaxHours: 6,
      groupSizeMin: 10,
      groupSizeMax: 8,
      elevationMin: 3000,
      elevationMax: 2000,
    });

    expect(rangeResult.valid).toBe(false);
    expect(rangeResult.errors).toContain('End date must be after start date');
    expect(rangeResult.errors).toContain('Min distance cannot be greater than max distance');
    expect(rangeResult.errors).toContain('Min duration cannot be greater than max duration');
    expect(rangeResult.errors).toContain('Min group size cannot be greater than max group size');
    expect(rangeResult.errors).toContain('Min elevation cannot be greater than max elevation');
  });
});
