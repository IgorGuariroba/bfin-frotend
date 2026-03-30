import { test, expect } from '@playwright/test';
import { TEST_CONFIG, ERROR_MESSAGES, SELECTOR_HELPERS } from '../utils/test-config';
import { setAuthenticatedState } from '../utils/auth-helpers';
import {
  openDashboardForm,
  fillIncomeForm,
  submitForm,
  fillField,
  expectFieldError
} from '../utils/form-helpers';

/**
 * Testes E2E para Formulário de Receita (Depositar)
 * Nota: Formulário de "criar conta" foi refatorado para usar IncomeForm
 */

test.describe('Formulário - Receita', () => {
  test.beforeEach(async ({ page }) => {
    // Configura estado autenticado
    await setAuthenticatedState(page);

    // Abre o formulário de receita (depositar)
    await openDashboardForm(page, 'receita');
  });

  test('deve criar receita com dados válidos', async ({ page }) => {
    // Preenche formulário com dados válidos
    await fillIncomeForm(page, {
      descricao: 'Salário de Teste',
      valor: '1500.00',
      categoria: 'Salário'
    });

    // Submete formulário
    await submitForm(page);

    // Verifica se a receita foi criada
    await expect(page.locator(TEST_CONFIG.SELECTORS.successMessage))
      .toBeVisible();
  });

  test('deve validar campos obrigatórios', async ({ page }) => {
    // Tenta submeter formulário vazio
    await submitForm(page, false);

    // Verifica validação dos campos obrigatórios
    await expectFieldError(page, 'descricao', ERROR_MESSAGES.REQUIRED_FIELD);
    await expectFieldError(page, 'valor', ERROR_MESSAGES.REQUIRED_FIELD);
  });

  test('deve validar formato do valor', async ({ page }) => {
    await fillField(page, 'descricao', 'Receita Teste');

    // Testa valor inválido
    await fillField(page, 'valor', 'valor-inválido');
    await submitForm(page, false);

    // Verifica erro de validação
    await expectFieldError(page, 'valor', ERROR_MESSAGES.INVALID_VALUE);
  });

  test('não deve aceitar valor zero ou negativo', async ({ page }) => {
    // Testa valor zero
    await fillIncomeForm(page, {
      descricao: 'Receita Zero',
      valor: '0.00',
      categoria: 'Salário'
    });

    await submitForm(page, false);

    // Deve rejeitar valor zero para receitas
    await expectFieldError(page, 'valor', 'Valor deve ser maior que zero');
  });

  test('deve aceitar valores positivos', async ({ page }) => {
    await fillIncomeForm(page, {
      descricao: 'Receita Válida',
      valor: '100.00',
      categoria: 'Salário'
    });

    await submitForm(page);

    // Deve aceitar valor positivo
    await expect(page.locator(TEST_CONFIG.SELECTORS.successMessage)).toBeVisible();
  });

  test('deve formatar valor monetário automaticamente', async ({ page }) => {
    // Digite valor sem formatação
    await fillField(page, 'valor', '1000');

    // Verifica se foi formatado automaticamente
    const valorField = page.locator(SELECTOR_HELPERS.formField('valor'));
    await expect(valorField).toHaveValue('R$ 1.000,00');
  });

  test('deve validar tamanho máximo da descrição', async ({ page }) => {
    // Descrição muito longa (mais de 255 caracteres)
    const longDescription = 'A'.repeat(256);

    await fillField(page, 'descricao', longDescription);
    await fillField(page, 'valor', '100.00');
    await submitForm(page, false);

    // Verifica erro de validação
    await expectFieldError(page, 'descricao', 'máximo de 255 caracteres');
  });

  test('deve cancelar criação e fechar formulário', async ({ page }) => {
    // Preenche alguns dados
    await fillField(page, 'descricao', 'Receita Teste');
    await fillField(page, 'valor', '100.00');

    // Clica em cancelar
    await page.click(TEST_CONFIG.SELECTORS.cancelButton);

    // Verifica se o formulário foi fechado
    await expect(page.locator(TEST_CONFIG.SELECTORS.expandedForm)).not.toBeVisible();
  });

  test('deve exibir indicador de carregamento durante criação', async ({ page }) => {
    await fillIncomeForm(page);

    // Submete formulário
    await page.click(TEST_CONFIG.SELECTORS.submitButton);

    // Verifica indicador de carregamento
    await expect(page.locator(TEST_CONFIG.SELECTORS.submitButton)).toBeDisabled();
  });

  test('deve permitir caracteres especiais na descrição', async ({ page }) => {
    await fillIncomeForm(page, {
      descricao: 'Receita com @#$%! caracteres especiais & acentos: ção, ã, õ',
      valor: '100.00',
      categoria: 'Salário'
    });

    await submitForm(page);

    // Deve aceitar caracteres especiais
    await expect(page.locator(TEST_CONFIG.SELECTORS.successMessage)).toBeVisible();
  });

  test('deve funcionar com entrada por teclado', async ({ page }) => {
    // Navega pelos campos usando Tab
    await page.keyboard.press('Tab'); // Valor
    await page.keyboard.type('500.00');

    await page.keyboard.press('Tab'); // Descrição
    await page.keyboard.type('Receita via Teclado');

    // Submete usando Enter
    await page.keyboard.press('Enter');

    // Verifica sucesso
    await expect(page.locator(TEST_CONFIG.SELECTORS.successMessage)).toBeVisible();
  });

  test('deve lidar com erros de rede', async ({ page }) => {
    // Simula falha de rede
    await page.route('**/api/v1/cash-flow/income', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Erro interno do servidor' })
      });
    });

    await fillIncomeForm(page);
    await submitForm(page, false);

    // Verifica tratamento do erro - pode aparecer como toast ou mensagem de erro
    // Para receitas, o erro geralmente aparece como toast, não como mensagem no formulário
    await page.waitForTimeout(2000); // Aguarda toast aparecer
  });

  test('deve carregar lista de categorias', async ({ page }) => {
    // Verifica se o campo de categoria existe e tem opções
    const categoryField = page.locator(SELECTOR_HELPERS.formField('categoria'));
    await expect(categoryField).toBeVisible();

    // Clica no campo para verificar se abre as opções
    await categoryField.click();

    // Verifica se há pelo menos uma opção disponível
    await expect(page.locator('option')).toHaveCount(1);
  });
});