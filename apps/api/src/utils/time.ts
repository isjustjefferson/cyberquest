import { localDateKey, weekStartKey } from '@cyberquest/shared';

export function nowIso(): string {
  return new Date().toISOString();
}

export function userToday(timeZone: string, date = new Date()): string {
  try {
    return localDateKey(date, timeZone);
  } catch {
    return localDateKey(date, 'America/Sao_Paulo');
  }
}

export function currentWeekStart(date = new Date()): string {
  return weekStartKey(date);
}

export function userHour(timeZone: string, date = new Date()): number {
  try {
    return Number(
      new Intl.DateTimeFormat('en-US', { timeZone, hour: '2-digit', hour12: false }).format(date)
    );
  } catch {
    return date.getUTCHours();
  }
}
