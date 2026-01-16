import axios from 'axios';

// Obter URL base da API
// Em desenvolvimento: usa o proxy do Vite (/api/v1)
// Em produção: usa a variável de ambiente VITE_API_BASE_URL
const getBaseURL = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  if (apiBaseUrl) {
    // Em produção, usar a URL completa do backend
    return `${apiBaseUrl}/api/v1`;
  }

  // Em desenvolvimento, usar o proxy do Vite
  return '/api/v1';
};

// Criar instância do axios
const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@bfin:token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado, tentar refresh
      const refreshToken = localStorage.getItem('@bfin:refreshToken');

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${getBaseURL()}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          // Salvar novos tokens
          localStorage.setItem('@bfin:token', data.tokens.access_token);
          localStorage.setItem('@bfin:refreshToken', data.tokens.refresh_token);

          // Repetir requisição original
          error.config.headers.Authorization = `Bearer ${data.tokens.access_token}`;
          return api.request(error.config);
        } catch (_refreshError) {
          // Refresh falhou, fazer logout
          localStorage.removeItem('@bfin:token');
          localStorage.removeItem('@bfin:refreshToken');
          localStorage.removeItem('@bfin:user');
          window.location.href = '/login';
        }
      } else {
        // Sem refresh token, redirecionar para login
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
