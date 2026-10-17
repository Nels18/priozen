import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { ComingSoon } from '@/src/components/ComingSoon';

export default function ForgotPasswordScreen(): JSX.Element {
  const { t } = useTranslation('auth');
  return <ComingSoon title={t('forgotPassword.title')} ticket="AUTH-03" />;
}
