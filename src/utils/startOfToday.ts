import { useEffect, useState } from 'react';

/** Midnight (local time) of the day containing `date`, as a timestamp. */
export const getStartOfDay = (date: Date): number =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/** Milliseconds from `date` to the next local midnight. */
export const getMsUntilNextDay = (date: Date): number => {
  const nextDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1,
  );
  return nextDay.getTime() - date.getTime();
};

/**
 * Start of the current day, updated at midnight. Lets date-based views
 * ("overdue", "today") roll over even when nothing else re-renders them.
 */
export const useStartOfToday = (): number => {
  const [startOfToday, setStartOfToday] = useState(() =>
    getStartOfDay(new Date()),
  );

  useEffect(() => {
    const timer = setTimeout(
      (): void => setStartOfToday(getStartOfDay(new Date())),
      // A second of margin so the timer never fires just before midnight.
      getMsUntilNextDay(new Date()) + 1000,
    );
    return (): void => clearTimeout(timer);
  }, [startOfToday]);

  return startOfToday;
};
