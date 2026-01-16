# 🚀 CI/CD - BFIN Frontend

Este documento descreve o pipeline de CI/CD configurado para o projeto BFIN Frontend.

---

## 📋 Visão Geral

O projeto possui dois workflows principais:

1. **CI Pipeline** (`ci.yml`) - Executa em push/PR para `main` e `develop`
2. **Deploy** (`deploy.yml`) - Executa deploy automático em push para `main`

---

## 🔄 CI Pipeline

### Quando Executa
- Push para branches `main` ou `develop`
- Pull Requests para `main` ou `develop`

### Jobs

#### 1️⃣ Code Quality (🔍)
Verifica a qualidade do código:

- **TypeScript Check**: `tsc --noEmit`
- **ESLint**: `npm run lint`
- **Security Audit**: `npm audit --audit-level=moderate`

#### 2️⃣ Tests (🧪)
Executa testes automatizados:

- **Vitest**: Testes unitários e de integração
- **Playwright**: Testes E2E (browser)
- **Coverage**: Gera relatório de cobertura

**Artefatos gerados:**
- `coverage/` - Relatório de cobertura
- `test-results/` - Resultados dos testes

#### 3️⃣ Build Validation (🏗️)
Valida se o build funciona:

- **Build**: `npm run build`
- **Build Stats**: Relatório de tamanho dos arquivos

**Artefatos gerados:**
- `dist/` - Build de produção

#### 4️⃣ Storybook (📖)
Build do Storybook (apenas em push para `main`):

- **Build Storybook**: `npm run build-storybook`

**Artefatos gerados:**
- `storybook-static/` - Build do Storybook

#### 5️⃣ Summary (✅)
Gera relatório final com status de todos os jobs.

---

## 🚀 Deploy Pipeline

### Quando Executa
- Push para branch `main`
- Manualmente via GitHub Actions UI

### Steps

1. **Checkout code**
2. **Setup Node.js**
3. **Setup NPM Authentication**
4. **Install dependencies**
5. **TypeScript Check**
6. **Build Application**
7. **Trigger Render Deploy** (webhook)

---

## 🔐 Secrets Necessários

Configure os seguintes secrets no GitHub:

### Repository Secrets

| Secret | Descrição | Como Obter |
|--------|-----------|------------|
| `NPM_TOKEN` | Token do GitHub para acessar SDK privado | [GitHub Settings > Tokens](https://github.com/settings/tokens) |
| `VITE_API_BASE_URL` | URL base da API (opcional para CI, recomendado para deploy) | Ex: `https://bfin-backend.onrender.com` |
| `RENDER_DEPLOY_HOOK_URL` | Webhook do Render para deploy (opcional) | Render Dashboard > Settings > Deploy Hook |

### Como Configurar Secrets

1. Acesse: `https://github.com/SEU_USUARIO/bfin-frontend/settings/secrets/actions`
2. Clique em **"New repository secret"**
3. Adicione cada secret da tabela acima

---

## 📦 NPM Token (GitHub Packages)

O projeto usa o SDK privado `@igorguariroba/bfin-sdk` hospedado no GitHub Packages.

### Criar Token

1. Acesse: https://github.com/settings/tokens
2. Clique em **"Generate new token (classic)"**
3. Nome: `BFIN CI/CD`
4. Marque a permissão: **`read:packages`**
5. Clique em **"Generate token"**
6. Copie o token (começa com `ghp_`)

### Configurar no GitHub

1. Vá em: Repository Settings > Secrets > Actions
2. Adicione o secret `NPM_TOKEN` com o token copiado

---

## 🎯 Fluxo de Trabalho

### Para Desenvolvimento

```bash
# 1. Criar branch de feature
git checkout -b feature/minha-feature

# 2. Fazer alterações e commitar
git add .
git commit -m "feat: adiciona nova funcionalidade"

# 3. Push da branch
git push origin feature/minha-feature

# 4. Abrir Pull Request no GitHub
# O CI vai executar automaticamente:
# - Code Quality
# - Tests
# - Build Validation
```

### Para Deploy

```bash
# 1. Merge do PR na branch main
# O CI executa novamente

# 2. Se tudo passar, o Deploy executa automaticamente
# - Build da aplicação
# - Trigger do webhook do Render
# - Render faz deploy automático
```

---

## 🔧 Scripts Locais

Execute localmente antes de fazer push:

```bash
# TypeScript check
npm run type-check

# ESLint
npm run lint

# Testes
npm test

# Testes com UI
npm run test:ui

# Testes com coverage
npm run test:coverage

# Build
npm run build

# Validação completa (como no CI)
npm run type-check && npm run lint && npm test -- --run && npm run build
```

---

## 📊 Monitoramento

### GitHub Actions

Acesse: `https://github.com/SEU_USUARIO/bfin-frontend/actions`

- Visualize execuções passadas
- Veja logs detalhados
- Baixe artefatos gerados

### Render Dashboard

Acesse: https://dashboard.render.com

- Visualize deploys
- Veja logs de build
- Monitore aplicação em produção

---

## 🐛 Troubleshooting

### ❌ Erro: NPM_TOKEN não configurado

**Problema**:
```
npm error code E401
npm error 401 Unauthorized
```

**Solução**:
1. Verifique se o secret `NPM_TOKEN` está configurado
2. Gere novo token: https://github.com/settings/tokens
3. Atualize o secret no GitHub

### ❌ Erro: TypeScript falha

**Problema**:
```
error TS2322: Type 'string' is not assignable to type 'number'
```

**Solução**:
1. Execute localmente: `npm run type-check`
2. Corrija os erros de tipo
3. Commit e push novamente

### ❌ Erro: ESLint falha

**Problema**:
```
error  'useState' is not defined  no-undef
```

**Solução**:
1. Execute localmente: `npm run lint`
2. Corrija os erros de linting
3. Commit e push novamente

### ❌ Erro: Testes falham

**Problema**:
```
FAIL  src/components/Button.test.tsx
```

**Solução**:
1. Execute localmente: `npm test`
2. Corrija os testes que falharam
3. Commit e push novamente

### ❌ Erro: Build falha

**Problema**:
```
error during build:
Error: Module not found
```

**Solução**:
1. Execute localmente: `npm run build`
2. Verifique se todas as dependências estão instaladas
3. Corrija imports/exports
4. Commit e push novamente

### ❌ Erro: Deploy falha

**Problema**:
```
curl: (52) Empty reply from server
```

**Solução**:
1. Verifique se `RENDER_DEPLOY_HOOK_URL` está configurado
2. Verifique se a URL está correta
3. Tente deploy manual no Render Dashboard

---

## 🎨 Status Badges

Adicione badges ao README para mostrar status do CI:

```markdown
![CI](https://github.com/SEU_USUARIO/bfin-frontend/actions/workflows/ci.yml/badge.svg)
![Deploy](https://github.com/SEU_USUARIO/bfin-frontend/actions/workflows/deploy.yml/badge.svg)
```

---

## 📈 Métricas

O CI gera automaticamente:

### Build Size Report
Mostra tamanho dos arquivos buildados

### Test Results
Mostra resultados dos testes e cobertura

### Job Status
Mostra status de cada job do pipeline

Acesse no **Summary** de cada workflow execution.

---

## 🔄 Workflow Manual

Você pode executar o deploy manualmente:

1. Acesse: Actions > Deploy to Production
2. Clique em **"Run workflow"**
3. Selecione a branch
4. Clique em **"Run workflow"**

---

## ⚙️ Configuração Avançada

### Cache de Node Modules

O workflow usa cache automático do npm:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'npm'
```

Isso acelera as execuções subsequentes.

### Concurrency

O workflow cancela execuções anteriores da mesma branch:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

Isso economiza recursos do GitHub Actions.

### Artifacts Retention

Artefatos são mantidos por **7 dias**:

```yaml
retention-days: 7
```

Ajuste se necessário.

---

## 📚 Referências

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Packages (NPM)](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- [Render Deploy Hooks](https://render.com/docs/deploy-hooks)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)

---

## 🎯 Próximos Passos

### Melhorias Futuras

- [ ] Adicionar testes E2E mais abrangentes
- [ ] Configurar Chromatic para visual regression testing
- [ ] Adicionar deploy preview para PRs
- [ ] Configurar notificações no Slack/Discord
- [ ] Adicionar análise de bundle size
- [ ] Configurar Lighthouse CI para performance

---

**Última atualização**: Janeiro 2026
