import { Icon } from '@/src/components/ui/Icon';
import type { JSX } from 'react';
import { Pressable } from 'react-native';

interface FabProps {
  label: string;
  onPress: () => void;
  /** Distance from the bottom edge, above the bottom nav. */
  bottom: number;
}

/** Round "+" button floating above the mobile bottom nav. */
export function Fab({ label, onPress, bottom }: FabProps): JSX.Element {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={{ bottom }}
      className="absolute right-5 h-[52px] w-[52px] items-center justify-center rounded-full bg-primary shadow-lg active:bg-primary-hover"
    >
      <Icon name="add" size={28} color="white" />
    </Pressable>
  );
}
