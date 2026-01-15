import { configureBfinApi } from '@igorguariroba/bfin-sdk';

/**
 * Obtém a URL base da API
 * Em desenvolvimento: usa o proxy do Vite (string vazia)
 * Em produção: usa a variável de ambiente VITE_API_BASE_URL
 */
const getApiBaseUrl = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  if (apiBaseUrl) {
    // Em produção, usar a URL completa do backend
    // O SDK já inclui /api/v1 nas rotas, então só precisamos da base
    return apiBaseUrl;
  }

  // Em desenvolvimento, usar o proxy do Vite (string vazia)
  return '';
};

/**
 * Configura o SDK do BFIN com as configurações de autenticação e URL
 */
export function initializeSdk() {
  const token = localStorage.getItem('@bfin:token');

  configureBfinApi({
    baseUrl: getApiBaseUrl(), // O SDK já inclui /api/v1 nas rotas
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
