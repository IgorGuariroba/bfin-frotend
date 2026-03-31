/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * Fixture de autenticação para reutilização em testes
 * @description Fornece contexto de usuário autenticado para outros testes
 *
 * PRINCÍPIO: Usar apenas seletores comportamentais (role, aria-label)
 */

type AuthFixture = {
  authenticatedPage: Page;
  login: (email?: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const test = base.extend<AuthFixture>({
  authenticatedPage: async ({ page }: { page: Page }, use) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    const email = process.env.TEST_USER_EMAIL || 'teste@bfin.com.br';
    const password = process.env.TEST_USER_PASSWORD || 'senha123';

    // Seletores comportamentais - o que o usuário vê
    await page.getByRole('textbox', { name: /email/i }).fill(email);
    await page.getByLabel(/senha/i).fill(password);
    await page.getByRole('button', { name: /entrar/i }).click();

    await page.waitForURL(/\/dashboard/);

    await use(page);
  },

  login: async ({ page }: { page: Page }, use) => {
    const loginFunction = async (email?: string, password?: string) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      const testEmail = email || process.env.TEST_USER_EMAIL || 'teste@bfin.com.br';
      const testPassword = password || process.env.TEST_USER_PASSWORD || 'senha123';

      await page.getByRole('textbox', { name: /email/i }).fill(testEmail);
      await page.getByLabel(/senha/i).fill(testPassword);
      await page.getByRole('button', { name: /entrar/i }).click();

      await page.waitForURL(/\/dashboard/);
    };

    await use(loginFunction);
  },

  logout: async ({ page }: { page: Page }, use) => {
    const logoutFunction = async () => {
      const logoutButton = page.getByRole('button', { name: /sair|logout|encerrar/i });

      if (await logoutButton.isVisible()) {
        await logoutButton.click();
        await page.waitForURL(/\/login/i);
      } else {
        await page.evaluate(() => {
          localStorage.removeItem('@bfin:token');
          localStorage.removeItem('@bfin:refreshToken');
          localStorage.removeItem('@bfin:user');
        });
        await page.goto('/login');
      }
    };

    await use(logoutFunction);
  },
});

export { expect } from '@playwright/test';
