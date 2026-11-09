import { Redirect, Stack } from 'expo-router';
import type { JSX } from 'react';
import { useAuth } from '@/src/auth/AuthProvider';
import { ROUTES } from '@/src/navigation/routes';

// A deep link to a modal (/tasks/new) still shows the app underneath.
// eslint-disable-next-line @typescript-eslint/naming-convention -- name required by expo-router
export const unstable_settings = { initialRouteName: '(main)' };

// Modal screens: transparent, so the app stays visible behind the scrim
// (on web too); each screen draws its own sheet or dialog.
const MODAL_OPTIONS = {
  presentation: 'transparentModal',
  animation: 'fade',
} as const;

// Every route in (protected)/ requires a session. (main)/ holds the screens
// inside the app shell; tasks/ holds the task modals stacked above them.
// Mirror of app/(auth)/_layout.tsx.
export default function ProtectedLayout(): JSX.Element {
  const { session } = useAuth();

  if (!session) return <Redirect href={ROUTES.login} />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(main)" />
      <Stack.Screen name="tasks/new" options={MODAL_OPTIONS} />
      <Stack.Screen name="tasks/[id]" options={MODAL_OPTIONS} />
    </Stack>
  );
}
