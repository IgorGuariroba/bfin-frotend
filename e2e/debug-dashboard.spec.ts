import { test } from '@playwright/test';
import { registerAndLogin } from './utils/auth-helpers';

test('debug dashboard interface', async ({ page }) => {
  // Faz login
  try {
    await registerAndLogin(page);
  } catch (error) {
    console.warn('Erro no login:', error);
    return;
  }

  // Aguarda um pouco para a página carregar
  await page.waitForTimeout(3000);

  // Lista todos os elementos clicáveis
  const clickableElements = await page.locator('button, a, [role="button"]').allTextContents();
  console.warn('Elementos clicáveis encontrados:', clickableElements);

  // Procura especificamente por elementos com texto relacionado a formulários
  const depositarElements = await page.locator('text=Depositar').count();
  const pagarElements = await page.locator('text=Pagar').count();
  const transferirElements = await page.locator('text=Transferir').count();

  console.warn(`Depositar encontrado: ${depositarElements} vez(es)`);
  console.warn(`Pagar encontrado: ${pagarElements} vez(es)`);
  console.warn(`Transferir encontrado: ${transferirElements} vez(es)`);

  // Procura por elementos do footer/botões
  const allButtons = await page.locator('button').allTextContents();
  console.warn('Todos os botões encontrados:', allButtons);
});