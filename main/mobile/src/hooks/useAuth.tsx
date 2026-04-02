import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { api } from '../services/api';
import type { Chef, AuthTokens } from '@shared/types';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  chef: Chef | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [chef, setChef] = useState<Chef | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restore() {
      await api.init();
      if (api.hasToken()) {
        try {
          const me = await api.get<Chef>('/chefs/me');
          setChef(me);
        } catch {
          // Token expired or invalid
        }
      }
      setIsLoading(false);
    }
    restore();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const tokens = await api.post<AuthTokens>('/auth/login', {
      email,
      password,
    });
    await api.setTokens(tokens.accessToken, tokens.refreshToken);
    const me = await api.get<Chef>('/chefs/me');
    setChef(me);
  }, []);

  const register = useCallback(
    async (email: string, password: string, displayName: string) => {
      const tokens = await api.post<AuthTokens>('/auth/register', {
        email,
        password,
        displayName,
      });
      await api.setTokens(tokens.accessToken, tokens.refreshToken);
      const me = await api.get<Chef>('/chefs/me');
      setChef(me);
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Best-effort logout
    }
    await api.clearTokens();
    setChef(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: chef !== null,
        isLoading,
        chef,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
