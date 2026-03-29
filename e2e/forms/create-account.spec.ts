import { test, expect } from '@playwright/test';
import { TEST_CONFIG, ERROR_MESSAGES, SUCCESS_MESSAGES, SELECTOR_HELPERS } from '../utils/test-config';
import { setAuthenticatedState } from '../utils/auth-helpers';
import {
  openDashboardForm,
  fillAccountForm,
  submitForm,
  fillField,
  expectFieldError
} from '../utils/form-helpers';

/**
 * Testes E2E para Formulário de Criar Conta
 */

test.describe('Formulário - Criar Conta', () => {
  test.beforeEach(async ({ page }) => {
    // Configura estado autenticado
    await setAuthenticatedState(page);

    // Abre o formulário de criar conta
    await openDashboardForm(page, 'criar-conta');
  });

  test('deve criar conta com dados válidos', async ({ page }) => {
    // Preenche formulário com dados válidos
    await fillAccountForm(page, {
      nome: 'Conta Poupança Teste',
      saldo: '1500.00',
      descricao: 'Conta criada para testes E2E'
    });

    // Submete formulário
    await submitForm(page);

    // Verifica se a conta foi criada
    await expect(page.locator(TEST_CONFIG.SELECTORS.successMessage))
      .toContainText(SUCCESS_MESSAGES.ACCOUNT_CREATED);
  });

  test('deve validar campos obrigatórios', async ({ page }) => {
    // Tenta submeter formulário vazio
    await submitForm(page, false);

    // Verifica validação dos campos obrigatórios
    await expectFieldError(page, 'nome', ERROR_MESSAGES.REQUIRED_FIELD);
    await expectFieldError(page, 'saldo', ERROR_MESSAGES.REQUIRED_FIELD);
  });

  test('deve validar formato do valor do saldo', async ({ page }) => {
    await fillField(page, 'nome', 'Conta Teste');

    // Testa valor inválido
    await fillField(page, 'saldo', 'valor-inválido');
    await submitForm(page, false);

    // Verifica erro de validação
    await expectFieldError(page, 'saldo', ERROR_MESSAGES.INVALID_VALUE);
  });

  test('deve aceitar valor zero no saldo', async ({ page }) => {
    await fillAccountForm(page, {
      nome: 'Conta Zerada',
      saldo: '0.00',
      descricao: 'Conta com saldo zero'
    });

    await submitForm(page);

    // Deve aceitar saldo zero
    await expect(page.locator(TEST_CONFIG.SELECTORS.successMessage)).toBeVisible();
  });

  test('deve aceitar valores negativos no saldo', async ({ page }) => {
    await fillAccountForm(page, {
      nome: 'Conta Negativa',
      saldo: '-100.00',
      descricao: 'Conta com saldo negativo'
    });

    await submitForm(page);

    // Deve aceitar saldo negativo
    await expect(page.locator(TEST_CONFIG.SELECTORS.successMessage)).toBeVisible();
  });

  test('deve formatar valor monetário automaticamente', async ({ page }) => {
    // Digite valor sem formatação
    await fillField(page, 'saldo', '1000');

    // Verifica se foi formatado automaticamente
    const saldeField = page.locator(SELECTOR_HELPERS.formField('saldo'));
    await expect(saldeField).toHaveValue('R$ 1.000,00');
  });

  test('deve validar tamanho máximo do nome', async ({ page }) => {
    // Nome muito longo (mais de 255 caracteres)
    const longName = 'A'.repeat(256);

    await fillField(page, 'nome', longName);
    await fillField(page, 'saldo', '100.00');
    await submitForm(page, false);

    // Verifica erro de validação
    await expectFieldError(page, 'nome', 'máximo de 255 caracteres');
  });

  test('deve cancelar criação e fechar formulário', async ({ page }) => {
    // Preenche alguns dados
    await fillField(page, 'nome', 'Conta Teste');
    await fillField(page, 'saldo', '100.00');

    // Clica em cancelar
    await page.click(TEST_CONFIG.SELECTORS.cancelButton);

    // Verifica se o formulário foi fechado
    await expect(page.locator(TEST_CONFIG.SELECTORS.expandedForm)).not.toBeVisible();
  });

  test('deve exibir indicador de carregamento durante criação', async ({ page }) => {
    await fillAccountForm(page);

    // Submete formulário
    await page.click(TEST_CONFIG.SELECTORS.submitButton);

    // Verifica indicador de carregamento
    await expect(page.locator('[data-testid="form-loading"]')).toBeVisible();
    await expect(page.locator(TEST_CONFIG.SELECTORS.submitButton)).toBeDisabled();
  });

  test('deve permitir caracteres especiais na descrição', async ({ page }) => {
    await fillAccountForm(page, {
      nome: 'Conta Teste',
      saldo: '100.00',
      descricao: 'Descrição com @#$%! caracteres especiais & acentos: ção, ã, õ'
    });

    await submitForm(page);

    // Deve aceitar caracteres especiais
    await expect(page.locator(TEST_CONFIG.SELECTORS.successMessage)).toBeVisible();
  });

  test('deve funcionar com entrada por teclado', async ({ page }) => {
    // Navega pelos campos usando Tab
    await page.keyboard.press('Tab'); // Nome
    await page.keyboard.type('Conta via Teclado');

    await page.keyboard.press('Tab'); // Saldo
    await page.keyboard.type('500.00');

    await page.keyboard.press('Tab'); // Descrição
    await page.keyboard.type('Criada usando apenas teclado');

    // Submete usando Enter
    await page.keyboard.press('Enter');

    // Verifica sucesso
    await expect(page.locator(TEST_CONFIG.SELECTORS.successMessage)).toBeVisible();
  });

  test('deve lidar com erros de rede', async ({ page }) => {
    // Simula falha de rede
    await page.route('**/api/v1/accounts', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Erro interno do servidor' })
      });
    });

    await fillAccountForm(page);
    await submitForm(page, false);

    // Verifica tratamento do erro
    await expect(page.locator(TEST_CONFIG.SELECTORS.errorMessage))
      .toContainText('Erro ao criar conta');
  });

  test('deve validar duplicação de nome de conta', async ({ page }) => {
    // Simula erro de duplicação
    await page.route('**/api/v1/accounts', route => {
      route.fulfill({
        status: 409,
        body: JSON.stringify({ error: 'Conta com este nome já existe' })
      });
    });

    await fillAccountForm(page, {
      nome: 'Conta Existente',
      saldo: '100.00',
      descricao: 'Tentativa de duplicar'
    });

    await submitForm(page, false);

    // Verifica erro de duplicação
    await expect(page.locator(TEST_CONFIG.SELECTORS.errorMessage))
      .toContainText('Conta com este nome já existe');
  });
});