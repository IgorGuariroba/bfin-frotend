import { test, expect } from '@playwright/test';
import { TEST_CONFIG, ERROR_MESSAGES } from '../utils/test-config';
import { logout, isAuthenticated, clearAuthState, registerAndLogin } from '../utils/auth-helpers';

/**
 * Testes E2E para funcionalidade de Login
 */

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    // Limpa estado de autenticação antes de cada teste
    await clearAuthState(page);
  });

  test('deve realizar login com credenciais válidas', async ({ page }) => {
    // Gera email único para o teste
    const uniqueEmail = `teste${Date.now()}@bfin.com.br`;

    // Primeiro registra um usuário válido
    await page.goto(TEST_CONFIG.REGISTER_URL);
    await page.fill('[data-testid="name-input"]', TEST_CONFIG.TEST_USER.nome);
    await page.fill('[data-testid="email-input"]', uniqueEmail);
    await page.fill('[data-testid="password-input"]', TEST_CONFIG.TEST_USER.password);
    await page.fill('[data-testid="confirm-password-input"]', TEST_CONFIG.TEST_USER.password);
    await page.click('[data-testid="register-button"]');

    // Se redirecionado para login, ou se já está no dashboard, continua
    if (page.url().includes('/login')) {
      // Navega para a página de login
      await page.goto(TEST_CONFIG.LOGIN_URL);

      // Verifica se está na página de login
      await expect(page).toHaveURL(TEST_CONFIG.LOGIN_URL);
      await expect(page.locator('[data-testid="login-form"]')).toBeVisible();

      // Preenche o formulário de login com as credenciais do usuário registrado
      await page.fill('[data-testid="email-input"]', uniqueEmail);
      await page.fill('[data-testid="password-input"]', TEST_CONFIG.TEST_USER.password);

      // Clica no botão de login
      await page.click('[data-testid="login-button"]');
    }

    // Verifica redirecionamento para dashboard
    await expect(page).toHaveURL(TEST_CONFIG.DASHBOARD_URL);
    await expect(page.locator(TEST_CONFIG.SELECTORS.sidebar)).toBeVisible();
  });

  test('deve exibir erro com credenciais inválidas', async ({ page }) => {
    await page.goto(TEST_CONFIG.LOGIN_URL);

    // Tenta login com credenciais inválidas
    await page.fill('[data-testid="email-input"]', 'email@invalido.com');
    await page.fill('[data-testid="password-input"]', 'senhaerrada');
    await page.click('[data-testid="login-button"]');

    // Verifica se permanece na página de login e exibe erro
    await expect(page).toHaveURL(TEST_CONFIG.LOGIN_URL);
    await expect(page.locator(TEST_CONFIG.SELECTORS.errorMessage)).toBeVisible();
  });

  test('deve validar campos obrigatórios', async ({ page }) => {
    await page.goto(TEST_CONFIG.LOGIN_URL);

    // Tenta submeter formulário vazio
    await page.click('[data-testid="login-button"]');

    // Verifica validação dos campos
    await expect(page.locator('[data-testid="email-error"]')).toContainText(ERROR_MESSAGES.REQUIRED_FIELD);
    await expect(page.locator('[data-testid="password-error"]')).toContainText(ERROR_MESSAGES.REQUIRED_FIELD);
  });

  test('deve validar formato de email', async ({ page }) => {
    await page.goto(TEST_CONFIG.LOGIN_URL);

    // Preenche email inválido
    await page.fill('[data-testid="email-input"]', 'email-invalido');
    await page.fill('[data-testid="password-input"]', 'senha123');
    await page.click('[data-testid="login-button"]');

    // Verifica validação de email
    await expect(page.locator('[data-testid="email-error"]')).toContainText(ERROR_MESSAGES.INVALID_EMAIL);
  });

  test('deve realizar logout com sucesso', async ({ page }) => {
    // Registra e faz login primeiro
    await registerAndLogin(page);

    // Verifica que está autenticado
    expect(await isAuthenticated(page)).toBe(true);

    // Faz logout
    await logout(page);

    // Verifica redirecionamento para login
    await expect(page).toHaveURL(TEST_CONFIG.LOGIN_URL);
  });

  test('deve lembrar estado de login após refresh', async ({ page }) => {
    // Registra e faz login
    await registerAndLogin(page);

    // Faz refresh da página
    await page.reload();

    // Verifica que continua autenticado
    await expect(page).toHaveURL(TEST_CONFIG.DASHBOARD_URL);
    await expect(page.locator(TEST_CONFIG.SELECTORS.sidebar)).toBeVisible();
  });

  test('deve redirecionar usuário autenticado para dashboard', async ({ page }) => {
    // Registra e faz login primeiro
    await registerAndLogin(page);

    // Tenta acessar página de login novamente
    await page.goto(TEST_CONFIG.LOGIN_URL);

    // Verifica redirecionamento automático para dashboard
    await expect(page).toHaveURL(TEST_CONFIG.DASHBOARD_URL);
  });

  test('deve exibir indicador de carregamento durante login', async ({ page }) => {
    await page.goto(TEST_CONFIG.LOGIN_URL);

    // Preenche credenciais que causarão erro (para garantir que o loading aparece)
    await page.fill('[data-testid="email-input"]', 'teste@exemplo.com');
    await page.fill('[data-testid="password-input"]', 'senhaqualquer123');

    // Simula loading mais lento interceptando todas as requests
    await page.route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, 500));
      await route.continue();
    });

    // Clica no botão de login
    await page.click('[data-testid="login-button"]');

    // Verifica se aparece QUALQUER indicação de loading
    try {
      // Tenta verificar se o elemento de loading aparece
      await expect(page.locator('[data-testid="login-loading"]')).toBeVisible({ timeout: 1000 });
    } catch {
      // Se não conseguir ver o loading text, verifica se o botão fica desabilitado
      await expect(page.locator('[data-testid="login-button"]')).toBeDisabled({ timeout: 1000 });
    }
  });
});