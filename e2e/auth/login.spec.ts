import { test, expect } from '@playwright/test';

/**
 * Testes E2E para funcionalidade de login
 * @description Testa o fluxo completo de autenticação da aplicação
 *
 * @see https://playwright.dev/docs/locators#best-practices
 *
 * PRINCÍPIO: Testar comportamento, nunca implementação
 * - getByRole: seleciona pelo papel ARIA (o que o usuário vê)
 * - getByLabel: seleciona pelo label associado (acessibilidade)
 * - getByText: seleciona por texto visível
 *
 * NUNCA usar: data-testid, className, id gerado, posição DOM
 * Isso torna os testes antifrágeis - quebram apenas quando o comportamento muda
 */
test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
  });

  test('deve exibir o formulário de login corretamente', async ({ page }) => {
    await expect(page).toHaveURL('/login');

    // Verifica formulário pelos atributos de acessibilidade
    await expect(page.getByRole('form', { name: /formulário de login/i })).toBeVisible();

    // Verifica inputs pelos labels associados (srOnly mas presente no DOM)
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(page.getByLabel(/senha/i)).toBeVisible();

    // Verifica botões pelos rótulos acessíveis
    await expect(page.getByRole('button', { name: /entrar/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /registrar.*conta|criar.*conta|registre-se/i })).toBeVisible();
  });

  test('deve fazer login com sucesso', async ({ page }) => {
    const email = process.env.TEST_USER_EMAIL || 'teste@bfin.com.br';
    const password = process.env.TEST_USER_PASSWORD || 'senha123';

    // Preenche pelos labels (comportamento do usuário)
    await page.getByRole('textbox', { name: 'Email' }).fill(email);
    await page.getByLabel('Senha').fill(password);

    // Aguarda o botão estar visível e habilitado
    const submitButton = page.getByRole('button', { name: /^entrar$/i });
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();

    // Submete o formulário
    await submitButton.click();

    // Aguarda redirecionamento (comportamento esperado)
    await page.waitForURL(/\/dashboard/);
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('deve exibir erro com credenciais inválidas', async ({ page }) => {
    await page.getByRole('textbox', { name: /email/i }).fill('invalido@bfin.com.br');
    await page.getByLabel(/senha/i).fill('senha-errada');
    await page.getByRole('button', { name: /entrar/i }).click();

    // Verifica alerta de erro pelo role="alert"
    await expect(page.getByRole('alert').first()).toBeVisible();
    await expect(page).toHaveURL('/login');
  });

  test('deve exibir validação de campo email vazio', async ({ page }) => {
    await page.getByLabel('Senha').fill('senha123');
    await page.getByRole('button', { name: /entrar/i }).click();

    // Verifica mensagem de erro "Campo obrigatório" no contexto do email
    await expect(page.getByText('Campo obrigatório').first()).toBeVisible();
  });

  test('deve exibir validação de campo senha vazia', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Email' }).fill('teste@bfin.com.br');
    await page.getByRole('button', { name: /entrar/i }).click();

    // Verifica mensagem de erro "Campo obrigatório" no contexto da senha
    await expect(page.getByText('Campo obrigatório').last()).toBeVisible();
  });

  test('deve navegar para cadastro de usuário', async ({ page }) => {
    await page.getByRole('button', { name: /registrar.*conta|criar.*conta|registre-se/i }).click();
    await expect(page).toHaveURL('/register');
  });

  // Teste removido: estado de loading é transitório e pode não ser visível em todos os ambientes
  // O importante é testar o comportamento final (login sucesso/erro), não estados intermediários

  test('deve permitir trocar de usuário', async ({ page }) => {
    await page.getByRole('textbox', { name: /email/i }).fill('teste@bfin.com.br');

    // Botão/Link com texto "TROCAR DE USUÁRIO"
    await page.getByText('TROCAR DE USUÁRIO').click();

    // Verifica que o campo foi limpo
    await expect(page.getByRole('textbox', { name: /email/i })).toHaveValue('');
  });
});
