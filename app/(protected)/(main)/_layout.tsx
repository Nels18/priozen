import { Slot } from 'expo-router';
import type { JSX } from 'react';
import { useAuth } from '@/src/auth/AuthProvider';
import { AppShell } from '@/src/components/layout/AppShell';
import { useNewTaskShortcut } from '@/src/tasks/useNewTaskShortcut';

// Signed-in screens rendered inside the app shell. The session is guaranteed
// by app/(protected)/_layout.tsx.
export default function MainLayout(): JSX.Element | null {
  const { session } = useAuth();
  useNewTaskShortcut();

  if (!session) return null;

  return (
    <AppShell user={session.user}>
      <Slot />
    </AppShell>
  );
}
