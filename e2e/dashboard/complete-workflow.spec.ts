import { test, expect } from '@playwright/test';
import { TEST_CONFIG, SUCCESS_MESSAGES } from '../utils/test-config';
import { login, logout } from '../utils/auth-helpers';
import {
  openDashboardForm,
  fillAccountForm,
  submitForm,
  fillField,
  selectOption,
  waitForDataLoad
} from '../utils/form-helpers';

/**
 * Testes E2E para Fluxo Completo de Uso da Aplicação
 * Simula um usuário real usando todas as principais funcionalidades
 */

test.describe('Fluxo Completo - Usuário Real', () => {
  test('fluxo completo: login → criar conta → receitas → despesas → transferência → logout', async ({ page }) => {
    // 1. AUTENTICAÇÃO
    await login(page);
    await expect(page.locator('[data-testid="dashboard-header"]')).toBeVisible();

    // 2. CRIAR CONTA PRINCIPAL
    await openDashboardForm(page, 'criar-conta');
    await fillAccountForm(page, {
      nome: 'Conta Corrente Principal',
      saldo: '0.00',
      descricao: 'Conta principal para movimentações do dia a dia'
    });
    await submitForm(page);
    await expect(page.locator(TEST_CONFIG.SELECTORS.successMessage))
      .toContainText(SUCCESS_MESSAGES.ACCOUNT_CREATED);

    // 3. CRIAR CONTA POUPANÇA
    await openDashboardForm(page, 'criar-conta');
    await fillAccountForm(page, {
      nome: 'Poupança',
      saldo: '5000.00',
      descricao: 'Conta poupança para reserva de emergência'
    });
    await submitForm(page);

    // 4. CRIAR CATEGORIA DE RECEITA
    await openDashboardForm(page, 'categoria');
    await fillField(page, 'nome', 'Salário');
    await selectOption(page, 'tipo', 'receita');
    await fillField(page, 'descricao', 'Salário mensal da empresa');
    await submitForm(page);

    // 5. ADICIONAR RECEITA (SALÁRIO)
    await openDashboardForm(page, 'receita');
    await waitForDataLoad(page);

    await fillField(page, 'descricao', 'Salário Março 2024');
    await fillField(page, 'valor', '8500.00');
    await selectOption(page, 'conta', 'conta-corrente-principal');
    await selectOption(page, 'categoria', 'salario');
    await submitForm(page);

    // Verifica atualização do saldo
    await expect(page.locator('[data-testid="balance-value"]'))
      .toContainText('8.500,00');

    // 6. CRIAR CATEGORIA DE DESPESA
    await openDashboardForm(page, 'categoria');
    await fillField(page, 'nome', 'Moradia');
    await selectOption(page, 'tipo', 'despesa');
    await fillField(page, 'descricao', 'Gastos com moradia (aluguel, condomínio, etc.)');
    await submitForm(page);

    // 7. ADICIONAR DESPESA FIXA (ALUGUEL)
    await openDashboardForm(page, 'despesa-fixa');
    await waitForDataLoad(page);

    await fillField(page, 'descricao', 'Aluguel Março 2024');
    await fillField(page, 'valor', '1800.00');
    await selectOption(page, 'conta', 'conta-corrente-principal');
    await selectOption(page, 'categoria', 'moradia');
    await submitForm(page);

    // 8. ADICIONAR DESPESA VARIÁVEL (SUPERMERCADO)
    await openDashboardForm(page, 'despesa-variavel');
    await waitForDataLoad(page);

    await fillField(page, 'descricao', 'Compras no supermercado');
    await fillField(page, 'valor', '350.00');
    await selectOption(page, 'conta', 'conta-corrente-principal');
    await selectOption(page, 'categoria', 'alimentacao');
    await submitForm(page);

    // 9. TRANSFERÊNCIA PARA POUPANÇA
    await openDashboardForm(page, 'transferencia');
    await waitForDataLoad(page);

    await fillField(page, 'descricao', 'Reserva de emergência');
    await fillField(page, 'valor', '1000.00');
    await selectOption(page, 'conta-origem', 'conta-corrente-principal');
    await selectOption(page, 'conta-destino', 'poupanca');
    await submitForm(page);

    // 10. VERIFICAR SALDO FINAL
    // Saldo inicial: 0 + Receita: 8500 - Despesas: 2150 - Transferência: 1000 = 5350
    await expect(page.locator('[data-testid="conta-corrente-balance"]'))
      .toContainText('5.350,00');

    await expect(page.locator('[data-testid="poupanca-balance"]'))
      .toContainText('6.000,00'); // 5000 inicial + 1000 transferência

    // 11. VERIFICAR EXTRATO
    await openDashboardForm(page, 'extrato');
    await waitForDataLoad(page);

    // Verifica se todas as transações aparecem no extrato
    await expect(page.locator('[data-testid="transaction-salario"]')).toBeVisible();
    await expect(page.locator('[data-testid="transaction-aluguel"]')).toBeVisible();
    await expect(page.locator('[data-testid="transaction-supermercado"]')).toBeVisible();
    await expect(page.locator('[data-testid="transaction-transferencia"]')).toBeVisible();

    // 12. VERIFICAR RELATÓRIOS
    await openDashboardForm(page, 'hist-financeiro');
    await waitForDataLoad(page);

    // Verifica se o histórico financeiro está sendo exibido
    await expect(page.locator('[data-testid="monthly-summary"]')).toBeVisible();
    await expect(page.locator('[data-testid="income-total"]')).toContainText('8.500,00');
    await expect(page.locator('[data-testid="expense-total"]')).toContainText('2.150,00');

    // 13. LOGOUT
    await logout(page);
    await expect(page).toHaveURL(TEST_CONFIG.LOGIN_URL);
  });

  test('fluxo de usuário com empréstimo e limite diário', async ({ page }) => {
    // 1. AUTENTICAÇÃO
    await login(page);

    // 2. CRIAR EMPRÉSTIMO
    await openDashboardForm(page, 'emprestimo');
    await waitForDataLoad(page);

    await fillField(page, 'descricao', 'Financiamento Carro');
    await fillField(page, 'valor', '45000.00');
    await fillField(page, 'taxa-juros', '1.2');
    await fillField(page, 'parcelas', '48');
    await selectOption(page, 'conta', 'conta-principal');
    await submitForm(page);

    // 3. CONFIGURAR LIMITE DIÁRIO
    await openDashboardForm(page, 'limite-diario');

    await fillField(page, 'limite', '200.00');
    await selectOption(page, 'categoria', 'alimentacao');
    await submitForm(page);

    // 4. TESTAR LIMITE DIÁRIO
    // Primeira despesa dentro do limite
    await openDashboardForm(page, 'despesa-variavel');
    await waitForDataLoad(page);

    await fillField(page, 'descricao', 'Lanche');
    await fillField(page, 'valor', '50.00');
    await selectOption(page, 'categoria', 'alimentacao');
    await submitForm(page);

    // Segunda despesa que ultrapassaria o limite
    await openDashboardForm(page, 'despesa-variavel');
    await fillField(page, 'descricao', 'Jantar caro');
    await fillField(page, 'valor', '180.00');
    await selectOption(page, 'categoria', 'alimentacao');
    await submitForm(page, false);

    // Deve exibir aviso de limite
    await expect(page.locator('[data-testid="limit-warning"]')).toBeVisible();
    await expect(page.locator('[data-testid="limit-warning"]'))
      .toContainText('Limite diário excedido');

    // 5. VERIFICAR CALENDAR VIEW
    await openDashboardForm(page, 'calendario');
    await waitForDataLoad(page);

    // Navega pelos meses
    await page.click('[data-testid="next-month"]');
    await page.click('[data-testid="prev-month"]');

    // Clica em um dia específico
    await page.click('[data-testid="day-15"]');

    // Verifica detalhes do dia
    await expect(page.locator('[data-testid="day-details"]')).toBeVisible();
  });

  test('fluxo de gestão de categorias e contas múltiplas', async ({ page }) => {
    await login(page);

    // 1. CRIAR MÚLTIPLAS CATEGORIAS
    const categorias = [
      { nome: 'Transporte', tipo: 'despesa', descricao: 'Gastos com transporte' },
      { nome: 'Lazer', tipo: 'despesa', descricao: 'Entretenimento e lazer' },
      { nome: 'Freelance', tipo: 'receita', descricao: 'Trabalhos extras' },
      { nome: 'Investimentos', tipo: 'receita', descricao: 'Rendimentos de investimentos' }
    ];

    for (const categoria of categorias) {
      await openDashboardForm(page, 'categoria');
      await fillField(page, 'nome', categoria.nome);
      await selectOption(page, 'tipo', categoria.tipo);
      await fillField(page, 'descricao', categoria.descricao);
      await submitForm(page);
    }

    // 2. CRIAR MÚLTIPLAS CONTAS
    const contas = [
      { nome: 'Conta Investimentos', saldo: '10000.00', descricao: 'Conta para investimentos' },
      { nome: 'Conta Gastos', saldo: '2000.00', descricao: 'Conta para gastos do dia a dia' },
      { nome: 'Conta Reserva', saldo: '15000.00', descricao: 'Reserva de emergência' }
    ];

    for (const conta of contas) {
      await openDashboardForm(page, 'criar-conta');
      await fillAccountForm(page, conta);
      await submitForm(page);
    }

    // 3. REALIZAR TRANSAÇÕES ENTRE DIFERENTES CONTAS
    // Receita de freelance na conta investimentos
    await openDashboardForm(page, 'receita');
    await waitForDataLoad(page);

    await fillField(page, 'descricao', 'Projeto Freelance Site');
    await fillField(page, 'valor', '3500.00');
    await selectOption(page, 'conta', 'conta-investimentos');
    await selectOption(page, 'categoria', 'freelance');
    await submitForm(page);

    // Despesa de transporte na conta gastos
    await openDashboardForm(page, 'despesa-variavel');
    await waitForDataLoad(page);

    await fillField(page, 'descricao', 'Combustível');
    await fillField(page, 'valor', '180.00');
    await selectOption(page, 'conta', 'conta-gastos');
    await selectOption(page, 'categoria', 'transporte');
    await submitForm(page);

    // 4. MÚLTIPLAS TRANSFERÊNCIAS
    // Transferência para equalizar contas
    await openDashboardForm(page, 'transferencia');
    await waitForDataLoad(page);

    await fillField(page, 'descricao', 'Reposição conta gastos');
    await fillField(page, 'valor', '500.00');
    await selectOption(page, 'conta-origem', 'conta-reserva');
    await selectOption(page, 'conta-destino', 'conta-gastos');
    await submitForm(page);

    // 5. VERIFICAR TODAS AS TRANSAÇÕES
    await openDashboardForm(page, 'todas-transacoes');
    await waitForDataLoad(page);

    // Filtra por categoria
    await selectOption(page, 'filtro-categoria', 'freelance');
    await expect(page.locator('[data-testid="transaction-freelance"]')).toBeVisible();

    // Filtra por conta
    await selectOption(page, 'filtro-conta', 'conta-gastos');
    await expect(page.locator('[data-testid="transaction-combustivel"]')).toBeVisible();

    // 6. VERIFICAR SALDOS FINAIS
    const saldosEsperados = {
      'conta-investimentos': '13.500,00', // 10000 + 3500
      'conta-gastos': '2.320,00', // 2000 - 180 + 500
      'conta-reserva': '14.500,00' // 15000 - 500
    };

    for (const [conta, saldo] of Object.entries(saldosEsperados)) {
      await expect(page.locator(`[data-testid="${conta}-balance"]`))
        .toContainText(saldo);
    }
  });
});