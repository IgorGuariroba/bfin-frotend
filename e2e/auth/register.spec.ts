import { test, expect } from '@playwright/test';
import { TEST_CONFIG, ERROR_MESSAGES } from '../utils/test-config';
import { register, clearAuthState } from '../utils/auth-helpers';

/**
 * Testes E2E para funcionalidade de Registro
 */

test.describe('Registro', () => {
  test.beforeEach(async ({ page }) => {
    // Limpa estado de autenticação antes de cada teste
    await clearAuthState(page);
  });

  test('deve realizar registro com dados válidos', async ({ page }) => {
    await page.goto(TEST_CONFIG.REGISTER_URL);

    // Verifica se está na página de registro
    await expect(page).toHaveURL(TEST_CONFIG.REGISTER_URL);
    await expect(page.locator('[data-testid="register-form"]')).toBeVisible();

    // Registra novo usuário
    await register(page);

    // Verifica se redirecionou para login ou dashboard
    await expect(page).toHaveURL(/\/(login|dashboard)/);

    // Se redirecionou para login, verifica mensagem de sucesso
    if (page.url().includes('/login')) {
      await expect(page.locator(TEST_CONFIG.SELECTORS.successMessage)).toBeVisible();
    }
  });

  test('deve validar campos obrigatórios', async ({ page }) => {
    await page.goto(TEST_CONFIG.REGISTER_URL);

    // Tenta submeter formulário vazio
    await page.click('[data-testid="register-button"]');

    // Verifica validação dos campos obrigatórios
    await expect(page.locator('[data-testid="name-error"]')).toContainText(ERROR_MESSAGES.REQUIRED_FIELD);
    await expect(page.locator('[data-testid="email-error"]')).toContainText(ERROR_MESSAGES.REQUIRED_FIELD);
    await expect(page.locator('[data-testid="password-error"]')).toContainText(ERROR_MESSAGES.REQUIRED_FIELD);
    await expect(page.locator('[data-testid="confirm-password-error"]')).toContainText(ERROR_MESSAGES.REQUIRED_FIELD);
  });

  test('deve validar formato de email', async ({ page }) => {
    await page.goto(TEST_CONFIG.REGISTER_URL);

    // Preenche email inválido
    await page.fill('[data-testid="name-input"]', 'João Silva');
    await page.fill('[data-testid="email-input"]', 'email-invalido');
    await page.fill('[data-testid="password-input"]', 'senha123');
    await page.fill('[data-testid="confirm-password-input"]', 'senha123');

    await page.click('[data-testid="register-button"]');

    // Verifica validação de email
    await expect(page.locator('[data-testid="email-error"]')).toContainText(ERROR_MESSAGES.INVALID_EMAIL);
  });

  test('deve validar confirmação de senha', async ({ page }) => {
    await page.goto(TEST_CONFIG.REGISTER_URL);

    // Preenche senhas diferentes
    await page.fill('[data-testid="name-input"]', 'João Silva');
    await page.fill('[data-testid="email-input"]', 'joao@teste.com');
    await page.fill('[data-testid="password-input"]', 'senha123');
    await page.fill('[data-testid="confirm-password-input"]', 'senha456');

    await page.click('[data-testid="register-button"]');

    // Verifica validação de confirmação de senha
    await expect(page.locator('[data-testid="confirm-password-error"]')).toContainText('Senhas não coincidem');
  });

  test('deve exibir erro para email já cadastrado', async ({ page }) => {
    await page.goto(TEST_CONFIG.REGISTER_URL);

    // Tenta registrar com email já existente
    await page.fill('[data-testid="name-input"]', 'João Silva');
    await page.fill('[data-testid="email-input"]', TEST_CONFIG.TEST_USER.email);
    await page.fill('[data-testid="password-input"]', 'senha123');
    await page.fill('[data-testid="confirm-password-input"]', 'senha123');

    await page.click('[data-testid="register-button"]');

    // Verifica mensagem de erro
    await expect(page.locator(TEST_CONFIG.SELECTORS.errorMessage)).toContainText('Email já cadastrado');
  });

  test('deve validar força da senha', async ({ page }) => {
    await page.goto(TEST_CONFIG.REGISTER_URL);

    // Testa senha muito fraca
    await page.fill('[data-testid="password-input"]', '123');

    // Verifica indicador de força da senha
    await expect(page.locator('[data-testid="password-strength"]')).toContainText('Fraca');
    await expect(page.locator('[data-testid="password-strength"]')).toHaveClass(/weak/);

    // Testa senha média
    await page.fill('[data-testid="password-input"]', 'senha123');
    await expect(page.locator('[data-testid="password-strength"]')).toContainText('Média');

    // Testa senha forte
    await page.fill('[data-testid="password-input"]', 'MinhaSenh@123!');
    await expect(page.locator('[data-testid="password-strength"]')).toContainText('Forte');
  });

  test('deve ter link para página de login', async ({ page }) => {
    await page.goto(TEST_CONFIG.REGISTER_URL);

    // Verifica link para login
    const loginLink = page.locator('[data-testid="login-link"]');
    await expect(loginLink).toBeVisible();

    // Clica no link e verifica navegação
    await loginLink.click();
    await expect(page).toHaveURL(TEST_CONFIG.LOGIN_URL);
  });

  test('deve exibir indicador de carregamento durante registro', async ({ page }) => {
    await page.goto(TEST_CONFIG.REGISTER_URL);

    // Preenche dados válidos
    await page.fill('[data-testid="name-input"]', 'João Silva');
    await page.fill('[data-testid="email-input"]', `teste${Date.now()}@bfin.com.br`);
    await page.fill('[data-testid="password-input"]', 'senha123');
    await page.fill('[data-testid="confirm-password-input"]', 'senha123');

    // Clica no botão de registro
    await page.click('[data-testid="register-button"]');

    // Verifica estado de carregamento
    await expect(page.locator('[data-testid="register-button"]')).toBeDisabled();
    await expect(page.locator('[data-testid="register-loading"]')).toBeVisible();
  });

  test('deve validar requisitos mínimos de senha', async ({ page }) => {
    await page.goto(TEST_CONFIG.REGISTER_URL);

    // Testa senha muito curta
    await page.fill('[data-testid="password-input"]', '123');
    await page.click('[data-testid="register-button"]');

    await expect(page.locator('[data-testid="password-error"]')).toContainText('mínimo de 6 caracteres');
  });
});