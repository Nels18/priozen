import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, ComponentRef, JSX, Ref } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TextInputProps } from 'react-native';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useIconColors } from '@/src/theme/useIconColors';

interface TextFieldProps extends Omit<TextInputProps, 'secureTextEntry'> {
  label: string;
  error?: string | null;
  /** Masks the value and shows a show/hide toggle. */
  isSecret?: boolean;
  /** Shown after the label, muted ("(facultatif)"). */
  optionalLabel?: string;
  /** Decorative icon inside the field, on the left. */
  icon?: ComponentProps<typeof Ionicons>['name'];
  /** To move the focus to the field (e.g. on a validation error). */
  inputRef?: Ref<ComponentRef<typeof TextInput>>;
  /** Spacing around the field (default: margin below). */
  containerClassName?: string;
}

export function TextField({
  label,
  error,
  isSecret = false,
  optionalLabel,
  icon,
  inputRef,
  containerClassName = 'mb-4',
  multiline,
  ...inputProps
}: TextFieldProps): JSX.Element {
  const { t } = useTranslation();
  const iconColors = useIconColors();
  const [isFocused, setIsFocused] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const borderClass = error
    ? 'border-critical'
    : isFocused
      ? 'border-primary'
      : 'border-border';

  return (
    <View className={containerClassName}>
      <Text className="mb-1.5 font-sans-semibold text-caption text-text">
        {label}
        {optionalLabel && (
          <Text className="font-sans text-muted"> {optionalLabel}</Text>
        )}
      </Text>
      <View
        className={`flex-row rounded-sm border-[1.5px] bg-input ${
          multiline ? 'items-start' : 'items-center'
        } ${borderClass}`}
      >
        {icon && (
          <View className={`pl-3 ${multiline ? 'pt-3' : ''}`}>
            <Ionicons
              name={icon}
              aria-hidden
              size={20}
              color={iconColors.muted}
            />
          </View>
        )}
        <TextInput
          {...inputProps}
          ref={inputRef}
          multiline={multiline}
          accessibilityLabel={label}
          accessibilityHint={error ?? inputProps.accessibilityHint}
          secureTextEntry={isSecret && !isRevealed}
          onFocus={(event): void => {
            setIsFocused(true);
            inputProps.onFocus?.(event);
          }}
          onBlur={(event): void => {
            setIsFocused(false);
            inputProps.onBlur?.(event);
          }}
          placeholderTextColor={iconColors.muted}
          textAlignVertical={multiline ? 'top' : 'center'}
          className={`flex-1 px-3.5 py-2.5 font-sans text-sm text-text outline-none ${
            multiline ? 'min-h-20' : ''
          }`}
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
              color={iconColors.muted}
            />
          </Pressable>
        )}
      </View>
      {error ? (
        <View
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          className="mt-1.5 flex-row items-center gap-1.5"
        >
          <Ionicons
            name="alert-circle-outline"
            aria-hidden
            size={14}
            color={iconColors.critical}
          />
          <Text className="flex-1 font-sans text-xs text-critical">
            {error}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
