import { Redirect, Slot } from 'expo-router';
import type { JSX } from 'react';
import { useAuth } from '@/src/auth/AuthProvider';
import { AppShell } from '@/src/components/layout/AppShell';
import { ROUTES } from '@/src/navigation/routes';

// Every route in (protected)/ requires a session and renders inside the app
// shell. Mirror of app/(auth)/_layout.tsx.
export default function ProtectedLayout(): JSX.Element {
  const { session } = useAuth();

  if (!session) return <Redirect href={ROUTES.login} />;

  return (
    <AppShell user={session.user}>
      <Slot />
    </AppShell>
  );
}
