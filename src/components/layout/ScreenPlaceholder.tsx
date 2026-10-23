import type { JSX, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { Screen } from './Screen';

interface ScreenPlaceholderProps {
  ticket: string;
  children?: ReactNode;
}

/** In-app view not delivered yet: keeps navigation testable meanwhile. */
export function ScreenPlaceholder({
  ticket,
  children,
}: ScreenPlaceholderProps): JSX.Element {
  const { t } = useTranslation();
  return (
    <Screen>
      <View className="items-center rounded-md border border-border bg-card px-6 py-12">
        <Text className="text-center font-sans text-sm text-muted">
          {t('comingSoon', { ticket })}
        </Text>
        {children}
      </View>
    </Screen>
  );
}
