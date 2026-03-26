# 📋 Exemplos de Uso - Testes E2E

Exemplos práticos de como executar e personalizar os testes E2E para diferentes cenários.

## 🚀 Execução Básica

### Executar todos os testes
```bash
npm run test:e2e
```

### Executar testes específicos
```bash
# Apenas testes de autenticação
npx playwright test auth/

# Apenas formulário de receita
npx playwright test forms/income.spec.ts

# Teste específico por nome
npx playwright test -g "deve realizar login com credenciais válidas"
```

### Executar em browsers específicos
```bash
# Apenas Chrome
npx playwright test --project=chromium

# Apenas Firefox
npx playwright test --project=firefox

# Apenas Mobile
npx playwright test --project="Mobile Chrome"
```

## 🔍 Debug e Desenvolvimento

### Modo Debug Interativo
```bash
# Debug com pausas automáticas
npm run test:e2e:debug

# Debug teste específico
npx playwright test auth/login.spec.ts --debug
```

### Executar com Browser Visível
```bash
# Modo headed (browser visível)
npm run test:e2e:headed

# Com velocidade reduzida
npx playwright test --headed --slow-mo=1000
```

### Executar Interface Visual
```bash
# Interface web do Playwright
npm run test:e2e:ui
```

## 📊 Relatórios e Resultados

### Gerar Relatório HTML
```bash
# Executar testes e gerar relatório
npm run test:e2e
npm run test:e2e:report
```

### Ver Últimos Resultados
```bash
# Abrir último relatório sem executar testes
npx playwright show-report
```

### Captura de Screenshots/Videos
```bash
# Sempre capturar screenshots
npx playwright test --screenshot=on

# Sempre gravar vídeos
npx playwright test --video=on

# Capturar traces para debug
npx playwright test --trace=on
```

## ⚙️ Configurações Avançadas

### Executar com Configuração Personalizada
```bash
# Usar arquivo de configuração específico
npx playwright test --config=playwright.config.ci.ts

# Sobrescrever base URL
PLAYWRIGHT_BASE_URL=http://localhost:3000 npm run test:e2e

# Executar com timeout maior
npx playwright test --timeout=60000
```

### Paralelização
```bash
# Executar em paralelo (máximo)
npx playwright test --workers=max

# Executar sequencial
npx playwright test --workers=1

# Executar em workers específicos
npx playwright test --workers=4
```

### Retry e Repetição
```bash
# Executar com retry automático
npx playwright test --retries=2

# Repetir teste específico 5 vezes
npx playwright test auth/login.spec.ts --repeat-each=5
```

## 🎯 Cenários Específicos

### Desenvolvimento Local
```bash
# Executar apenas testes críticos em desenvolvimento
npx playwright test -g "fluxo completo"

# Executar sem videos/screenshots para performance
npx playwright test --video=off --screenshot=off
```

### CI/CD Pipeline
```bash
# Configuração otimizada para CI
CI=true npx playwright test --reporter=github
```

### Testes de Smoke (Básicos)
```bash
# Apenas testes de login e dashboard
npx playwright test auth/login.spec.ts dashboard/dashboard.spec.ts
```

### Testes de Regressão Completos
```bash
# Todos os fluxos completos
npx playwright test dashboard/complete-workflow.spec.ts
```

## 🛠 Personalização de Dados

### Usando Diferentes Dados de Teste
```typescript
// No teste
test('criar conta com dados customizados', async ({ page }) => {
  await setAuthenticatedState(page);
  await openDashboardForm(page, 'criar-conta');

  // Dados customizados para este teste específico
  await fillAccountForm(page, {
    nome: 'Conta Teste Personalizada',
    saldo: '999.99',
    descricao: 'Dados específicos para este cenário'
  });

  await submitForm(page);
});
```

### Executar com Mock de API
```typescript
test.beforeEach(async ({ page }) => {
  // Mock de resposta da API
  await page.route('**/api/v1/accounts', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([
        { id: 1, nome: 'Conta Mock', saldo: 1000 }
      ])
    });
  });
});
```

## 🔧 Troubleshooting

### Testes Falhando
```bash
# Executar apenas testes que falharam
npx playwright test --last-failed

# Executar com timeout maior
npx playwright test --timeout=60000

# Executar com retry automático
npx playwright test --retries=3
```

### Performance
```bash
# Executar apenas em Chrome para velocidade
npx playwright test --project=chromium

# Desabilitar videos/screenshots
npx playwright test --video=off --screenshot=off

# Reduzir workers para máquinas mais fracas
npx playwright test --workers=1
```

### Debug de Seletores
```typescript
// No teste, para verificar se elemento existe
await expect(page.locator('[data-testid="botao"]')).toBeVisible();

// Para aguardar elemento aparecer
await page.waitForSelector('[data-testid="botao"]', { timeout: 10000 });

// Para listar todos os elementos
const elementos = await page.locator('[data-testid*="botao"]').count();
console.log(`Encontrados ${elementos} botões`);
```

## 📱 Testes Mobile

### Simular Dispositivos Específicos
```bash
# iPhone específico
npx playwright test --project="iPhone 12"

# Android específico
npx playwright test --project="Galaxy S9+"

# Tablet
npx playwright test --project="iPad Pro"
```

### Teste Responsivo Manual
```typescript
test('responsividade customizada', async ({ page }) => {
  // Simular breakpoint específico
  await page.setViewportSize({ width: 768, height: 1024 });

  // Testar funcionalidades neste tamanho
  await login(page);
  await expect(page.locator('[data-testid="sidebar-mobile"]')).toBeVisible();
});
```

## 🌍 Execução em Diferentes Ambientes

### Ambiente de Desenvolvimento
```bash
# Com aplicação local
PLAYWRIGHT_BASE_URL=http://localhost:5173 npm run test:e2e
```

### Ambiente de Staging
```bash
# Com aplicação de staging
PLAYWRIGHT_BASE_URL=https://staging.bfin.com.br npm run test:e2e
```

### Ambiente de Produção (Smoke Tests)
```bash
# Apenas testes críticos em produção
PLAYWRIGHT_BASE_URL=https://bfin.com.br npx playwright test -g "smoke"
```