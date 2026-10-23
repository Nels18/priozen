import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { ComingSoon } from '@/src/components/ComingSoon';

export default function RegisterScreen(): JSX.Element {
  const { t } = useTranslation('auth');
  return <ComingSoon title={t('register.title')} ticket="AUTH-02" />;
}
