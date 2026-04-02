import { test, expect } from '@playwright/test';

/**
 * Teste E2E - Validação de Registro e Login
 * @description Testa o fluxo completo de registro e login da aplicação
 *
 * PRINCÍPIO: Teste auto-contido que cria seus próprios dados de teste
 * 1. Registra um novo usuário
 * 2. Faz logout
 * 3. Faz login com as credenciais criadas
 * 4. Valida o acesso ao dashboard
 */
test.describe('BFIN - Registro e Login', () => {
  // Dados únicos para cada execução de teste
  const timestamp = Date.now();
  const testEmail = `test${timestamp}@bfin.com.br`;
  const testPassword = process.env.TEST_USER_PASSWORD || 'senha123';
  const testFullName = `Test User ${timestamp}`;

  test('deve registrar usuário, fazer login e acessar o dashboard', async ({ page }) => {
    // ===== REGISTRO =====
    await test.step('Registrar novo usuário', async () => {
      await page.goto('/register');
      await page.waitForLoadState('networkidle');

      await expect(page.getByTestId('register-form')).toBeVisible();

      await page.getByTestId('name-input').fill(testFullName);
      await page.getByTestId('email-input').fill(testEmail);
      await page.getByTestId('password-input').fill(testPassword);
      await page.getByTestId('confirm-password-input').fill(testPassword);

      await page.getByTestId('register-button').click();

      await page.waitForLoadState('networkidle');

      const errorAlert = page.getByTestId('error-message');
      if (await errorAlert.isVisible()) {
        const errorMessage = await errorAlert.textContent();
        throw new Error(`Falha no registro: ${errorMessage}`);
      }

      await page.waitForURL(/\/dashboard/, { timeout: 15000 });
      await expect(page).toHaveURL(/\/dashboard/);
    });

    // ===== LOGOUT =====
    await test.step('Fazer logout', async () => {
      await page.waitForLoadState('networkidle');

      // Mobile: botão X visível diretamente
      const mobileLogoutButton = page.getByLabel('Sair da aplicação');

      if (await mobileLogoutButton.isVisible()) {
        await mobileLogoutButton.click();
      } else {
        // Desktop: abrir menu do usuário e clicar em Sair
        await page.getByTestId('user-menu').click();
        await page.getByTestId('logout-option').click();
      }

      await page.waitForURL(/\/login/, { timeout: 10000 });
      await expect(page).toHaveURL(/\/login/);
    });

    // ===== LOGIN =====
    await test.step('Fazer login com usuário registrado', async () => {
      await page.waitForLoadState('networkidle');

      await expect(page.getByRole('form', { name: /formulário de login/i })).toBeVisible();

      await page.getByRole('textbox', { name: /email/i }).fill(testEmail);
      await page.getByLabel(/senha/i).fill(testPassword);
      await page.getByRole('button', { name: /entrar/i }).click();

      await page.waitForLoadState('networkidle');

      const errorAlert = page.getByRole('alert');
      if (await errorAlert.isVisible()) {
        const errorMessage = await errorAlert.textContent();
        throw new Error(`Falha no login: ${errorMessage}`);
      }

      await page.waitForURL(/\/dashboard/, { timeout: 15000 });
      await expect(page).toHaveURL(/\/dashboard/);
    });

    // ===== VERIFICAÇÃO DO DASHBOARD =====
    await test.step('Verificar acesso ao dashboard', async () => {
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/\/dashboard/);
    });
  });
});
