import { test, expect } from '@playwright/test';
import { TEST_CONFIG, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/test-config';
import { setAuthenticatedState } from '../utils/auth-helpers';
import {
  openDashboardForm,
  submitForm,
  fillField,
  selectOption,
  expectFieldError,
  waitForDataLoad
} from '../utils/form-helpers';

/**
 * Testes E2E para Formulário de Receita
 */

test.describe('Formulário - Receita', () => {
  test.beforeEach(async ({ page }) => {
    // Configura estado autenticado
    await setAuthenticatedState(page);

    // Abre o formulário de receita
    await openDashboardForm(page, 'receita');
  });

  test('deve criar receita com dados válidos', async ({ page }) => {
    // Aguarda carregar contas e categorias
    await waitForDataLoad(page);

    // Preenche formulário com dados válidos
    await fillField(page, 'descricao', 'Salário Janeiro 2024');
    await fillField(page, 'valor', '8500.00');
    await selectOption(page, 'conta', 'conta-principal');
    await selectOption(page, 'categoria', 'salario');

    // Submete formulário
    await submitForm(page);

    // Verifica se a receita foi criada
    await expect(page.locator(TEST_CONFIG.SELECTORS.successMessage))
      .toContainText(SUCCESS_MESSAGES.TRANSACTION_CREATED);
  });

  test('deve validar campos obrigatórios', async ({ page }) => {
    // Tenta submeter formulário vazio
    await submitForm(page, false);

    // Verifica validação dos campos obrigatórios
    await expectFieldError(page, 'descricao', ERROR_MESSAGES.REQUIRED_FIELD);
    await expectFieldError(page, 'valor', ERROR_MESSAGES.REQUIRED_FIELD);
    await expectFieldError(page, 'conta', ERROR_MESSAGES.REQUIRED_FIELD);
    await expectFieldError(page, 'categoria', ERROR_MESSAGES.REQUIRED_FIELD);
  });

  test('deve validar formato do valor', async ({ page }) => {
    await fillField(page, 'descricao', 'Receita Teste');

    // Testa valor inválido
    await fillField(page, 'valor', 'valor-inválido');
    await submitForm(page, false);

    // Verifica erro de validação
    await expectFieldError(page, 'valor', ERROR_MESSAGES.INVALID_VALUE);
  });

  test('não deve aceitar valores zero ou negativos', async ({ page }) => {
    await fillField(page, 'descricao', 'Receita Teste');

    // Testa valor zero
    await fillField(page, 'valor', '0.00');
    await submitForm(page, false);
    await expectFieldError(page, 'valor', 'Valor deve ser maior que zero');

    // Testa valor negativo
    await fillField(page, 'valor', '-100.00');
    await submitForm(page, false);
    await expectFieldError(page, 'valor', 'Valor deve ser maior que zero');
  });

  test('deve formatar valor monetário automaticamente', async ({ page }) => {
    // Digite valor sem formatação
    await fillField(page, 'valor', '5000');

    // Verifica se foi formatado automaticamente
    const valorField = page.locator(TEST_CONFIG.SELECTORS.formField('valor'));
    await expect(valorField).toHaveValue('R$ 5.000,00');
  });

  test('deve carregar lista de contas', async ({ page }) => {
    // Clica no campo de conta para abrir opções
    await page.click(TEST_CONFIG.SELECTORS.formField('conta'));

    // Verifica se carregou opções
    await expect(page.locator('[data-testid="conta-option-0"]')).toBeVisible();
  });

  test('deve carregar lista de categorias', async ({ page }) => {
    // Clica no campo de categoria para abrir opções
    await page.click(TEST_CONFIG.SELECTORS.formField('categoria'));

    // Verifica se carregou opções de categorias de receita
    await expect(page.locator('[data-testid="categoria-option-0"]')).toBeVisible();
  });

  test('deve permitir seleção de data', async ({ page }) => {
    // Seleciona uma data específica
    await page.click('[data-testid="data-picker"]');

    // Navega para mês anterior
    await page.click('[data-testid="prev-month"]');

    // Seleciona um dia
    await page.click('[data-testid="day-15"]');

    // Verifica se a data foi selecionada
    const datePicker = page.locator('[data-testid="data-picker"]');
    await expect(datePicker).not.toHaveValue('');
  });

  test('deve permitir receita recorrente', async ({ page }) => {
    // Ativa recorrência
    await page.check('[data-testid="recorrente-checkbox"]');

    // Verifica se campos de recorrência aparecem
    await expect(page.locator('[data-testid="frequencia-select"]')).toBeVisible();
    await expect(page.locator('[data-testid="data-fim-input"]')).toBeVisible();

    // Seleciona frequência
    await selectOption(page, 'frequencia', 'mensal');
  });

  test('deve validar data fim para receitas recorrentes', async ({ page }) => {
    // Ativa recorrência
    await page.check('[data-testid="recorrente-checkbox"]');
    await selectOption(page, 'frequencia', 'mensal');

    // Tenta usar data fim anterior à data de início
    await page.fill('[data-testid="data-inicio"]', '2024-03-15');
    await page.fill('[data-testid="data-fim"]', '2024-02-15');

    await submitForm(page, false);

    // Verifica erro de validação
    await expectFieldError(page, 'data-fim', 'Data fim deve ser posterior à data de início');
  });

  test('deve cancelar criação e fechar formulário', async ({ page }) => {
    // Preenche alguns dados
    await fillField(page, 'descricao', 'Receita Teste');
    await fillField(page, 'valor', '1000.00');

    // Clica em cancelar
    await page.click(TEST_CONFIG.SELECTORS.cancelButton);

    // Verifica se o formulário foi fechado
    await expect(page.locator(TEST_CONFIG.SELECTORS.expandedForm)).not.toBeVisible();
  });

  test('deve lidar com erro ao carregar contas', async ({ page }) => {
    // Simula erro ao carregar contas
    await page.route('**/api/v1/accounts', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Erro ao carregar contas' })
      });
    });

    // Recarrega formulário
    await page.reload();
    await openDashboardForm(page, 'receita');

    // Verifica tratamento do erro
    await expect(page.locator('[data-testid="contas-error"]'))
      .toContainText('Erro ao carregar contas');
  });

  test('deve criar receita em conta específica', async ({ page }) => {
    await waitForDataLoad(page);

    // Preenche dados
    await fillField(page, 'descricao', 'Freelance Projeto X');
    await fillField(page, 'valor', '2500.00');

    // Seleciona conta específica
    await selectOption(page, 'conta', 'conta-freelance');
    await selectOption(page, 'categoria', 'trabalho-extra');

    await submitForm(page);

    // Verifica sucesso
    await expect(page.locator(TEST_CONFIG.SELECTORS.successMessage)).toBeVisible();
  });

  test('deve permitir adicionar observações', async ({ page }) => {
    await fillField(page, 'descricao', 'Receita com observações');
    await fillField(page, 'valor', '1500.00');
    await selectOption(page, 'conta', 'conta-principal');
    await selectOption(page, 'categoria', 'outras');

    // Adiciona observações
    await fillField(page, 'observacoes', 'Pagamento referente ao mês de fevereiro. Inclui bônus por performance.');

    await submitForm(page);

    // Verifica sucesso
    await expect(page.locator(TEST_CONFIG.SELECTORS.successMessage)).toBeVisible();
  });

  test('deve validar tamanho máximo da descrição', async ({ page }) => {
    // Descrição muito longa
    const longDescription = 'A'.repeat(256);

    await fillField(page, 'descricao', longDescription);
    await fillField(page, 'valor', '100.00');

    await submitForm(page, false);

    // Verifica erro de validação
    await expectFieldError(page, 'descricao', 'máximo de 255 caracteres');
  });
});