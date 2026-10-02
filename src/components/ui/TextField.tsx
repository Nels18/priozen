import Ionicons from '@expo/vector-icons/Ionicons';
import type { JSX } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TextInputProps } from 'react-native';
import { Pressable, Text, TextInput, View } from 'react-native';

interface TextFieldProps extends Omit<TextInputProps, 'secureTextEntry'> {
  label: string;
  error?: string | null;
  /** Masks the value and shows a show/hide toggle. */
  isSecret?: boolean;
}

export function TextField({
  label,
  error,
  isSecret = false,
  ...inputProps
}: TextFieldProps): JSX.Element {
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const borderClass = error
    ? 'border-critical'
    : isFocused
      ? 'border-primary'
      : 'border-border';

  return (
    <View className="mb-4">
      <Text className="mb-1.5 font-sans-semibold text-[13px] text-text">
        {label}
      </Text>
      <View
        className={`flex-row items-center rounded-sm border-[1.5px] bg-input ${borderClass}`}
      >
        <TextInput
          {...inputProps}
          accessibilityLabel={label}
          secureTextEntry={isSecret && !isRevealed}
          onFocus={(event): void => {
            setIsFocused(true);
            inputProps.onFocus?.(event);
          }}
          onBlur={(event): void => {
            setIsFocused(false);
            inputProps.onBlur?.(event);
          }}
          placeholderTextColor="rgb(100 116 139)"
          className="flex-1 px-3.5 py-2.5 font-sans text-sm text-text outline-none"
        />
        {isSecret && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              isRevealed ? t('hidePassword') : t('showPassword')
            }
            onPress={(): void => setIsRevealed((value) => !value)}
            hitSlop={8}
            className="px-3"
          >
            <Ionicons
              name={isRevealed ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="rgb(100 116 139)"
            />
          </Pressable>
        )}
      </View>
      {error ? (
        <Text className="mt-1 font-sans text-xs text-critical">{error}</Text>
      ) : null}
    </View>
  );
}
