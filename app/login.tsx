import { Link, router } from 'expo-router';
import type { JSX } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useAuth } from '@/src/auth/AuthProvider';
import type { LoginErrorKey, LoginFieldErrors } from '@/src/auth/loginForm';
import { getLoginErrorKey, validateLoginForm } from '@/src/auth/loginForm';
import { AuthCard } from '@/src/components/AuthCard';
import { Button } from '@/src/components/ui/Button';
import { Logo } from '@/src/components/ui/Logo';
import { TextField } from '@/src/components/ui/TextField';

export default function LoginScreen(): JSX.Element {
  const { t } = useTranslation('auth');
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [submitError, setSubmitError] = useState<LoginErrorKey | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (): Promise<void> => {
    const errors = validateLoginForm(email, password);
    setFieldErrors(errors);
    setSubmitError(null);
    if (errors.email ?? errors.password) return;

    setIsLoading(true);
    try {
      await signIn({ email: email.trim(), password });
      router.replace('/');
    } catch (error: unknown) {
      setSubmitError(getLoginErrorKey(error));
      setIsLoading(false);
    }
  };

  return (
    <AuthCard>
      <Logo className="mb-1 text-center text-[28px]" />
      <Text className="mb-7 text-center font-sans text-[13px] text-muted">
        {t('login.tagline')}
      </Text>

      {submitError ? (
        <View
          accessibilityRole="alert"
          className="mb-4 rounded-sm border border-critical/40 bg-critical-bg px-3.5 py-2.5"
        >
          <Text className="font-sans text-[13px] text-critical">
            ⚠ {t(submitError)}
          </Text>
        </View>
      ) : null}

      <TextField
        label={t('login.emailLabel')}
        value={email}
        onChangeText={(value: string): void => {
          setEmail(value);
          setFieldErrors((current) => ({ ...current, email: undefined }));
        }}
        error={fieldErrors.email ? t(fieldErrors.email) : null}
        placeholder={t('login.emailPlaceholder')}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
      />
      <TextField
        label={t('login.passwordLabel')}
        value={password}
        onChangeText={(value: string): void => {
          setPassword(value);
          setFieldErrors((current) => ({ ...current, password: undefined }));
        }}
        error={fieldErrors.password ? t(fieldErrors.password) : null}
        placeholder={t('login.passwordPlaceholder')}
        isSecret
        autoCapitalize="none"
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={(): void => void handleSubmit()}
      />

      <View className="mb-1 items-end">
        <Link
          href="/forgot-password"
          className="font-sans-medium text-[13px] text-primary"
        >
          {t('login.forgotPassword')}
        </Link>
      </View>

      <Button
        label={t('login.submit')}
        isLoading={isLoading}
        onPress={(): void => void handleSubmit()}
        className="mt-2"
      />

      <Text className="mt-5 text-center font-sans text-[13px] text-muted">
        {t('login.noAccount')}{' '}
        <Link href="/register" className="font-sans-medium text-primary">
          {t('login.signUp')}
        </Link>
      </Text>
    </AuthCard>
  );
}
