import { test, expect } from '@playwright/test';

/**
 * Testes E2E para formulário de receitas
 * @description Testa o fluxo completo de criação de receitas
 *
 * PRINCÍPIO: Seletores baseados em comportamento, nunca implementação
 * - getByRole: papel ARIA (button, textbox, combobox)
 * - getByLabel: label associado para acessibilidade
 * - getByText: texto visível que o usuário vê
 *
 * NUNCA usar: data-testid, className, id gerado, posição DOM
 */
test.describe('Formulário de Receita', () => {
  test.beforeEach(async ({ page }) => {
    // Assumindo que há autenticação prévia via fixture
    await page.goto('/dashboard');

    // Navegar para o formulário de receita
    await page.getByRole('button', { name: /nova receita|adicionar receita/i }).click();
    await page.waitForLoadState('networkidle');
  });

  test('deve exibir o formulário de receita corretamente', async ({ page }) => {
    // Verificar elementos principais pelo que o usuário vê
    await expect(page.getByText('Adicionar Receita')).toBeVisible();
    await expect(page.getByText('Registre uma nova entrada')).toBeVisible();

    // Verificar campos pelos labels de acessibilidade
    await expect(page.getByLabel(/descrição da receita/i)).toBeVisible();
    await expect(page.getByLabel(/categoria/i)).toBeVisible();
    await expect(page.getByLabel(/data de recebimento/i)).toBeVisible();

    // Verificar botões pelos rótulos acessíveis
    await expect(page.getByRole('button', { name: /confirmar depósito/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /cancelar/i })).toBeVisible();
  });

  test('deve criar uma receita com sucesso', async ({ page }) => {
    // Preencher valor monetário (usando input especial)
    const valueInput = page.locator('input[type="text"]').first(); // MonetaryValueInput
    await valueInput.fill('1500,00');

    // Preencher descrição pelo label
    await page.getByLabel(/descrição da receita/i).fill('Salário de março');

    // Selecionar categoria pelo combobox
    await page.getByLabel(/categoria/i).click();
    await page.getByText('Salário').click(); // Assumindo que categoria existe

    // Selecionar data pelo date picker
    await page.getByLabel(/data de recebimento/i).fill('2026-03-31');

    // Submeter formulário
    await page.getByRole('button', { name: /confirmar depósito/i }).click();

    // Verificar sucesso pela mensagem ou redirecionamento
    await expect(page.getByText(/depósito confirmado|receita criada/i)).toBeVisible();
  });

  test('deve validar campos obrigatórios', async ({ page }) => {
    // Tentar submeter sem preencher campos
    await page.getByRole('button', { name: /confirmar depósito/i }).click();

    // Verificar mensagens de erro por role="alert" ou texto visível
    await expect(page.getByRole('alert').or(page.getByText(/obrigatório/i)).first()).toBeVisible();
  });

  test('deve cancelar criação de receita', async ({ page }) => {
    // Preencher algum campo
    await page.getByLabel(/descrição da receita/i).fill('Teste');

    // Clicar em cancelar
    await page.getByRole('button', { name: /cancelar/i }).click();

    // Verificar retorno ao dashboard
    await expect(page.getByText('Dashboard')).toBeVisible();
    // Ou verificar URL se preferir: await expect(page).toHaveURL(/dashboard/);
  });

  test('deve permitir criar nova categoria', async ({ page }) => {
    // Clicar no botão de nova categoria (se existir)
    await page.getByRole('button', { name: /nova categoria|criar categoria/i }).click();

    // Preencher nome da categoria no modal
    await page.getByLabel(/nome da categoria/i).fill('Freelance');

    // Confirmar criação
    await page.getByRole('button', { name: /criar|salvar/i }).click();

    // Verificar que categoria aparece na lista
    await expect(page.getByText('Freelance')).toBeVisible();
  });

  test('deve mostrar estado de loading durante envio', async ({ page }) => {
    // Preencher formulário válido
    const valueInput = page.locator('input[type="text"]').first();
    await valueInput.fill('1000,00');
    await page.getByLabel(/descrição da receita/i).fill('Teste loading');

    // Submeter e verificar estado de loading
    await page.getByRole('button', { name: /confirmar depósito/i }).click();

    // Verificar que botão mostra loading
    await expect(page.getByRole('button', { name: /carregando|enviando/i })).toBeVisible();
  });

  // Teste de acessibilidade - pode navegar só com teclado
  test('deve ser navegável apenas com teclado', async ({ page }) => {
    // Usar Tab para navegar pelos campos
    await page.keyboard.press('Tab'); // Primeiro campo
    await page.keyboard.type('Receita teste');

    await page.keyboard.press('Tab'); // Próximo campo
    await page.keyboard.type('Categoria teste');

    // Chegar ao botão submit via Tab
    while (true) {
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluateHandle(() => document.activeElement);
      const tagName = await focusedElement.evaluate(el => el?.tagName);
      const type = await focusedElement.evaluate(el => el?.getAttribute('type'));

      if (tagName === 'BUTTON' && type === 'submit') {
        break;
      }
    }

    // Submeter com Enter
    await page.keyboard.press('Enter');

    // Verificar que formulário foi submetido
    await expect(page.getByText(/confirmado|criada/i)).toBeVisible();
  });
});