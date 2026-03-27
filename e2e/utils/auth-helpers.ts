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
  // Gera um email único para cada teste
  const uniqueEmail = `teste${Date.now()}${Math.floor(Math.random() * 1000)}@bfin.com.br`;

  try {
    // Vai para página de registro
    await page.goto(TEST_CONFIG.REGISTER_URL);

    // Preenche e envia formulário de registro
    await page.fill('[data-testid="name-input"]', TEST_CONFIG.TEST_USER.nome);
    await page.fill('[data-testid="email-input"]', uniqueEmail);
    await page.fill('[data-testid="password-input"]', TEST_CONFIG.TEST_USER.password);
    await page.fill('[data-testid="confirm-password-input"]', TEST_CONFIG.TEST_USER.password);
    await page.click('[data-testid="register-button"]');

    // Aguarda redirecionamento (pode ir para login ou dashboard)
    await page.waitForURL(/\/(login|dashboard)/, {
      timeout: TEST_CONFIG.DEFAULT_TIMEOUT
    });

    // Se redirecionou para login, faz login
    if (page.url().includes('/login')) {
      await page.fill('[data-testid="email-input"]', uniqueEmail);
      await page.fill('[data-testid="password-input"]', TEST_CONFIG.TEST_USER.password);
      await page.click('[data-testid="login-button"]');

      // Aguarda redirecionamento para dashboard após login
      await page.waitForURL(TEST_CONFIG.DASHBOARD_URL, {
        timeout: TEST_CONFIG.DEFAULT_TIMEOUT
      });
    }

    // Verifica se chegou no dashboard e sidebar está visível
    await expect(page).toHaveURL(TEST_CONFIG.DASHBOARD_URL);
    await expect(page.locator(TEST_CONFIG.SELECTORS.sidebar)).toBeVisible();

    return {
      nome: TEST_CONFIG.TEST_USER.nome,
      email: uniqueEmail,
      password: TEST_CONFIG.TEST_USER.password,
      confirmPassword: TEST_CONFIG.TEST_USER.password
    };
  } catch (error) {
    throw new Error(`Falha no registro e login: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}

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
  await expect(page.locator(TEST_CONFIG.SELECTORS.sidebar)).toBeVisible();
}

/**
 * Realiza logout do sistema
 * @param page - Página do Playwright
 */
export async function logout(page: Page) {
  // Clica no menu do usuário
  await page.click('[data-testid="user-menu"]');

  // Clica na opção de logout
  await page.click('[data-testid="logout-button"]');

  // Aguarda redirecionamento para login
  await page.waitForURL(TEST_CONFIG.LOGIN_URL, {
    timeout: TEST_CONFIG.DEFAULT_TIMEOUT
  });
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
    timeout: TEST_CONFIG.DEFAULT_TIMEOUT
  });

  return userData;
}

/**
 * Verifica se o usuário está autenticado
 * @param page - Página do Playwright
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  try {
    await page.goto(TEST_CONFIG.DASHBOARD_URL);
    await expect(page.locator(TEST_CONFIG.SELECTORS.sidebar)).toBeVisible({
      timeout: 5000
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Força o estado de autenticado usando localStorage
 * @param page - Página do Playwright
 */
export async function setAuthenticatedState(page: Page) {
  // Simula token de autenticação no localStorage
  await page.addInitScript(() => {
    localStorage.setItem('@bfin:token', 'mock_token_for_tests');
    localStorage.setItem('@bfin:refreshToken', 'mock_refresh_token');
    localStorage.setItem('@bfin:user', JSON.stringify({
      id: 1,
      full_name: 'Usuário Teste',
      email: 'teste@bfin.com.br'
    }));
  });

  await page.goto(TEST_CONFIG.DASHBOARD_URL);
  await expect(page.locator(TEST_CONFIG.SELECTORS.sidebar)).toBeVisible();
}

/**
 * Limpa o estado de autenticação
 * @param page - Página do Playwright
 */
export async function clearAuthState(page: Page) {
  try {
    // Navega para uma página válida primeiro se não estiver em uma
    const url = page.url();
    if (url === 'about:blank' || !url.includes('localhost')) {
      await page.goto(TEST_CONFIG.LOGIN_URL);
    }

    await page.evaluate(() => {
      if (typeof Storage !== 'undefined') {
        localStorage.removeItem('@bfin:token');
        localStorage.removeItem('@bfin:refreshToken');
        localStorage.removeItem('@bfin:user');
        sessionStorage.clear();
      }
    });
  } catch (_error) {
    // Se falhar ao limpar o localStorage, usa addInitScript para o próximo carregamento
    await page.addInitScript(() => {
      if (typeof Storage !== 'undefined') {
        localStorage.removeItem('@bfin:token');
        localStorage.removeItem('@bfin:refreshToken');
        localStorage.removeItem('@bfin:user');
        sessionStorage.clear();
      }
    });
  }
}