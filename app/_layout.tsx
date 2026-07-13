import { Stack } from 'expo-router';
import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import '../global.css';

function MocksProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element | null {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
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

export default function RootLayout(): JSX.Element {
  return (
    <MocksProvider>
      <Stack />
    </MocksProvider>
  );
}
