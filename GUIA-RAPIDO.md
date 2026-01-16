# 🚀 Guia Rápido - CI/CD

Comandos rápidos para trabalhar com o CI/CD.

---

## 🔧 Configuração Inicial (Uma vez)

```bash
# 1. Configurar secrets no GitHub
# Acesse: https://github.com/SEU_USUARIO/bfin-frontend/settings/secrets/actions
# Adicione:
# - NPM_TOKEN
# - VITE_API_BASE_URL
# - RENDER_DEPLOY_HOOK_URL (opcional)

# 2. Verificar se workflow existe
ls -la .github/workflows/

# 3. Fazer primeiro commit para testar
git add .
git commit -m "chore: configura CI/CD com GitHub Actions"
git push origin main
```

---

## 💻 Validação Local (Antes de Push)

```bash
# Executar todas as validações do CI
npm run type-check && npm run lint && npm test -- --run && npm run build

# OU individual:
npm run type-check    # TypeScript
npm run lint          # ESLint
npm test -- --run     # Testes
npm run build         # Build
npm audit             # Segurança
```

---

## 🔄 Workflow de Desenvolvimento

```bash
# 1. Criar branch de feature
git checkout -b feature/minha-feature

# 2. Fazer alterações
# ... desenvolver ...

# 3. Validar localmente
npm run type-check && npm run lint && npm test -- --run && npm run build

# 4. Commit e push
git add .
git commit -m "feat: adiciona nova funcionalidade"
git push origin feature/minha-feature

# 5. Abrir PR no GitHub
# O CI vai executar automaticamente

# 6. Após aprovação, merge para main
git checkout main
git pull origin main
git merge feature/minha-feature
git push origin main
# Deploy automático será acionado
```

---

## 🐛 CI Falhou? Debug Rápido

```bash
# TypeScript falhou?
npm run type-check
# Veja os erros e corrija

# ESLint falhou?
npm run lint
# Corrija os erros de linting

# Testes falharam?
npm test
# Veja qual teste falhou

# Build falhou?
npm run build
# Veja o erro de build

# Security audit falhou?
npm audit
npm audit fix
```

---

## 📊 Monitorar CI

```bash
# Via GitHub CLI (se instalado)
gh workflow list                    # Listar workflows
gh run list                         # Listar execuções
gh run view                         # Ver última execução
gh run view --log                   # Ver logs
gh run rerun <run-id>               # Re-executar workflow

# Via Browser
# https://github.com/SEU_USUARIO/bfin-frontend/actions
```

---

## 🔐 Atualizar Secrets

```bash
# Via GitHub CLI
gh secret set NPM_TOKEN
gh secret set VITE_API_BASE_URL
gh secret set RENDER_DEPLOY_HOOK_URL

# Via Browser
# https://github.com/SEU_USUARIO/bfin-frontend/settings/secrets/actions
```

---

## 🚀 Deploy Manual

```bash
# Trigger deploy manual via GitHub Actions
gh workflow run deploy.yml

# OU via Browser
# Actions > Deploy to Production > Run workflow
```

---

## 📝 Commits Seguindo Padrão

```bash
# Features
git commit -m "feat: adiciona autenticação de usuário"
git commit -m "feat(dashboard): adiciona gráfico de gastos"

# Correções
git commit -m "fix: corrige erro no formulário de login"
git commit -m "fix(api): corrige timeout nas requisições"

# Documentação
git commit -m "docs: atualiza README com instruções de CI/CD"

# Refatoração
git commit -m "refactor: melhora performance do dashboard"

# Testes
git commit -m "test: adiciona testes para componente Button"

# Chore
git commit -m "chore: atualiza dependências"
git commit -m "chore: configura CI/CD"
```

---

## 🎯 Scripts Úteis

```bash
# Desenvolvimento
npm run dev              # Vite + Storybook
npm run dev:vite         # Apenas Vite

# Testes
npm test                 # Watch mode
npm test -- --run        # Uma vez
npm run test:ui          # Com UI
npm run test:coverage    # Com cobertura

# Build
npm run build            # Build produção
npm run build:check      # TypeScript + build
npm run preview          # Preview build

# Qualidade
npm run lint             # ESLint
npm run type-check       # TypeScript
```

---

## 🔍 Troubleshooting Rápido

### Erro 401 no NPM
```bash
# Gerar novo token: https://github.com/settings/tokens
# Atualizar secret NPM_TOKEN no GitHub
```

### CI não executa
```bash
# Verificar se workflow está na branch main
git ls-tree -r main --name-only | grep .github/workflows

# Verificar sintaxe do YAML
yamllint .github/workflows/ci.yml
```

### Deploy não funciona
```bash
# Verificar se RENDER_DEPLOY_HOOK_URL está configurado
# Testar webhook manualmente:
curl -X POST "$RENDER_DEPLOY_HOOK_URL"
```

---

## 📚 Links Rápidos

- [GitHub Actions](https://github.com/SEU_USUARIO/bfin-frontend/actions)
- [Secrets](https://github.com/SEU_USUARIO/bfin-frontend/settings/secrets/actions)
- [Render Dashboard](https://dashboard.render.com)
- [Documentação Completa](./CI-CD.md)
- [Checklist](./CHECKLIST.md)

---

**Última atualização**: Janeiro 2026
