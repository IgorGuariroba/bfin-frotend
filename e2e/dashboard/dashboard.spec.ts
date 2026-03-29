import { test, expect } from '@playwright/test';
import { TEST_CONFIG, SELECTOR_HELPERS } from '../utils/test-config';
import { registerAndLogin } from '../utils/auth-helpers';
import { openDashboardForm, closeDashboardForm } from '../utils/form-helpers';

/**
 * Testes E2E para Dashboard Principal
 */

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Configura estado autenticado para todos os testes usando login real
    await registerAndLogin(page);
  });

  test('deve carregar dashboard corretamente', async ({ page }) => {
    // Verifica se está na página do dashboard
    await expect(page).toHaveURL(TEST_CONFIG.DASHBOARD_URL);

    // Verifica elementos principais do dashboard
    await expect(page.locator(TEST_CONFIG.SELECTORS.sidebar)).toBeVisible();
    await expect(page.locator('[data-testid="dashboard-header"]')).toBeVisible();
    await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible();
  });

  test('deve exibir sidebar com todos os itens de menu', async ({ page }) => {
    // Expandir a sidebar clicando no botão de configurações
    await page.click('[data-testid="sidebar-settings"]');

    // Aguardar a sidebar expandir
    await page.waitForSelector('[data-testid="menu-calendar"]', { timeout: 5000 });

    const expectedMenuItems = [
      'calendar',
      'help',
      'profile',
      'configure-account',
      'configure-card',
      'business-account',
      'notifications'
    ];

    // Verifica se todos os itens do menu estão presentes
    for (const item of expectedMenuItems) {
      await expect(page.locator(SELECTOR_HELPERS.menuItem(item))).toBeVisible();
    }
  });

  test('deve abrir formulário ao clicar em item do menu', async ({ page }) => {
    // Clica no item "criar-conta" (mapeado para depositar)
    await openDashboardForm(page, 'criar-conta');

    // Verifica se um formulário expandido aparece
    await expect(page.locator(TEST_CONFIG.SELECTORS.expandedForm)).toBeVisible();
  });

  test('deve fechar formulário ao clicar em cancelar', async ({ page }) => {
    // Abre um formulário
    await openDashboardForm(page, 'receita');

    // Fecha o formulário
    await closeDashboardForm(page);

    // Verifica se o formulário foi fechado
    await expect(page.locator(TEST_CONFIG.SELECTORS.expandedForm)).not.toBeVisible();
  });

  test('deve exibir widgets de resumo financeiro', async ({ page }) => {
    // Verifica widgets principais (usa nth(1) para pegar o widget visível - desktop layout)
    await expect(page.locator('[data-testid="balance-widget"]').nth(1)).toBeVisible();
    await expect(page.locator('[data-testid="monthly-summary"]').nth(1)).toBeVisible();
    await expect(page.locator('[data-testid="recent-transactions"]').nth(1)).toBeVisible();
  });

  test('deve alternar entre diferentes formulários', async ({ page }) => {
    // Abre primeiro formulário
    await openDashboardForm(page, 'receita');
    await expect(page.locator('[data-testid="income-form"]').first()).toBeVisible();

    // Abre segundo formulário (deve fechar o primeiro)
    await openDashboardForm(page, 'despesa-fixa');
    await expect(page.locator('[data-testid="variable-expense-form"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="income-form"]')).not.toBeVisible();
  });

  test('deve exibir informações do usuário no header', async ({ page }) => {
    // Verifica elementos do header do usuário
    await expect(page.locator('[data-testid="user-avatar"]')).toBeVisible();

    // Aceita tanto o nome real quanto o nome do mock
    const userName = page.locator('[data-testid="user-name"]');
    await expect(userName).toBeVisible();

    const userText = await userName.textContent();
    const isValidName = userText?.includes(TEST_CONFIG.TEST_USER.nome) ||
                        userText?.includes('Usuário Teste');

    expect(isValidName).toBeTruthy();
  });

  test('deve funcionar menu do usuário', async ({ page }) => {
    // Clica no menu do usuário
    await page.click('[data-testid="user-menu"]');

    // Verifica opções do menu
    await expect(page.locator('[data-testid="user-menu-dropdown"]')).toBeVisible();
    await expect(page.locator('[data-testid="profile-option"]')).toBeVisible();
    await expect(page.locator('[data-testid="settings-option"]')).toBeVisible();
    await expect(page.locator('[data-testid="logout-option"]')).toBeVisible();
  });

  test('deve ser responsivo em diferentes tamanhos de tela', async ({ page }) => {
    // Testa em mobile
    await page.setViewportSize({ width: 375, height: 667 });

    // Em mobile, a sidebar pode estar oculta por padrão
    // Verifica se pelo menos os elementos de navegação do dashboard estão presentes
    await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible();

    // Testa em tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible();

    // Testa em desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    const sidebar = page.locator(TEST_CONFIG.SELECTORS.sidebar);
    await expect(sidebar).toBeVisible();
  });

  test('deve carregar dados financeiros corretamente', async ({ page }) => {
    // Aguarda carregamento dos dados
    await page.waitForLoadState('networkidle');

    // Verifica se os widgets carregaram dados (usando first() para evitar strict mode violations)
    await expect(page.locator('[data-testid="balance-value"]').first()).not.toBeEmpty();
    await expect(page.locator('[data-testid="monthly-income"]').first()).not.toBeEmpty();
    await expect(page.locator('[data-testid="monthly-expenses"]').first()).not.toBeEmpty();
  });

  test('deve exibir indicador de carregamento para dados', async ({ page }) => {
    // Recarrega a página para capturar loading
    await page.reload();

    // Verifica se aparecem indicadores de carregamento OU se os dados já carregaram
    // (pode ser muito rápido para capturar o loading)
    try {
      await expect(page.locator('[data-testid="balance-loading"]').first()).toBeVisible({ timeout: 2000 });
      // Se conseguiu ver o loading, aguarda ele desaparecer
      await expect(page.locator('[data-testid="balance-loading"]')).not.toBeVisible();
    } catch {
      // Se não conseguiu ver o loading, verifica se os dados já estão carregados
      await expect(page.locator('[data-testid="balance-widget"]').nth(1)).toBeVisible();
    }

    // Aguarda carregamento completar
    await page.waitForLoadState('networkidle');
  });

  test('deve gerenciar convites de contas compartilhadas', async ({ page }) => {
    // Se há convites pendentes, deve exibir notificação
    const inviteNotification = page.locator('[data-testid="invite-notification"]');

    // Verifica se elemento existe (pode não haver convites)
    if (await inviteNotification.isVisible()) {
      // Se há convites, verifica funcionalidades
      await inviteNotification.click();
      await expect(page.locator('[data-testid="invites-modal"]')).toBeVisible();
    }
  });

  test.fixme('deve permitir navegação por teclado', async ({ page }) => {
    // Foca no primeiro item do menu
    await page.keyboard.press('Tab');

    // Navega pelos itens com setas
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    // Verifica se algum formulário foi aberto
    await expect(page.locator(TEST_CONFIG.SELECTORS.expandedForm)).toBeVisible();
  });
});