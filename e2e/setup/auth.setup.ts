import { test as setup } from '@playwright/test';

/**
 * Setup global de autenticação
 * @description Cria um estado de autenticação salvo para reutilização em outros testes
 * @see https://playwright.dev/docs/auth#pre-authenticated-pages
 *
 * PRINCÍPIO: Usar apenas seletores comportamentais (role, aria-label)
 */

const authFile = 'e2e/.auth/user.json';

setup('autenticar', async ({ page }) => {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');

  const email = process.env.TEST_USER_EMAIL || 'teste@bfin.com.br';
  const password = process.env.TEST_USER_PASSWORD || 'senha123';

  // Seletores comportamentais - o que o usuário vê
  await page.getByRole('textbox', { name: /email/i }).fill(email);
  await page.getByLabel(/senha/i).fill(password);
  await page.getByRole('button', { name: /entrar/i }).click();

  await page.waitForURL(/\/dashboard/);
  await page.waitForLoadState('networkidle');

  await page.context().storageState({ path: authFile });
});
