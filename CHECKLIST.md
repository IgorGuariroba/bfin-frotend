# ✅ Checklist de Configuração CI/CD

Use este checklist para garantir que tudo está configurado corretamente.

---

## 📦 Arquivos Criados

### Workflows do GitHub Actions

- [x] `.github/workflows/ci.yml` - Pipeline de CI completo
- [x] `.github/workflows/deploy.yml` - Deploy automático

### Documentação

- [x] `CI-CD.md` - Guia completo de CI/CD
- [x] `.github/SECRETS.md` - Como configurar secrets
- [x] `.github/PULL_REQUEST_TEMPLATE.md` - Template de PR
- [x] `.github/ISSUE_TEMPLATE/bug_report.md` - Template de bug
- [x] `.github/ISSUE_TEMPLATE/feature_request.md` - Template de feature
- [x] `README_NEW.md` - README atualizado com badges

### Scripts

- [x] `package.json` - Scripts atualizados:
  - `npm run type-check` - TypeScript check
  - `npm test` - Testes
  - `npm run test:ui` - Testes com UI
  - `npm run test:coverage` - Cobertura

---

## 🔐 Secrets do GitHub (CONFIGURAR MANUALMENTE)

Acesse: `https://github.com/SEU_USUARIO/bfin-frontend/settings/secrets/actions`

### Obrigatórios

- [ ] `NPM_TOKEN` - Token do GitHub com permissão `read:packages`
  - Gerar em: https://github.com/settings/tokens
  - Permissão: `read:packages`

- [ ] `VITE_API_BASE_URL` - URL da API backend
  - Valor: `https://bfin-backend.onrender.com` (ou sua URL)

### Opcional (para deploy automático)

- [ ] `RENDER_DEPLOY_HOOK_URL` - Webhook do Render
  - Obter em: Render Dashboard > Settings > Deploy Hook

**Ver**: `.github/SECRETS.md` para instruções detalhadas

---

## 🧪 Validações do CI

O CI executa as seguintes validações:

### 1️⃣ Code Quality

```bash
# TypeScript Check
npx tsc --noEmit

# ESLint
npm run lint

# Security Audit
npm audit --audit-level=moderate
```

### 2️⃣ Tests

```bash
# Vitest + Playwright
npm test -- --run --reporter=verbose

# Com cobertura
npm run test:coverage
```

### 3️⃣ Build Validation

```bash
# Build de produção
npm run build
```

---

## 🚀 Testar Localmente

Execute TODOS os comandos antes de fazer push:

```bash
# 1. TypeScript
npm run type-check

# 2. Linter
npm run lint

# 3. Testes
npm test -- --run

# 4. Build
npm run build

# 5. Security
npm audit

# OU executar tudo de uma vez:
npm run type-check && npm run lint && npm test -- --run && npm run build
```

---

## 📋 Fluxo de Trabalho

### Para Desenvolvimento

1. **Criar branch**
   ```bash
   git checkout -b feature/minha-feature
   ```

2. **Fazer alterações**
   - Desenvolver funcionalidade
   - Escrever testes
   - Atualizar documentação

3. **Validar localmente**
   ```bash
   npm run type-check && npm run lint && npm test -- --run && npm run build
   ```

4. **Commit e push**
   ```bash
   git add .
   git commit -m "feat: adiciona nova funcionalidade"
   git push origin feature/minha-feature
   ```

5. **Abrir Pull Request**
   - O CI vai executar automaticamente
   - Aguardar CI passar (✅)
   - Solicitar revisão

6. **Merge**
   - Após aprovação
   - Merge para `main` ou `develop`
   - Deploy automático (se main)

---

## 🎯 Status do CI

### ✅ CI Passou

Tudo certo! ✨

### ❌ CI Falhou

Identifique qual job falhou:

#### Code Quality falhou

```bash
# TypeScript
npm run type-check
# Corrija erros de tipo

# ESLint
npm run lint
# Corrija erros de lint

# Security
npm audit
# Revise vulnerabilidades
```

#### Tests falharam

```bash
# Execute testes localmente
npm test

# Veja qual teste falhou
# Corrija o teste ou código
```

#### Build falhou

```bash
# Execute build localmente
npm run build

# Veja o erro
# Corrija imports/exports
```

---

## 📊 Monitoramento

### GitHub Actions

Acesse: `https://github.com/SEU_USUARIO/bfin-frontend/actions`

- Ver execuções de workflows
- Baixar artefatos (coverage, build)
- Ver logs detalhados

### Render Dashboard

Acesse: https://dashboard.render.com

- Ver status de deploy
- Ver logs de build
- Monitorar aplicação

---

## 🔄 Próximos Passos

### Configuração Inicial

1. [ ] Configurar secrets no GitHub (ver seção acima)
2. [ ] Fazer um commit de teste para testar CI
3. [ ] Verificar se CI passa
4. [ ] Configurar webhook do Render (se quiser deploy automático)
5. [ ] Atualizar README.md com novo conteúdo de `README_NEW.md`

### Melhorias Futuras

- [ ] Adicionar testes E2E mais abrangentes
- [ ] Configurar Chromatic para visual regression
- [ ] Adicionar deploy preview para PRs
- [ ] Configurar notificações (Slack/Discord)
- [ ] Adicionar análise de bundle size
- [ ] Configurar Lighthouse CI

---

## 📚 Documentação Criada

| Arquivo | Descrição |
|---------|-----------|
| `CI-CD.md` | Guia completo de CI/CD |
| `.github/SECRETS.md` | Como configurar secrets |
| `.github/PULL_REQUEST_TEMPLATE.md` | Template de PR |
| `.github/ISSUE_TEMPLATE/bug_report.md` | Template de bug |
| `.github/ISSUE_TEMPLATE/feature_request.md` | Template de feature |
| `README_NEW.md` | README atualizado |
| `CHECKLIST.md` | Este arquivo |

---

## ✨ Comandos Úteis

```bash
# Ver status do Git
git status

# Ver último commit
git log -1

# Ver workflows no GitHub (via CLI)
gh workflow list

# Ver runs do CI
gh run list

# Ver logs do último run
gh run view --log

# Re-executar workflow falho
gh run rerun
```

---

## 🎉 Tudo Pronto!

Agora você tem:

- ✅ CI/CD automatizado com GitHub Actions
- ✅ Validações de código (TypeScript, ESLint)
- ✅ Testes automatizados (Vitest, Playwright)
- ✅ Build validation
- ✅ Deploy automático (Render)
- ✅ Security audit (npm audit)
- ✅ Templates de PR e Issues
- ✅ Documentação completa

---

**Última atualização**: Janeiro 2026
