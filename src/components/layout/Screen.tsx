import type { JSX, ReactNode } from 'react';
import { ScrollView } from 'react-native';
import { useScreenSize } from '@/src/layout/screenSize';

// Content padding from the mockup: 16px small, 28px medium, 32px large.
const PADDING = {
  small: 'p-4 pb-24', // leaves room for the FAB
  medium: 'p-7',
  large: 'p-8',
} as const;

/** Scrollable content area of an in-app screen (inside the AppShell). */
export function Screen({ children }: { children: ReactNode }): JSX.Element {
  const screenSize = useScreenSize();
  return (
    <ScrollView
      className="flex-1 bg-page"
      contentContainerClassName={PADDING[screenSize]}
    >
      {children}
    </ScrollView>
  );
}
