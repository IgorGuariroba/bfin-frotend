import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Carrega variáveis de ambiente do arquivo .env.test
 * @see https://playwright.dev/docs/test-configuration
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENV_FILE = path.resolve(__dirname, '.env.test');
dotenv.config({ path: ENV_FILE });

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

  /* Configuração de projetos para principais browsers */
  projects: [
    /* Setup de autenticação global */
    {
      name: 'setup',
      testMatch: /setup\/.*\.setup\.ts/,
    },

    /* Testes que NÃO requerem autenticação (login, cadastro, etc.) */
    {
      name: 'chromium-auth',
      use: {
        ...devices['Desktop Chrome'],
      },
      testIgnore: /setup\/.*\.setup\.ts/,
    },

    /* Testes que requerem autenticação */
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
      testIgnore: [/auth\/.*\.spec\.ts/, /setup\/.*\.setup\.ts/],
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
      testIgnore: [/auth\/.*\.spec\.ts/, /setup\/.*\.setup\.ts/],
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
      testIgnore: [/auth\/.*\.spec\.ts/, /setup\/.*\.setup\.ts/],
    },

    /* Testes em mobile */
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
      testIgnore: [/auth\/.*\.spec\.ts/, /setup\/.*\.setup\.ts/],
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
      testIgnore: [/auth\/.*\.spec\.ts/, /setup\/.*\.setup\.ts/],
    },
  ],

  /* Configuração compartilhada para todos os projetos */
  use: {
    /* URL base para usar em ações como `await page.goto('/')`. */
    baseURL: 'http://localhost:5173',

    /* Executa sem interface gráfica (resolve problemas de dependências) */
    headless: true,

    /* Coleta traces no retry da primeira falha */
    trace: 'on-first-retry',

    /* Screenshot apenas quando há falha */
    screenshot: 'only-on-failure',

    /* Gravar vídeo apenas quando há falha */
    video: 'retain-on-failure',
  },

  /* Inicia o dev server antes de executar os testes */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});