import { Link } from 'expo-router';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import { AuthCard } from './AuthCard';

interface ComingSoonProps {
  title: string;
  ticket: string;
}

/** Temporary auth screen until its own ticket is delivered. */
export function ComingSoon({ title, ticket }: ComingSoonProps): JSX.Element {
  const { t } = useTranslation(['common', 'auth']);

  return (
    <AuthCard>
      <Text className="mb-2 text-center font-serif text-[22px] text-text">
        {title}
      </Text>
      <Text className="mb-6 text-center font-sans text-[13px] text-muted">
        {t('comingSoon', { ticket })}
      </Text>
      <Link
        href="/login"
        className="text-center font-sans-medium text-[13px] text-primary"
      >
        {t('auth:backToLogin')}
      </Link>
    </AuthCard>
  );
}
