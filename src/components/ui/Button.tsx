import type { JSX } from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';

interface ButtonProps {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  className?: string;
}

export function Button({
  label,
  onPress,
  isLoading = false,
  className = '',
}: ButtonProps): JSX.Element {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isLoading, busy: isLoading }}
      disabled={isLoading}
      onPress={onPress}
      className={`h-12 items-center justify-center rounded-sm bg-primary active:bg-primary-hover ${
        isLoading ? 'opacity-70' : ''
      } ${className}`}
    >
      {isLoading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text className="font-sans-semibold text-[15px] text-white">
          {label}
        </Text>
      )}
    </Pressable>
  );
}
