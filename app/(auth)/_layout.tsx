import { Redirect, Slot } from 'expo-router';
import type { JSX } from 'react';
import { useAuth } from '@/src/auth/AuthProvider';
import { ROUTES } from '@/src/navigation/routes';

// Public auth screens (no app shell). A signed-in user has nothing to do
// here: send them to the app. Mirror of app/(protected)/_layout.tsx.
export default function AuthLayout(): JSX.Element {
  const { session } = useAuth();

  if (session) return <Redirect href={ROUTES.tasks} />;

  return <Slot />;
}
