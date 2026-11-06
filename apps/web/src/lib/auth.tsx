import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, ApiError, type AuthUser } from './api';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<AuthUser>;
  register: (input: {
    username: string;
    email: string;
    password: string;
    displayName: string;
  }) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refresh: () => Promise<unknown>;
  setUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        const data = await api.me();
        return data.user;
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) return null;
        throw error;
      }
    },
    staleTime: 60_000
  });

  const loginMutation = useMutation({
    mutationFn: ({ identifier, password }: { identifier: string; password: string }) =>
      api.login({ identifier, password }),
    onSuccess: (data) => {
      queryClient.setQueryData(['me'], data.user);
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });

  const registerMutation = useMutation({
    mutationFn: api.register,
    onSuccess: (data) => {
      queryClient.setQueryData(['me'], data.user);
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      user: meQuery.data ?? null,
      loading: meQuery.isLoading,
      login: async (identifier, password) => (await loginMutation.mutateAsync({ identifier, password })).user,
      register: async (input) => (await registerMutation.mutateAsync(input)).user,
      logout: async () => {
        await api.logout();
        queryClient.setQueryData(['me'], null);
        queryClient.clear();
        queryClient.setQueryData(['me'], null);
      },
      refresh: () => queryClient.invalidateQueries({ queryKey: ['me'] }),
      setUser: (user) => queryClient.setQueryData(['me'], user)
    }),
    [meQuery.data, meQuery.isLoading, loginMutation, registerMutation, queryClient]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
}
