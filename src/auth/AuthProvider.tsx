import type { JSX, ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { AuthSession, LoginCredentials } from '../api/auth';
import { login } from '../api/auth';

interface AuthContextValue {
  session: AuthSession | null;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => void;
}

const authContext = createContext<AuthContextValue | null>(null);

// Session lives in memory only for the POC: a reload logs the user out.
// Persisting the token (SecureStore / localStorage) comes with the real backend.
export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [session, setSession] = useState<AuthSession | null>(null);

  const signIn = useCallback(
    async (credentials: LoginCredentials): Promise<void> => {
      setSession(await login(credentials));
    },
    [],
  );

  const signOut = useCallback((): void => {
    setSession(null);
  }, []);

  const value = useMemo(
    (): AuthContextValue => ({ session, signIn, signOut }),
    [session, signIn, signOut],
  );

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(authContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
};
