import { configureBfinApi } from '@igorguariroba/bfin-sdk';

/**
 * Configura o SDK do BFIN com as configurações de autenticação e URL
 */
export function initializeSdk() {
  const token = localStorage.getItem('@bfin:token');

  configureBfinApi({
    baseUrl: '', // O SDK já inclui /api/v1 nas rotas, então deixamos vazio para usar o proxy do Vite
    token: token || undefined,
    onTokenExpired: async () => {
      // Tentar refresh do token
      const refreshToken = localStorage.getItem('@bfin:refreshToken');

      if (refreshToken) {
        try {
          // Importar dinamicamente para evitar dependência circular
          const { getAuthentication } = await import('@igorguariroba/bfin-sdk');
          const authApi = getAuthentication();

          const response = await authApi.postApiV1AuthRefresh({
            refresh_token: refreshToken,
          });

          if (!response.access_token) {
            throw new Error('Token não recebido');
          }

          // Atualizar token
          localStorage.setItem('@bfin:token', response.access_token);

          // Reconfigurar SDK com novo token
          configureBfinApi({
            token: response.access_token,
          });
        } catch (error) {
          // Refresh falhou, fazer logout
          clearAuth();
        }
      } else {
        clearAuth();
      }
    },
    onUnauthorized: () => {
      // Redirecionar para login
      clearAuth();
    },
  });
}

/**
 * Atualiza o token no SDK
 */
export function updateSdkToken(token: string) {
  configureBfinApi({ token });
}

/**
 * Limpa autenticação e redireciona para login
 */
function clearAuth() {
  localStorage.removeItem('@bfin:token');
  localStorage.removeItem('@bfin:refreshToken');
  localStorage.removeItem('@bfin:user');

  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}
