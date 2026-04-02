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
const ENV_LOCAL_FILE = path.resolve(__dirname, '.env.test.local');

// Carregar .env.test primeiro, depois .env.test.local (se existir)
dotenv.config({ path: ENV_FILE });
dotenv.config({ path: ENV_LOCAL_FILE, override: true });

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

  /* Configuração simplificada - apenas Chrome para teste básico */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Configuração compartilhada para todos os projetos */
  use: {
    /* URL base para usar em ações como `await page.goto('/')`. */
    baseURL: process.env.CI ? 'http://localhost:4173' : 'http://localhost:5173',

    /* Executa sem interface gráfica (resolve problemas de dependências) */
    headless: true,

    /* Coleta traces no retry da primeira falha */
    trace: 'on-first-retry',

    /* Screenshot apenas quando há falha */
    screenshot: 'only-on-failure',

    /* Gravar vídeo apenas quando há falha */
    video: 'retain-on-failure',
  },

  /* Inicia o servidor antes de executar os testes */
  webServer: {
    command: process.env.CI ? 'npm run preview' : 'npm run dev',
    url: process.env.CI ? 'http://localhost:4173' : 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});