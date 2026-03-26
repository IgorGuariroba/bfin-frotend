import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração do Playwright para testes E2E
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  /* Executa testes em arquivos paralelos */
  fullyParallel: true,
  /* Falha o build do CI se você acidentalmente deixou test.only no código */
  forbidOnly: !!process.env.CI,
  /* Retry em CI apenas */
  retries: process.env.CI ? 2 : 0,
  /* Opt out de relatórios paralelos no CI */
  workers: process.env.CI ? 1 : undefined,
  /* Configuração do relatório */
  reporter: 'html',

  /* Configuração compartilhada para todos os projetos */
  use: {
    /* URL base para usar em ações como `await page.goto('/')`. */
    baseURL: 'http://localhost:5173',

    /* Coleta traces no retry da primeira falha */
    trace: 'on-first-retry',

    /* Screenshot apenas quando há falha */
    screenshot: 'only-on-failure',

    /* Gravar vídeo apenas quando há falha */
    video: 'retain-on-failure',
  },

  /* Configuração de projetos para principais browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Testes em mobile */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* Inicia o dev server antes de executar os testes */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});