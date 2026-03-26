# 🎭 Workflows E2E - GitHub Actions

Documentação dos workflows de testes End-to-End configurados no GitHub Actions.

## 📋 Workflows Disponíveis

### 1. **CI Pipeline** (`ci.yml`)
Workflow principal que executa em pushes para `main`/`develop` e pull requests.

**Quando executa:**
- Push para branches `main` ou `develop`
- Pull requests para `main` ou `develop`

**E2E Job:**
- ✅ Instala todas as dependências
- ✅ Configura Playwright com todos os browsers
- ✅ Executa build da aplicação
- ✅ Roda testes E2E básicos (Chromium)
- ✅ Upload de artifacts em caso de falha

### 2. **E2E Comprehensive** (`e2e.yml`)
Workflow completo para testes E2E em múltiplos browsers e dispositivos.

**Quando executa:**
- ⚙️ Manualmente (workflow_dispatch)
- 🕐 Agendado (2:00 AM UTC diariamente)
- 🚀 Em releases publicadas

**Recursos:**
- 🌐 Testa em Chromium, Firefox, WebKit
- 📱 Testa em Mobile Chrome e Mobile Safari
- 🎛️ Configurações customizáveis (browser, padrões, modo headed)
- 📊 Relatórios detalhados e artifacts

### 3. **E2E for PR** (`e2e-pr.yml`)
Workflow otimizado para Pull Requests com feedback rápido.

**Quando executa:**
- 📝 Pull requests para `main`/`develop`
- 🎯 Apenas quando há mudanças relevantes

**Estratégia:**
- 🚀 **Smoke Tests**: Testes críticos em ~5min
- 🧪 **Full Tests**: Todos os testes se smoke tests passarem
- 📊 **Análise de mudanças**: Detecta o que foi alterado
- 💬 **Comentários automáticos**: Feedback direto na PR

## 🚀 Como Usar

### Execução Manual (Workflow Dispatch)

1. Va para **Actions** no GitHub
2. Selecione **"E2E Tests"**
3. Clique em **"Run workflow"**
4. Configure as opções:
   - **Browser**: chromium, firefox, webkit, ou all
   - **Test Pattern**: padrão específico (opcional)
   - **Headed**: executar com browser visível

```bash
# Exemplos de padrões de teste:
auth/          # Apenas testes de autenticação
forms/         # Apenas testes de formulários
-g "login"     # Apenas testes com "login" no nome
```

### Execução Local vs CI

| Comando Local | Equivalente CI |
|---------------|----------------|
| `npm run test:e2e` | Smoke tests |
| `npm run test:e2e -- --project=chromium` | CI básico |
| `npm run test:e2e -- --project=all` | Comprehensive |
| `npm run test:e2e:headed` | Manual com headed=true |

## 📊 Artifacts e Relatórios

### O que é salvo em caso de falha:

**CI Pipeline:**
- 📁 `e2e-results/` - Resultados e traces
- 📁 `e2e-media/` - Screenshots e vídeos

**E2E Comprehensive:**
- 📁 `e2e-report-{browser}-{status}/` - Relatórios por browser
- 📁 `e2e-media-{browser}/` - Mídia por browser

**E2E for PR:**
- 📁 `smoke-test-results/` - Resultados dos smoke tests
- 📁 `full-e2e-results/` - Resultados completos

### Como acessar:

1. Va para a execução do workflow
2. Scroll até **"Artifacts"**
3. Download do artifact desejado
4. Extraia e abra `index.html` para relatório visual

## ⚙️ Configurações Avançadas

### Variáveis de Ambiente

```yaml
env:
  # Configurações do Playwright
  PLAYWRIGHT_BASE_URL: http://localhost:5173
  PLAYWRIGHT_BROWSERS_PATH: ~/.cache/ms-playwright

  # Configurações da aplicação
  VITE_API_BASE_URL: http://localhost:3001
  CI: true
  FORCE_COLOR: 1
```

### Matrix Strategy

Os workflows usam matrix para executar em paralelo:

```yaml
strategy:
  fail-fast: false
  matrix:
    project: [chromium, firefox, webkit]
    # ou
    device: ['Mobile Chrome', 'Mobile Safari']
```

### Otimizações de Performance

1. **Cache de browsers**: Browsers são cacheados entre execuções
2. **Execução condicional**: Jobs só executam quando necessário
3. **Fail-fast desabilitado**: Um browser failing não para os outros
4. **Timeouts configurados**: Evita jobs travados

## 📱 Estratégias por Tipo de Change

### Mudanças em Componentes UI
```yaml
# Executa testes focados em forms e dashboard
paths:
  - 'src/components/**'
```

### Mudanças em E2E Tests
```yaml
# Executa validação dos próprios testes
paths:
  - 'e2e/**'
  - 'playwright.config.ts'
```

### Mudanças de Build
```yaml
# Executa testes completos
paths:
  - 'package*.json'
  - 'vite.config.ts'
```

## 🐛 Troubleshooting

### Testes Falhando no CI mas Passando Localmente

**Causas comuns:**
- Diferenças de timing (CI mais lento)
- Diferenças de ambiente (fonts, etc.)
- Dependências não instaladas
- Variáveis de ambiente diferentes

**Soluções:**
```yaml
# Aumentar timeouts
timeout-minutes: 60

# Aguardar network idle
await page.waitForLoadState('networkidle')

# Usar retry em CI
retries: process.env.CI ? 2 : 0
```

### Artifacts não Sendo Gerados

**Verificar:**
- Job está falhando como esperado?
- Path dos artifacts está correto?
- Retenção não expirou?

**Fix:**
```yaml
- name: Upload artifacts
  uses: actions/upload-artifact@v4
  if: always()  # sempre executar, não apenas em falha
```

### Performance Lenta

**Otimizações:**
- Use apenas Chromium para PRs
- Cache browsers entre execuções
- Execute apenas testes relevantes
- Use workers apropriados para o runner

## 📈 Monitoramento e Métricas

### GitHub Insights

- **Actions**: Tempo médio de execução
- **Pull Requests**: Taxa de sucesso
- **Issues**: Problemas relacionados a E2E

### Alertas Recomendados

1. **Falha em smoke tests**: Notificação imediata
2. **Falha recorrente**: Após 3 falhas seguidas
3. **Performance degradada**: Tempo > 30min

### Relatórios Semanais

- Taxa de sucesso por browser
- Testes mais lentos
- Cobertura de funcionalidades
- Artifacts mais baixados

## 🔄 Evolução dos Workflows

### Próximas Melhorias

- [ ] Testes paralelos por funcionalidade
- [ ] Integração com Slack/Teams
- [ ] Deploy de preview para E2E
- [ ] Testes de performance
- [ ] Testes de acessibilidade
- [ ] Comparação visual automática

### Feedback e Melhorias

Para sugerir melhorias nos workflows:

1. Abra issue com label `workflow`
2. Descreva o problema/sugestão
3. Inclua exemplos de execução
4. Proponha solução se possível