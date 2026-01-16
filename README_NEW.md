# 💰 BFIN Frontend

Sistema de gerenciamento financeiro pessoal construído com React, TypeScript e Chakra UI v3.

[![CI](https://github.com/igorguariroba/bfin-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/igorguariroba/bfin-frontend/actions/workflows/ci.yml)
[![Deploy](https://github.com/igorguariroba/bfin-frontend/actions/workflows/deploy.yml/badge.svg)](https://github.com/igorguariroba/bfin-frontend/actions/workflows/deploy.yml)

---

## 🚀 Quick Start

```bash
# 1. Clone o repositório
git clone https://github.com/igorguariroba/bfin-frontend.git
cd bfin-frontend

# 2. Configure o .env
cp .env.example .env
# Edite .env com seu NPM_TOKEN

# 3. Instale dependências
npm run install:all

# 4. Execute desenvolvimento
npm run dev
```

Acesse: http://localhost:5173

---

## ✨ Features

- ✅ Dashboard com visão geral financeira
- ✅ Gerenciamento de receitas e despesas
- ✅ Categorização de transações
- ✅ Limite diário de gastos
- ✅ Contas compartilhadas com membros
- ✅ Tema claro/escuro
- ✅ 100% Responsivo
- ✅ Autenticação JWT com refresh token

---

## 🛠 Stack

- **React 18** + **TypeScript 5**
- **Vite 7** - Build tool
- **Chakra UI v3** - Sistema de design
- **React Query** - State management
- **React Hook Form** + **Zod** - Formulários
- **Vitest** + **Playwright** - Testes
- **Storybook** - Documentação de componentes

---

## 📚 Documentação

- [📖 DOCUMENTACAO.md](./DOCUMENTACAO.md) - Documentação completa
- [🚀 CI-CD.md](./CI-CD.md) - Guia de CI/CD
- [⚙️ INSTALL.md](./INSTALL.md) - Instalação detalhada
- [🤖 CLAUDE.md](./CLAUDE.md) - Guia para Claude AI
- [🔐 .github/SECRETS.md](./.github/SECRETS.md) - Configurar secrets

---

## 🔧 Scripts

```bash
# Desenvolvimento
npm run dev              # Vite + Storybook
npm run dev:vite         # Apenas Vite
npm run storybook        # Apenas Storybook

# Build
npm run build            # Build de produção
npm run build:check      # TypeScript check + build
npm run preview          # Preview do build

# Qualidade de Código
npm run lint             # ESLint
npm run type-check       # TypeScript check
npm test                 # Testes (watch mode)
npm test -- --run        # Testes (uma vez)
npm run test:coverage    # Testes com cobertura

# CI/CD Local (executar antes de push)
npm run type-check && npm run lint && npm test -- --run && npm run build
```

---

## 🔄 CI/CD

O projeto possui pipeline automatizado com GitHub Actions:

### CI Pipeline

Executa em push/PR para `main` e `develop`:

- ✅ TypeScript Check
- ✅ ESLint
- ✅ npm audit (segurança)
- ✅ Vitest + Playwright
- ✅ Build validation
- ✅ Storybook build (main apenas)

### Deploy Automático

Deploy automático no Render ao fazer push em `main`:

- ✅ Build da aplicação
- ✅ Trigger do webhook do Render

**Ver**: [CI-CD.md](./CI-CD.md) para detalhes completos

---

## 🔐 Configuração de Secrets

O projeto requer secrets do GitHub Actions para funcionar:

1. `NPM_TOKEN` - Token do GitHub com permissão `read:packages`
2. `VITE_API_BASE_URL` - URL da API backend
3. `RENDER_DEPLOY_HOOK_URL` - Webhook do Render (opcional)

**Ver**: [.github/SECRETS.md](./.github/SECRETS.md) para instruções detalhadas

---

## 🧪 Testes

```bash
# Executar testes
npm test

# Testes com interface
npm run test:ui

# Testes com cobertura
npm run test:coverage

# Executar uma vez (CI mode)
npm test -- --run
```

---

## 📖 Storybook

```bash
# Iniciar Storybook
npm run storybook

# Build do Storybook
npm run build-storybook
```

Acesse: http://localhost:6006

---

## 🏗 Arquitetura

O projeto segue **Atomic Design**:

```
src/
├── components/
│   ├── atoms/           # Componentes básicos (Button, Input)
│   ├── molecules/       # Composições simples (FormField, BalanceCard)
│   ├── organisms/       # Componentes complexos (forms, charts, lists)
│   └── ui/              # Componentes Chakra UI customizados
├── contexts/            # React Contexts
├── hooks/               # Custom hooks
├── pages/               # Páginas
├── services/            # API services
└── theme/               # Tema Chakra UI
```

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Faça suas alterações
4. Execute validações locais:
   ```bash
   npm run type-check && npm run lint && npm test -- --run && npm run build
   ```
5. Commit: `git commit -m "feat: adiciona nova funcionalidade"`
6. Push: `git push origin feature/minha-feature`
7. Abra um Pull Request

**Template de PR**: [.github/PULL_REQUEST_TEMPLATE.md](./.github/PULL_REQUEST_TEMPLATE.md)

---

## 📝 Padrões de Commit

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Manutenção

---

## 🔗 Links

- [🌐 Produção](https://bfin-frontend.onrender.com)
- [🔧 Backend API](https://bfin-backend.onrender.com)
- [📚 Storybook (deploy)](https://storybook-bfin.netlify.app)

---

## 📄 Licença

Este projeto é privado e proprietário.

© 2026 BFIN - Todos os direitos reservados.

---

## 👤 Autor

**Igor Guariroba**

- GitHub: [@igorguariroba](https://github.com/igorguariroba)

---

## 🆘 Suporte

Encontrou um problema? [Abra uma issue](https://github.com/igorguariroba/bfin-frontend/issues/new/choose)

---

**Última atualização**: Janeiro 2026
