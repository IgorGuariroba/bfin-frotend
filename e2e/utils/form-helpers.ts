import { Page, expect } from '@playwright/test';
import { TEST_CONFIG } from './test-config';

/**
 * Helper functions para interação com formulários nos testes E2E
 */

/**
 * Interfaces para tipos de dados flexíveis
 */
interface AccountData {
  nome: string;
  saldo: string;
  descricao: string;
}

interface CategoryData {
  nome: string;
  descricao: string;
}

interface IncomeData {
  descricao: string;
  valor: string;
  categoria: string;
}

interface ExpenseData {
  descricao: string;
  valor: string;
  categoria: string;
}

interface TransferData {
  descricao: string;
  valor: string;
}

/**
 * Abre um formulário específico no Dashboard
 * @param page - Página do Playwright
 * @param formType - Tipo do formulário a ser aberto
 */
export async function openDashboardForm(page: Page, formType: string) {
  // Clica no item do menu correspondente ao formulário
  await page.click(TEST_CONFIG.SELECTORS.menuItem(formType));

  // Aguarda o formulário expandido aparecer
  await expect(page.locator(TEST_CONFIG.SELECTORS.expandedForm)).toBeVisible({
    timeout: TEST_CONFIG.DEFAULT_TIMEOUT
  });
}

/**
 * Fecha o formulário expandido no Dashboard
 * @param page - Página do Playwright
 */
export async function closeDashboardForm(page: Page) {
  // Clica no botão cancelar
  await page.click(TEST_CONFIG.SELECTORS.cancelButton);

  // Aguarda o formulário desaparecer
  await expect(page.locator(TEST_CONFIG.SELECTORS.expandedForm)).not.toBeVisible();
}

/**
 * Preenche um campo de texto
 * @param page - Página do Playwright
 * @param fieldName - Nome do campo
 * @param value - Valor a ser preenchido
 */
export async function fillField(page: Page, fieldName: string, value: string) {
  const selector = TEST_CONFIG.SELECTORS.formField(fieldName);
  await page.fill(selector, value);
}

/**
 * Seleciona uma opção em um campo select
 * @param page - Página do Playwright
 * @param fieldName - Nome do campo
 * @param optionValue - Valor da opção a ser selecionada
 */
export async function selectOption(page: Page, fieldName: string, optionValue: string) {
  const fieldSelector = TEST_CONFIG.SELECTORS.formField(fieldName);

  // Clica no campo select para abrir as opções
  await page.click(fieldSelector);

  // Clica na opção desejada
  await page.click(TEST_CONFIG.SELECTORS.selectOption(optionValue));
}

/**
 * Submete um formulário e aguarda resposta
 * @param page - Página do Playwright
 * @param expectSuccess - Se deve aguardar mensagem de sucesso (padrão: true)
 */
export async function submitForm(page: Page, expectSuccess: boolean = true) {
  // Clica no botão de submit
  await page.click(TEST_CONFIG.SELECTORS.submitButton);

  if (expectSuccess) {
    // Aguarda mensagem de sucesso ou fechamento do formulário
    await Promise.race([
      expect(page.locator(TEST_CONFIG.SELECTORS.successMessage)).toBeVisible(),
      expect(page.locator(TEST_CONFIG.SELECTORS.expandedForm)).not.toBeVisible()
    ]);
  }
}

/**
 * Verifica se há erro de validação em um campo
 * @param page - Página do Playwright
 * @param fieldName - Nome do campo
 * @param expectedError - Mensagem de erro esperada (opcional)
 */
export async function expectFieldError(page: Page, fieldName: string, expectedError?: string) {
  const errorSelector = `[data-testid="field-${fieldName}-error"]`;
  await expect(page.locator(errorSelector)).toBeVisible();

  if (expectedError) {
    await expect(page.locator(errorSelector)).toContainText(expectedError);
  }
}

/**
 * Preenche formulário de conta
 * @param page - Página do Playwright
 * @param accountData - Dados da conta
 */
export async function fillAccountForm(
  page: Page,
  accountData: AccountData = TEST_CONFIG.TEST_DATA.account
) {
  await fillField(page, 'nome', accountData.nome);
  await fillField(page, 'saldo', accountData.saldo);
  await fillField(page, 'descricao', accountData.descricao);
}

/**
 * Preenche formulário de categoria
 * @param page - Página do Playwright
 * @param categoryData - Dados da categoria
 */
export async function fillCategoryForm(
  page: Page,
  categoryData: CategoryData = TEST_CONFIG.TEST_DATA.category
) {
  await fillField(page, 'nome', categoryData.nome);
  await fillField(page, 'descricao', categoryData.descricao);
}

/**
 * Preenche formulário de receita
 * @param page - Página do Playwright
 * @param incomeData - Dados da receita
 */
export async function fillIncomeForm(
  page: Page,
  incomeData: IncomeData = TEST_CONFIG.TEST_DATA.income
) {
  await fillField(page, 'descricao', incomeData.descricao);
  await fillField(page, 'valor', incomeData.valor);
  await selectOption(page, 'categoria', incomeData.categoria);
}

/**
 * Preenche formulário de despesa
 * @param page - Página do Playwright
 * @param expenseData - Dados da despesa
 */
export async function fillExpenseForm(
  page: Page,
  expenseData: ExpenseData = TEST_CONFIG.TEST_DATA.expense
) {
  await fillField(page, 'descricao', expenseData.descricao);
  await fillField(page, 'valor', expenseData.valor);
  await selectOption(page, 'categoria', expenseData.categoria);
}

/**
 * Preenche formulário de transferência
 * @param page - Página do Playwright
 * @param transferData - Dados da transferência
 */
export async function fillTransferForm(
  page: Page,
  transferData: TransferData = TEST_CONFIG.TEST_DATA.transfer
) {
  await fillField(page, 'descricao', transferData.descricao);
  await fillField(page, 'valor', transferData.valor);
  // Selecionar contas origem e destino seria necessário dados específicos
}

/**
 * Aguarda carregamento de dados (spinner desaparecer)
 * @param page - Página do Playwright
 */
export async function waitForDataLoad(page: Page) {
  // Aguarda spinner aparecer (se houver)
  try {
    await expect(page.locator(TEST_CONFIG.SELECTORS.loadingSpinner)).toBeVisible({
      timeout: 2000
    });
  } catch {
    // Se não houver spinner, continua
  }

  // Aguarda spinner desaparecer
  await expect(page.locator(TEST_CONFIG.SELECTORS.loadingSpinner)).not.toBeVisible({
    timeout: TEST_CONFIG.API_RESPONSE_TIMEOUT
  });
}