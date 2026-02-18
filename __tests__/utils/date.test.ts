import {
  formatDate,
  formatDateRange,
  formatDateTime,
  formatRelativeTime,
  getTripDuration,
  isPastDate,
  isFutureDate,
  isTripOngoing,
  getTripStatus,
  formatDateWithContext,
  formatMonthYear,
  formatDayOfWeek,
  formatDateForInput,
  getDaysUntil,
} from '@/app/_utils/date';

describe('date utils', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-03-01T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('formats a valid date', () => {
    expect(formatDate('2026-03-10T00:00:00.000Z')).toBe('Mar 10, 2026');
  });

  it('formats a valid date using a custom format', () => {
    expect(formatDate('2026-03-10T00:00:00.000Z', 'yyyy/MM/dd')).toBe('2026/03/10');
  });

  it('returns input string when formatting fails', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(formatDate('not-a-date')).toBe('not-a-date');
    expect(spy).toHaveBeenCalled();
  });

  it('formats a date range', () => {
    expect(formatDateRange('2026-03-10T00:00:00.000Z', '2026-03-12T00:00:00.000Z')).toBe('Mar 10, 2026 - Mar 12, 2026');
  });

  it('formats date and time string', () => {
    expect(formatDateTime('2026-03-10T14:30:00.000Z')).toBe('Mar 10, 2026 at 8:15 PM');
  });

  it('formats relative time in past', () => {
    expect(formatRelativeTime('2026-02-27T12:00:00.000Z')).toBe('2 days ago');
  });

  it('returns input string when relative formatting fails', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(formatRelativeTime('invalid')).toBe('invalid');
    expect(spy).toHaveBeenCalled();
  });

  it('gets inclusive trip duration in days', () => {
    expect(getTripDuration('2026-03-10T00:00:00.000Z', '2026-03-12T00:00:00.000Z')).toBe(3);
  });

  it('identifies past and non-past dates', () => {
    expect(isPastDate('2026-02-28T12:00:00.000Z')).toBe(true);
    expect(isPastDate('2026-03-02T12:00:00.000Z')).toBe(false);
  });

  it('identifies future and non-future dates', () => {
    expect(isFutureDate('2026-03-02T12:00:00.000Z')).toBe(true);
    expect(isFutureDate('2026-02-28T12:00:00.000Z')).toBe(false);
  });

  it('detects ongoing and not-started trips', () => {
    expect(isTripOngoing('2026-02-28T00:00:00.000Z', '2026-03-03T00:00:00.000Z')).toBe(true);
    expect(isTripOngoing('2026-03-02T00:00:00.000Z', '2026-03-03T00:00:00.000Z')).toBe(false);
  });

  it('returns trip status values', () => {
    expect(getTripStatus('2026-02-28T00:00:00.000Z', '2026-03-03T00:00:00.000Z')).toBe('ongoing');
    expect(getTripStatus('2026-02-20T00:00:00.000Z', '2026-02-22T00:00:00.000Z')).toBe('completed');
    expect(getTripStatus('2026-03-20T00:00:00.000Z', '2026-03-25T00:00:00.000Z')).toBe('upcoming');
  });

  it('formats contextual dates for today, tomorrow, and yesterday', () => {
    expect(formatDateWithContext('2026-03-01T00:00:00.000Z')).toBe('Today');
    expect(formatDateWithContext('2026-03-02T00:00:00.000Z')).toBe('Tomorrow');
    expect(formatDateWithContext('2026-02-28T00:00:00.000Z')).toBe('Yesterday');
  });

  it('formats month, weekday, and input date', () => {
    expect(formatMonthYear('2026-03-10T00:00:00.000Z')).toBe('March 2026');
    expect(formatDayOfWeek('2026-03-10T00:00:00.000Z')).toBe('Tuesday');
    expect(formatDateForInput('2026-03-10T00:00:00.000Z')).toBe('2026-03-10');
  });

  it('gets days until future and past dates', () => {
    expect(getDaysUntil('2026-03-06T12:00:00.000Z')).toBe(5);
    expect(getDaysUntil('2026-02-27T12:00:00.000Z')).toBe(-2);
  });
});
