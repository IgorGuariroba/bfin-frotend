# Dev Commands - Scripts e Comandos

## 🚀 Comandos de Desenvolvimento

### Desenvolvimento
```bash
# Desenvolvimento completo (Vite + Storybook)
npm run dev

# Apenas aplicação (Vite)
npm run dev:vite

# Apenas Storybook
npm run storybook
```

### Build e Deploy
```bash
# Build de produção
npm run build

# TypeScript check + build
npm run build:check

# Preview local do build
npm run preview
```

### Qualidade de Código
```bash
# Linter (ESLint)
npm run lint

# Verificação TypeScript (sem build)
npm run type-check

# Auditoria de segurança
npm audit
```

### Testes
```bash
# Testes (modo watch)
npm test

# Executar testes uma vez
npm test -- --run

# Testes com interface visual
npm run test:ui

# Testes com cobertura
npm run test:coverage
```

### SDK Setup
```bash
# Setup NPM para SDK privado
npm run setup:npmrc

# Instalação completa
npm run install:all
```

---

## 🔍 Validação Completa (CI Local)

### Antes de Push (OBRIGATÓRIO)
```bash
# Execute TODOS os comandos antes de fazer push
npm run type-check && \
npm run lint && \
npm test -- --run && \
npm run build && \
npm audit
```

### Script de Validação Rápida
```bash
# Criar alias para validação rápida
# Adicionar no ~/.bashrc ou ~/.zshrc
alias validate="npm run type-check && npm run lint && npm test -- --run && npm run build"

# Uso:
validate
```

---

## 📊 Monitoramento e Debug

### Bundle Analysis
```bash
# Analisar tamanho do bundle
npm run build
npx vite-bundle-analyzer dist
```

### Performance
```bash
# Lighthouse audit local
npx lighthouse http://localhost:5173 --view

# Web Vitals
npm install --save-dev web-vitals
```

### Dependências
```bash
# Listar dependências outdated
npm outdated

# Atualizar dependências
npm update

# Verificar vulnerabilidades
npm audit

# Corrigir vulnerabilidades automáticas
npm audit fix
```

---

## 🧪 Comandos de Teste Específicos

### Vitest
```bash
# Testes em modo watch
npm test

# Executar apenas um arquivo
npm test Button.test.tsx

# Executar com coverage
npm run test:coverage

# Executar testes que falharam
npm test -- --reporter=verbose --run
```

### Playwright (E2E)
```bash
# Executar testes E2E
npx playwright test

# Executar em modo UI
npx playwright test --ui

# Executar apenas um teste
npx playwright test login.spec.ts

# Debug modo
npx playwright test --debug
```

---

## 🛠️ Comandos de Manutenção

### Limpeza
```bash
# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# Limpar cache npm
npm cache clean --force

# Limpar build
rm -rf dist

# Limpar Storybook build
rm -rf storybook-static
```

### Git Housekeeping
```bash
# Limpar branches locais já merged
git branch --merged main | grep -v main | xargs -n 1 git branch -d

# Limpar referencias remotas
git remote prune origin

# Status geral
git status --porcelain
```

---

## 📝 Scripts Personalizados

### package.json Scripts Principais
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:vite\" \"npm run storybook\"",
    "dev:vite": "vite",
    "storybook": "storybook dev -p 6006",
    "build": "tsc && vite build",
    "build:check": "npm run type-check && npm run build",
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "preview": "vite preview",
    "setup:npmrc": "node scripts/setup-npmrc.js",
    "install:all": "npm run setup:npmrc && npm install"
  }
}
```

### Scripts Customizados Úteis

#### Validação Completa
```json
{
  "scripts": {
    "validate": "npm run type-check && npm run lint && npm test -- --run && npm run build",
    "validate:quick": "npm run type-check && npm run lint",
    "validate:security": "npm audit && npm run validate"
  }
}
```

#### Deploy e Build
```json
{
  "scripts": {
    "build:prod": "NODE_ENV=production npm run build",
    "build:dev": "NODE_ENV=development npm run build",
    "deploy:preview": "npm run build && npm run preview"
  }
}
```

---

## 🚨 Troubleshooting Commands

### Problemas Comuns

#### SDK não instala
```bash
# Verificar .npmrc
cat .npmrc

# Recriar configuração NPM
npm run setup:npmrc

# Verificar token
echo $NPM_TOKEN
```

#### TypeScript Errors
```bash
# Limpar cache TypeScript
npx tsc --build --clean

# Verificar configuração
npx tsc --showConfig

# Type check verbose
npx tsc --noEmit --diagnostics
```

#### Build Falha
```bash
# Build verbose
npm run build -- --debug

# Verificar espaço em disco
df -h

# Verificar memória
free -h
```

#### Testes Falham
```bash
# Executar um teste específico
npm test -- Button.test.tsx

# Testes com mais informações
npm test -- --reporter=verbose

# Limpar cache de testes
npm test -- --clearCache
```

#### Vite Dev Server Issues
```bash
# Limpar cache Vite
rm -rf node_modules/.vite

# Verificar portas ocupadas
lsof -i :5173

# Executar em porta diferente
npm run dev:vite -- --port 3000
```

---

## 📋 Checklist de Comandos

### Antes de Iniciar Desenvolvimento
- [ ] `npm install` (dependências atualizadas)
- [ ] `npm run setup:npmrc` (se usando SDK privado)
- [ ] `git pull origin main` (código atualizado)

### Durante Desenvolvimento
- [ ] `npm run dev` (servidor local)
- [ ] `npm run type-check` (verificar tipos periodicamente)
- [ ] `npm test` (testes em watch mode)

### Antes de Push
- [ ] `npm run type-check` ✅
- [ ] `npm run lint` ✅
- [ ] `npm test -- --run` ✅
- [ ] `npm run build` ✅
- [ ] `npm audit` ✅

### Deploy/Produção
- [ ] `npm run build:prod`
- [ ] `npm run test:coverage`
- [ ] `npm audit --production`
- [ ] Verificar CI/CD pipeline

---

## ⚡ Aliases Úteis

### Bash/Zsh Aliases
```bash
# Adicionar no ~/.bashrc ou ~/.zshrc

# Desenvolvimento
alias dev="npm run dev"
alias build="npm run build"
alias test="npm test"

# Validação
alias validate="npm run type-check && npm run lint && npm test -- --run && npm run build"
alias quick-check="npm run type-check && npm run lint"

# Git + Validação
alias safe-push="npm run validate && git push"

# Limpeza
alias clean-install="rm -rf node_modules package-lock.json && npm install"
alias clean-cache="npm cache clean --force && rm -rf node_modules/.vite"
```

---

**Dica**: Configure o alias `validate` para executar antes de cada push!