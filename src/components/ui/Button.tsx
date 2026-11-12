import type { JSX } from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import fixedColors from '@/src/theme/fixedColors';
import { useIconColors } from '@/src/theme/useIconColors';

type ButtonVariant = 'primary' | 'outline';

interface ButtonProps {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  /** primary: filled (main action); outline: bordered (cancel). */
  variant?: ButtonVariant;
  className?: string;
}

const VARIANT_CLASSES: Record<ButtonVariant, { box: string; label: string }> = {
  primary: {
    box: 'bg-primary active:bg-primary-hover',
    label: 'text-white',
  },
  outline: {
    box: 'border-[1.5px] border-border bg-transparent active:bg-input',
    label: 'text-text',
  },
};

export function Button({
  label,
  onPress,
  isLoading = false,
  variant = 'primary',
  className = '',
}: ButtonProps): JSX.Element {
  const iconColors = useIconColors();
  const classes = VARIANT_CLASSES[variant];

  return (
    <Pressable
      accessibilityRole="button"
      aria-disabled={isLoading}
      aria-busy={isLoading}
      disabled={isLoading}
      onPress={onPress}
      className={`h-12 items-center justify-center rounded-sm px-4 ${classes.box} ${
        isLoading ? 'opacity-70' : ''
      } ${className}`}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === 'primary' ? fixedColors.white : iconColors.muted}
        />
      ) : (
        <Text className={`font-sans-semibold text-[15px] ${classes.label}`}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
