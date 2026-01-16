import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  getAuthentication,
  type User as SdkUser,
} from '@igorguariroba/bfin-sdk';
import { updateSdkToken } from '../config/sdk';

interface AxiosError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const authApi = getAuthentication();

type User = SdkUser;

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, full_name: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const loadUser = async () => {
      const token = localStorage.getItem('@bfin:token');
      const storedUser = localStorage.getItem('@bfin:user');

      if (token && storedUser) {
        try {
          // Validar token buscando dados do usuário
          const userData = await authApi.getApiV1AuthMe();
          setUser(userData);
        } catch (_error) {
          // Token inválido, limpar localStorage
          localStorage.removeItem('@bfin:token');
          localStorage.removeItem('@bfin:refreshToken');
          localStorage.removeItem('@bfin:user');
        }
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  async function signIn(email: string, password: string) {
    try {
      const response = await authApi.postApiV1AuthLogin({
        email,
        password,
      });

      if (!response.user || !response.tokens?.access_token || !response.tokens?.refresh_token) {
        throw new Error('Resposta inválida do servidor');
      }

      // Salvar no localStorage
      localStorage.setItem('@bfin:token', response.tokens.access_token);
      localStorage.setItem('@bfin:refreshToken', response.tokens.refresh_token);
      localStorage.setItem('@bfin:user', JSON.stringify(response.user));

      // Atualizar token no SDK
      updateSdkToken(response.tokens.access_token);

      setUser(response.user);
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      throw new Error(axiosError.response?.data?.message || 'Erro ao fazer login');
    }
  }

  async function signUp(email: string, password: string, full_name: string) {
    try {
      const response = await authApi.postApiV1AuthRegister({
        email,
        password,
        full_name,
      });

      if (!response.user || !response.tokens?.access_token || !response.tokens?.refresh_token) {
        throw new Error('Resposta inválida do servidor');
      }

      // Salvar no localStorage
      localStorage.setItem('@bfin:token', response.tokens.access_token);
      localStorage.setItem('@bfin:refreshToken', response.tokens.refresh_token);
      localStorage.setItem('@bfin:user', JSON.stringify(response.user));

      // Atualizar token no SDK
      updateSdkToken(response.tokens.access_token);

      setUser(response.user);
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      throw new Error(axiosError.response?.data?.message || 'Erro ao criar conta');
    }
  }

  function signOut() {
    // Limpar localStorage
    localStorage.removeItem('@bfin:token');
    localStorage.removeItem('@bfin:refreshToken');
    localStorage.removeItem('@bfin:user');

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
