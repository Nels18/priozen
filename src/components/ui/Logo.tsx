import type { JSX } from 'react';
import { Text } from 'react-native';

interface LogoProps {
  className?: string;
}

/** "Prio" in the text color, "zen" in the primary color — as in the mockup. */
export function Logo({ className = '' }: LogoProps): JSX.Element {
  return (
    <Text className={`font-serif tracking-tight text-text ${className}`}>
      Prio<Text className="text-primary">zen</Text>
    </Text>
  );
}
