import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model para a página de login
 * @description Encapsula seletores e ações da página de login
 *
 * @see https://playwright.dev/docs/locators#best-practices
 *
 * PRINCÍPIO: Selecionar pelo que o usuário enxerga, nunca por implementação
 * - getByRole: papel ARIA (botão, link, textbox, alert, status)
 * - getByLabel: label associado (acessibilidade)
 * - getByText: texto visível
 *
 * NUNCA: data-testid, className, id gerado, posição DOM
 * Isso torna os testes antifrágeis - resistem a mudanças visuais
 */
export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly registerLink: Locator;
  readonly trocarUsuarioLink: Locator;
  readonly form: Locator;

  constructor(page: Page) {
    this.page = page;

    // Seletores comportamentais - o que o usuário vê
    this.form = page.getByRole('form', { name: /formulário de login/i });
    this.emailInput = page.getByRole('textbox', { name: /email/i });
    this.passwordInput = page.getByLabel(/senha/i);
    this.submitButton = page.getByRole('button', { name: /^entrar$/i });
    this.registerLink = page.getByRole('button', { name: /registrar.*conta|criar.*conta|registre-se/i });
    this.trocarUsuarioLink = page.getByText('TROCAR DE USUÁRIO');
  }

  async goto() {
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async loginWithDefaultCredentials() {
    const email = process.env.TEST_USER_EMAIL || 'teste@bfin.com.br';
    const password = process.env.TEST_USER_PASSWORD || 'senha123';
    await this.login(email, password);
  }

  async assertFormVisible() {
    await expect(this.form).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async assertErrorVisible() {
    // Alerta de erro genérico (primeiro role="alert" da página)
    await expect(this.page.getByRole('alert').first()).toBeVisible();
  }

  async assertEmailError() {
    // Mensagem de erro "Campo obrigatório" (primeira ocorrência)
    await expect(this.page.getByText('Campo obrigatório').first()).toBeVisible();
  }

  async assertPasswordError() {
    // Mensagem de erro "Campo obrigatório" (última ocorrência)
    await expect(this.page.getByText('Campo obrigatório').last()).toBeVisible();
  }

  // Método assertLoading removido: estado transitório não deve ser testado
  // O importante é testar comportamentos observáveis pelo usuário

  async clickRegister() {
    await this.registerLink.click();
  }

  async clickTrocarUsuario() {
    await this.trocarUsuarioLink.click();
  }

  async assertCurrentUrl(expectedPath: string | RegExp) {
    await expect(this.page).toHaveURL(expectedPath);
  }

  async assertLoginSuccess() {
    await expect(this.page).toHaveURL(/\/dashboard/);
  }

  async clearForm() {
    await this.emailInput.clear();
    await this.passwordInput.clear();
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.submitButton.click();
  }
}
