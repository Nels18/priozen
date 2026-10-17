import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import { AuthProvider } from '@/src/auth/AuthProvider';
import '@/src/i18n';
import '../global.css';

function MocksProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element | null {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const isMocksEnabled = process.env.EXPO_PUBLIC_USE_MOCKS
      ? process.env.EXPO_PUBLIC_USE_MOCKS === 'true'
      : process.env.NODE_ENV === 'development';

    if (!isMocksEnabled) {
      setIsReady(true);
      return;
    }

    import('@/src/mocks')
      .then(({ startMocks }) => startMocks())
      .then(() => setIsReady(true))
      .catch((error: unknown) => {
        console.error('Failed to start mocks', error);
        setIsReady(true);
      });
  }, []);

  if (!isReady) return null;

  return <>{children}</>;
}

export default function RootLayout(): JSX.Element | null {
  // Keys are the font family names used by tailwind.config.js (fontFamily).
  const [hasLoadedFonts] = useFonts({
    dmSerifDisplay: DMSerifDisplay_400Regular,
    interRegular: Inter_400Regular,
    interMedium: Inter_500Medium,
    interSemiBold: Inter_600SemiBold,
    interBold: Inter_700Bold,
  });

  if (!hasLoadedFonts) return null;

  return (
    <MocksProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </MocksProvider>
  );
}
