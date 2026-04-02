import { test, expect } from '@playwright/test';

/**
 * Teste E2E Simplificado - Validação de Login
 * @description Testa apenas o fluxo de login da aplicação
 *
 * PRINCÍPIO: Um teste que valida que o login está funcionando corretamente
 * Foco: Validação de autenticação básica
 */
test.describe('BFIN - Validação de Login', () => {
  test('deve realizar login com sucesso e redirecionar para o dashboard', async ({ page }) => {
    // ===== LOGIN =====
    await test.step('Fazer login', async () => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      const email = process.env.TEST_USER_EMAIL || 'teste@bfin.com.br';
      const password = process.env.TEST_USER_PASSWORD || 'senha123';

      // Verificar formulário de login
      await expect(page.getByRole('form', { name: /formulário de login/i })).toBeVisible();

      // Fazer login
      await page.getByRole('textbox', { name: /email/i }).fill(email);
      await page.getByLabel(/senha/i).fill(password);
      await page.getByRole('button', { name: /entrar/i }).click();

      // Aguardar resposta da API ou erro
      await page.waitForLoadState('networkidle');

      // Verificar se há mensagem de erro
      const errorAlert = page.getByRole('alert');
      const hasError = await errorAlert.isVisible();

      if (hasError) {
        const errorMessage = await errorAlert.textContent();
        throw new Error(`Falha no login: ${errorMessage}`);
      }

      // Aguardar redirecionamento para dashboard com timeout maior
      await page.waitForURL(/\/dashboard/, { timeout: 15000 });
      await expect(page).toHaveURL(/\/dashboard/);
    });

    // ===== VERIFICAÇÃO BÁSICA DO DASHBOARD =====
    await test.step('Verificar redirecionamento para dashboard', async () => {
      // Aguardar carregamento completo
      await page.waitForLoadState('networkidle');

      // Verificar que estamos na página correta
      await expect(page).toHaveURL(/\/dashboard/);

      // Verificar área de conteúdo principal do dashboard (se existir)
      const dashboardContent = page.getByTestId('dashboard-content');
      if (await dashboardContent.isVisible()) {
        await expect(dashboardContent).toBeVisible();
      }

      // Login realizado com sucesso
    });
  });
});