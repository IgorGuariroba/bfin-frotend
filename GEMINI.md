# ♊ Guia Gemini - BFIN Frontend

Este documento serve como referência para o Gemini AI ao trabalhar no projeto BFIN Frontend.

---

## 📋 Contexto do Projeto

**BFIN Frontend** é uma aplicação web React/TypeScript de gerenciamento financeiro pessoal. O projeto utiliza Chakra UI v3 para interface, React Query para gerenciamento de estado do servidor, e um SDK privado para comunicação com o backend.

### Objetivo Principal
Permitir que usuários gerenciem suas finanças pessoais através de:
- Dashboard com visão geral
- Gerenciamento de receitas e despesas (fixas e variáveis)
- Acompanhamento de transações e categorias
- Definição de limites diários de gastos
- Gerenciamento de membros em contas compartilhadas

---

## 🛠 Stack Tecnológico

### Core
- **React 18.2.0** - Biblioteca UI principal
- **TypeScript 5.3.3** - Tipagem estática
- **Vite 7.3.1** - Build tool e dev server
- **React Router DOM 6.30.3** - Roteamento SPA

### UI & Estilização
- **Chakra UI 3.30.0** - Sistema de design (⚠️ V3 - veja regras específicas)
- **Lucide React 0.309.0** - Ícones principais
- **React Icons 5.5.0** - Ícones complementares
- **Recharts 3.0.0** - Gráficos e visualizações
- **next-themes 0.4.6** - Gerenciamento de tema claro/escuro

### Gerenciamento de Estado
- **@tanstack/react-query 5.17.9** - Server state management
- **Axios 1.6.5** - Cliente HTTP
- **@igorguariroba/bfin-sdk 0.3.0** - SDK privado (GitHub Packages)

### Formulários & Validação
- **React Hook Form 7.49.3** - Gerenciamento de formulários
- **Zod 3.22.4** - Schema validation
- **@hookform/resolvers 3.3.4** - Integração RHF + Zod

### Testes & Documentação
- **Vitest 4.0.16** - Test runner
- **Playwright 1.57.0** - E2E testing
- **Storybook 10.1.11** - Documentação de componentes
- **@storybook/addon-vitest** - Integração de testes unitários no Storybook

---

## 📁 Estrutura de Diretórios

```
frontend/
├── src/
│   ├── components/           # Componentes UI (Atomic Design)
│   │   ├── atoms/           # Componentes básicos (Button, Input)
│   │   ├── molecules/       # Componentes compostos (BalanceCard, FormField)
│   │   ├── organisms/       # Componentes complexos
│   │   │   ├── charts/     # Gráficos
│   │   │   ├── dialogs/    # Modais/Dialogs
│   │   │   ├── forms/      # Formulários
│   │   │   └── lists/      # Listas
│   │   ├── ui/             # Componentes Chakra UI customizados (v3)
│   │   └── utils/          # Componentes utilitários
│   ├── contexts/            # React Contexts (AuthContext)
│   ├── hooks/               # Custom hooks (useTransactions, useAccounts)
│   ├── pages/               # Páginas da aplicação
│   ├── services/            # Camada de serviços (API)
│   ├── config/              # Configurações (SDK)
│   ├── theme/               # Tema Chakra UI
│   ├── types/               # TypeScript types
│   ├── stories/             # Storybook stories
│   ├── App.tsx              # Componente principal
│   └── main.tsx             # Entry point
├── scripts/                 # Scripts auxiliares
├── .storybook/              # Configuração Storybook
├── package.json
├── DOCUMENTACAO.md          # Documentação completa
└── INSTALL.md               # Guia de instalação
```

---

## 🎯 Regras Críticas para o Gemini

### 1. Chakra UI v3 (Atenção Máxima!)

O projeto usa **Chakra UI v3**. As mudanças em relação à v2 são profundas.

**Principais Mudanças:**
- **Componentes Compostos**: Use o pattern `Root`, `Trigger`, `Content`, `Header`, etc. (ex: `Dialog.Root`, `Table.Root`).
- **Props Renomeadas**:
    - `isOpen` -> `open`
    - `isInvalid` -> `invalid`
    - `isLoading` -> `loading`
    - `colorScheme` -> `colorPalette`
    - `spacing` -> `gap`
- **Ícones**: Não use `leftIcon` ou `rightIcon`. Coloque o ícone como children: `<Button><Mail /> Enviar</Button>`.
- **Toaster**: Use `toaster.create()` do componente customizado em `src/components/ui/toaster`.

### 2. Atomic Design e Organização

- **Atoms**: Sem lógica de negócio, focados em UI pura.
- **Molecules**: Combinação de átomos.
- **Organisms**: Onde a lógica de negócio (hooks, mutations) geralmente reside.
- **Hooks**: Centralize a lógica de dados em hooks customizados (ex: `src/hooks/useTransactions.ts`).

### 3. Gerenciamento de Dados (React Query)

- Use **sempre** o React Query para chamadas de API.
- Invalide as queries após mutations de sucesso para manter a UI atualizada.
- Utilize os tipos provenientes do `@igorguariroba/bfin-sdk`.

### 4. Testes e Qualidade

- O projeto usa **Vitest**.
- Adicionamos o `@storybook/addon-vitest` para rodar testes diretamente no Storybook.
- Antes de qualquer push, valide o build: `npm run build:check`.

---

## 🚀 Comandos Úteis

```bash
# Iniciar Dev (Vite + Storybook)
npm run dev

# Rodar Testes
npm test

# Verificar Tipagem e Build
npm run build:check

# Setup de SDK Privado (se necessário)
npm run setup:npmrc && npm install
```

---

**Nota para o Gemini**: Sempre consulte o arquivo `.cursorrules` para padrões de código mais detalhados e o `DOCUMENTACAO.md` para fluxos de negócio.
