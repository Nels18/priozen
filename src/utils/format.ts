import type { User } from '../types/models';

/** "samedi 18 octobre 2026" → "Samedi 18 octobre 2026" (header date). */
export const formatLongDate = (date: Date, language: string): string => {
  const formatted = new Intl.DateTimeFormat(language, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

/** "Martin Dupont" → "MD" (avatar). */
export const getInitials = (
  user: Pick<User, 'firstName' | 'lastName'>,
): string =>
  `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
