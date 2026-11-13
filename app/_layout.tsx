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
import { Platform, View } from 'react-native';
import { AuthProvider } from '@/src/auth/AuthProvider';
import { DemoBanner } from '@/src/components/layout/DemoBanner';
import { isDemo, isMocksEnabled } from '@/src/config/demo';
import { QueryProvider } from '@/src/query/QueryProvider';
import '@/src/i18n';
import '../global.css';

function MocksProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element | null {
  // Without mocks there is nothing to wait for: ready from the first render.
  const [isReady, setIsReady] = useState(!isMocksEnabled);

  useEffect(() => {
    if (!isMocksEnabled) return;

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
  const [hasLoadedFonts, fontError] = useFonts({
    dmSerifDisplay: DMSerifDisplay_400Regular,
    interRegular: Inter_400Regular,
    interMedium: Inter_500Medium,
    interSemiBold: Inter_600SemiBold,
    interBold: Inter_700Bold,
  });

  // Wait for the fonts to avoid a flash of system font — but if they fail to
  // load, render anyway (system font fallback) instead of a blank screen.
  if (!hasLoadedFonts && !fontError) return null;

  return (
    <MocksProvider>
      <QueryProvider>
        <AuthProvider>
          <View className="flex-1 bg-page">
            {/* The public demo is a web target; native preview builds (also
                on the mocks) only reach testers who know it. */}
            {isDemo && Platform.OS === 'web' && <DemoBanner />}
            <Stack screenOptions={{ headerShown: false }} />
          </View>
        </AuthProvider>
      </QueryProvider>
    </MocksProvider>
  );
}
