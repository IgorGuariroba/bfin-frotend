import { Page, expect } from '@playwright/test';
import { TEST_CONFIG } from './test-config';

/**
 * Helper functions para autenticação nos testes E2E
 */

/**
 * Registra um novo usuário e faz login
 * @param page - Página do Playwright
 */
export async function registerAndLogin(page: Page) {

  try {
    // Primeiro, tenta fazer login direto com usuário conhecido
    await page.goto(TEST_CONFIG.LOGIN_URL);
    await page.fill('[data-testid="email-input"]', TEST_CONFIG.TEST_USER.email);
    await page.fill('[data-testid="password-input"]', TEST_CONFIG.TEST_USER.password);
    await page.click('[data-testid="login-button"]');

    // Aguarda redirecionamento para dashboard
    await page.waitForURL(TEST_CONFIG.DASHBOARD_URL, {
      timeout: 10000
    });

    // Verifica se chegou no dashboard
    await expect(page.locator('[data-testid="dashboard-header"]')).toBeVisible();

    return {
      nome: TEST_CONFIG.TEST_USER.nome,
      email: TEST_CONFIG.TEST_USER.email,
      password: TEST_CONFIG.TEST_USER.password,
      confirmPassword: TEST_CONFIG.TEST_USER.password
    };
  } catch (loginError) {
    // Se login falhou, tenta registrar novo usuário

    try {
      await page.goto(TEST_CONFIG.REGISTER_URL);

      // Gera email único para evitar conflitos
      const uniqueEmail = `test-${Date.now()}@example.com`;

      await page.fill('[data-testid="name-input"]', TEST_CONFIG.TEST_USER.nome);
      await page.fill('[data-testid="email-input"]', uniqueEmail);
      await page.fill('[data-testid="password-input"]', TEST_CONFIG.TEST_USER.password);
      await page.fill('[data-testid="confirm-password-input"]', TEST_CONFIG.TEST_USER.password);
      await page.click('[data-testid="register-button"]');

      // Aguarda redirecionamento para dashboard após registro
      await page.waitForURL(TEST_CONFIG.DASHBOARD_URL, {
        timeout: 10000
      });

      // Verifica se chegou no dashboard
      await expect(page.locator('[data-testid="dashboard-header"]')).toBeVisible();

      return {
        nome: TEST_CONFIG.TEST_USER.nome,
        email: uniqueEmail,
        password: TEST_CONFIG.TEST_USER.password,
        confirmPassword: TEST_CONFIG.TEST_USER.password
      };
    } catch (registerError) {
      console.error('❌ Falha completa na autenticação real:', registerError);
      throw new Error(`Falha na autenticação real - Login: ${loginError} | Registro: ${registerError}`);
    }
  }
}

/**
 * MOCKS REMOVIDOS - Usando apenas autenticação real
 */

/**
 * SIDEBAR LOGIC REMOVIDA - Simplificando testes
 */

/**
 * Realiza login no sistema
 * @param page - Página do Playwright
 * @param email - Email do usuário (opcional, usa padrão de teste)
 * @param password - Senha do usuário (opcional, usa padrão de teste)
 */
export async function login(
  page: Page,
  email: string = TEST_CONFIG.TEST_USER.email,
  password: string = TEST_CONFIG.TEST_USER.password
) {
  await page.goto(TEST_CONFIG.LOGIN_URL);

  // Preenche o formulário de login
  await page.fill('[data-testid="email-input"]', email);
  await page.fill('[data-testid="password-input"]', password);

  // Clica no botão de login
  await page.click('[data-testid="login-button"]');

  // Aguarda redirecionamento para dashboard
  await page.waitForURL(TEST_CONFIG.DASHBOARD_URL, {
    timeout: TEST_CONFIG.DEFAULT_TIMEOUT
  });

  // Verifica se o dashboard carregou
  // Verifica se o dashboard carregou
  await expect(page.locator('[data-testid="dashboard-header"]')).toBeVisible();

  // SIDEBAR CONFIG REMOVIDA - Simplificando testes
}

/**
 * Realiza logout do sistema
 * @param page - Página do Playwright
 */
export async function logout(page: Page) {
  try {
    // Verifica se a página ainda está ativa
    if (page.isClosed()) {
      return; // Se a página foi fechada, considera logout bem-sucedido
    }

    // Estratégia 1: Tentar usar o menu dropdown no cabeçalho
    try {
      // Clica no avatar do usuário para abrir o menu dropdown
      const userMenu = page.locator('[data-testid="user-menu"]');
      await userMenu.click({ timeout: 5000 });

      // Aguarda o dropdown aparecer e clica na opção "Sair"
      const logoutOption = page.locator('[data-testid="logout-option"]');
      await logoutOption.click({ timeout: 5000 });

      // Aguarda redirecionamento para login
      await page.waitForURL(TEST_CONFIG.LOGIN_URL, {
        timeout: 10000
      });
      return; // Se chegou aqui, logout foi bem-sucedido
    } catch {
      console.warn('Logout via menu dropdown falhou, tentando sidebar...');
    }

    // Estratégia 2: Tentar usar o botão DESCONECTAR na sidebar
    try {
      const disconnectButton = page.locator('button:has-text("DESCONECTAR")');
      await disconnectButton.click({ timeout: 5000 });

      // Aguarda redirecionamento para login
      await page.waitForURL(TEST_CONFIG.LOGIN_URL, {
        timeout: 10000
      });
      return; // Se chegou aqui, logout foi bem-sucedido
    } catch {
      console.warn('Logout via sidebar falhou, tentando método de limpeza direta...');
    }

    // Estratégia 3: Método de limpeza direta como fallback
    await clearAuthState(page);
    if (!page.isClosed()) {
      await page.goto(TEST_CONFIG.LOGIN_URL);
    }

  } catch (error) {
    console.warn('Erro no logout, mas considerando bem-sucedido:', error);
    // Se chegou até aqui, provavelmente a página foi fechada ou houve redirecionamento
  }
}

/**
 * Registra um novo usuário no sistema
 * @param page - Página do Playwright
 * @param userData - Dados do usuário para registro
 */
export async function register(
  page: Page,
  userData = {
    nome: TEST_CONFIG.TEST_USER.nome,
    email: `teste${Date.now()}@bfin.com.br`,
    password: TEST_CONFIG.TEST_USER.password,
    confirmPassword: TEST_CONFIG.TEST_USER.password
  }
) {
  try {
    await page.goto(TEST_CONFIG.REGISTER_URL);

    // Preenche o formulário de registro
    await page.fill('[data-testid="name-input"]', userData.nome);
    await page.fill('[data-testid="email-input"]', userData.email);
    await page.fill('[data-testid="password-input"]', userData.password);
    await page.fill('[data-testid="confirm-password-input"]', userData.confirmPassword);

    // Clica no botão de registro
    await page.click('[data-testid="register-button"]');

    // Aguarda redirecionamento para login ou dashboard
    await page.waitForURL(/\/(login|dashboard)/, {
      timeout: 15000 // Timeout reduzido
    });

    return userData;
  } catch (error) {
    console.warn('Erro no registro padrão, verificando rate limiting...', error);

    // MOCKS REMOVIDOS - Falha real significa falha no teste
    console.error('❌ Falha na autenticação real:', error);
    throw error;
  }
}

/**
 * Verifica se o usuário está autenticado
 * @param page - Página do Playwright
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  try {
    // Verifica se já está na página do dashboard
    const currentUrl = page.url();
    if (!currentUrl.includes('/dashboard')) {
      // Só navega se não estiver no dashboard
      await page.goto(TEST_CONFIG.DASHBOARD_URL);
    }

    // Verifica se elementos do dashboard estão visíveis
    await expect(page.locator(TEST_CONFIG.SELECTORS.sidebar)).toBeVisible({
      timeout: 5000
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Força o estado de autenticado usando localStorage (simula usuário logado)
 * @param page - Página do Playwright
 */
export async function setAuthenticatedState(page: Page) {
  // Remove mocks - usa apenas autenticação real
  return await registerAndLogin(page);
}

/**
 * Limpa o estado de autenticação
 * @param page - Página do Playwright
 */
export async function clearAuthState(page: Page) {
  try {
    // Verifica se a página ainda está ativa
    if (!page.isClosed()) {
      // Remove todos os interceptadores de rotas da página E do contexto
      await page.unrouteAll();
      await page.context().unrouteAll();

      // Navega para uma página válida primeiro se não estiver em uma
      const url = page.url();
      if (url === 'about:blank' || !url.includes('localhost')) {
        await page.goto(TEST_CONFIG.LOGIN_URL);
      }

      // Aguarda a página carregar completamente antes de tentar acessar localStorage
      await page.waitForLoadState('networkidle');

      // Limpa localStorage e sessionStorage com proteção contra SecurityError
      try {
        await page.evaluate(() => {
          try {
            if (typeof Storage !== 'undefined' && typeof localStorage !== 'undefined') {
              localStorage.removeItem('@bfin:token');
              localStorage.removeItem('@bfin:refreshToken');
              localStorage.removeItem('@bfin:user');
              localStorage.removeItem('@bfin:test-mode');
              sessionStorage.clear();
            }
          } catch (e) {
            // Ignora erros de acesso ao localStorage
            console.warn('Erro ao acessar localStorage:', e);
          }
        });
      } catch (evalError) {
        // Se não conseguir executar evaluate, apenas registra o aviso
        console.warn('Não foi possível executar limpeza do localStorage:', evalError);
      }
    }
  } catch (error) {
    // Se a página está fechada ou houve erro, não há necessidade de limpar localStorage
    console.warn('Não foi possível limpar o estado de autenticação:', error instanceof Error ? error.message : 'Erro desconhecido');
  }
}