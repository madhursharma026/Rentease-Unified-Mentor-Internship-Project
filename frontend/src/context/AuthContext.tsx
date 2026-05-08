import { gql } from '@apollo/client';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { createApolloClient } from '../lib/graphql';

type AuthUser = {
  name: string;
  email: string;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (input: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
};

const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user {
        name
        email
        role
      }
    }
  }
`;

const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      user {
        name
        email
        role
      }
    }
  }
`;

const ME = gql`
  query Me {
    me {
      name
      email
      role
    }
  }
`;

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('rentease_token') || '';
    if (!savedToken) {
      setReady(true);
      return;
    }
    setToken(savedToken);
    createApolloClient(savedToken)
      .query({ query: ME, fetchPolicy: 'no-cache' })
      .then((response) => setUser(response.data.me))
      .catch(() => {
        localStorage.removeItem('rentease_token');
        setToken('');
        setUser(null);
      })
      .finally(() => setReady(true));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      ready,
      async login(email, password) {
        const client = createApolloClient();
        const response = await client.mutate({ mutation: LOGIN, variables: { input: { email, password } } });
        const payload = response.data.login;
        localStorage.setItem('rentease_token', payload.accessToken);
        setToken(payload.accessToken);
        setUser(payload.user);
      },
      async signup(input) {
        const client = createApolloClient();
        const response = await client.mutate({ mutation: REGISTER, variables: { input } });
        const payload = response.data.register;
        localStorage.setItem('rentease_token', payload.accessToken);
        setToken(payload.accessToken);
        setUser(payload.user);
      },
      logout() {
        localStorage.removeItem('rentease_token');
        setToken('');
        setUser(null);
      }
    }),
    [ready, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
