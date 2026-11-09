// Typed date field ("jj/mm/aaaa" in French, "mm/dd/yyyy" in English): the
// order of day, month and year follows the language, as people write it.

export type DatePart = 'day' | 'month' | 'year';

const DATE_PARTS: readonly string[] = ['day', 'month', 'year'];

/** Order of day, month and year in a numeric date for this language. */
export const getDateFieldOrder = (language: string): DatePart[] =>
  new Intl.DateTimeFormat(language, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
    .formatToParts(new Date(2026, 10, 23))
    .map((part) => part.type)
    .filter((type): type is DatePart => DATE_PARTS.includes(type));

const pad = (value: number): string => String(value).padStart(2, '0');

/** 23 Nov 2026 → "23/11/2026" (fr) or "11/23/2026" (en). */
export const formatDateField = (date: Date, language: string): string => {
  const values: Record<DatePart, string> = {
    day: pad(date.getDate()),
    month: pad(date.getMonth() + 1),
    year: String(date.getFullYear()),
  };
  return getDateFieldOrder(language)
    .map((part) => values[part])
    .join('/');
};

/**
 * Reads a typed date (local midnight). Accepts "/", "-" or "." between the
 * parts and one-digit days or months; the year needs its 4 digits.
 * Returns null when the text is not a real calendar date (31/02/2026…).
 */
export const parseDateField = (text: string, language: string): Date | null => {
  const pieces = text.trim().split(/[/.-]/);
  if (pieces.length !== 3 || pieces.some((piece) => !/^\d+$/.test(piece))) {
    return null;
  }

  const values = {} as Record<DatePart, number>;
  getDateFieldOrder(language).forEach((part, index) => {
    values[part] = Number(pieces[index]);
  });
  const yearPiece = pieces[getDateFieldOrder(language).indexOf('year')];
  if (yearPiece.length !== 4) return null;

  const date = new Date(values.year, values.month - 1, values.day);
  // new Date() rolls over invalid dates (31/02 → 3/03): reject those.
  const isSameDay =
    date.getFullYear() === values.year &&
    date.getMonth() === values.month - 1 &&
    date.getDate() === values.day;
  return isSameDay ? date : null;
};
