# 🚀 CI/CD - BFIN Frontend

Este documento descreve o pipeline de CI/CD configurado para o projeto BFIN Frontend, incluindo guias de configuração e checklists de validação.

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

## 🔐 Secrets Necessários

Configure os seguintes secrets no GitHub em `Settings > Secrets and variables > Actions`:

| Secret | Descrição | Como Obter |
|--------|-----------|------------|
| `NPM_TOKEN` | Token do GitHub para acessar SDK privado | [GitHub Settings > Tokens](https://github.com/settings/tokens) |
| `VITE_API_BASE_URL` | URL base da API | Ex: `https://bfin-backend.onrender.com` |
| `RENDER_DEPLOY_HOOK_URL` | Webhook do Render para deploy | Render Dashboard > Settings > Deploy Hook |

### Como Criar o NPM Token
1. Acesse: https://github.com/settings/tokens
2. Clique em **"Generate new token (classic)"**
3. Nome: `BFIN CI/CD`
4. Marque a permissão: **`read:packages`**
5. Copie o token (começa com `ghp_`)

---

## ✅ Checklist de Configuração

Use este checklist para garantir que o CI/CD está operante:

- [ ] **Secrets**: `NPM_TOKEN` configurado com permissão `read:packages`.
- [ ] **Secrets**: `VITE_API_BASE_URL` configurado para o ambiente de produção/staging.
- [ ] **Workflows**: Arquivos `.github/workflows/ci.yml` e `deploy.yml` presentes.
- [ ] **Scripts**: `package.json` possui os scripts `type-check`, `lint`, `test`, `build`.

---

## 🧪 Validações Locais

Antes de fazer push, execute as mesmas validações que o CI fará:

```bash
# Executar tudo de uma vez
npm run type-check && npm run lint && npm test -- --run && npm run build
```

---

## 📊 Monitoramento

- **GitHub Actions**: Visualize execuções em `https://github.com/SEU_USUARIO/bfin-frontend/actions`
- **Render Dashboard**: Monitore o status do deploy em `https://dashboard.render.com`

---

## ⚙️ Configuração Avançada

### Cache de Node Modules
O workflow usa cache automático do npm para acelerar as execuções.

### Concurrency
O workflow cancela execuções anteriores da mesma branch para economizar recursos.

### Artifacts Retention
Artefatos (logs de erro, cobertura) são mantidos por **7 dias**.
