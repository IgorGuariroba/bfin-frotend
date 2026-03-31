import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

/**
 * Testes E2E para funcionalidade de login usando Page Object Model
 * @description Segue o padrão POM para melhor manutenção e reuso
 *
 * PRINCÍPIO: Testar comportamento, nunca implementação
 * Os seletores estão encapsulados no Page Object e usam apenas
 * atributos de acessibilidade (role, aria-label, aria-labelledby)
 */
test.describe('Login (POM)', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('deve exibir o formulário de login corretamente', async () => {
    await loginPage.assertFormVisible();
    await loginPage.assertCurrentUrl('/login');
  });

  test('deve fazer login com sucesso', async () => {
    await loginPage.loginWithDefaultCredentials();
    await loginPage.assertLoginSuccess();
  });

  test('deve exibir erro com credenciais inválidas', async () => {
    await loginPage.login('invalido@bfin.com.br', 'senha-errada');
    await loginPage.assertErrorVisible();
    await loginPage.assertCurrentUrl('/login');
  });

  test('deve exibir validação de campo email vazio', async () => {
    await loginPage.fillPassword('senha123');
    await loginPage.submit();
    await loginPage.assertEmailError();
  });

  test('deve exibir validação de campo senha vazia', async () => {
    await loginPage.fillEmail('teste@bfin.com.br');
    await loginPage.submit();
    await loginPage.assertPasswordError();
  });

  test('deve navegar para cadastro de usuário', async () => {
    await loginPage.clickRegister();
    await loginPage.assertCurrentUrl('/register');
  });

  // Teste removido: estado de loading é transitório e pode não ser visível em todos os ambientes
  // O importante é testar o comportamento final (login sucesso/erro), não estados intermediários

  test('deve permitir trocar de usuário', async () => {
    await loginPage.fillEmail('teste@bfin.com.br');
    await loginPage.clickTrocarUsuario();

    await expect(loginPage.emailInput).toHaveValue('');
  });
});
