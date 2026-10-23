import type { JSX } from 'react';
import { Text } from 'react-native';

interface LogoProps {
  className?: string;
  /** "inverse" = white + indigo, for the dark sidebar. */
  variant?: 'default' | 'inverse';
}

/** "Prio" in the text color, "zen" in the accent color — as in the mockup. */
export function Logo({
  className = '',
  variant = 'default',
}: LogoProps): JSX.Element {
  const isInverse = variant === 'inverse';
  return (
    <Text
      className={`font-serif tracking-tight ${isInverse ? 'text-white' : 'text-text'} ${className}`}
    >
      Prio
      <Text className={isInverse ? 'text-sidebar-accent' : 'text-primary'}>
        zen
      </Text>
    </Text>
  );
}
