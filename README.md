# BFIN Frontend

Sistema de gestão financeira pessoal desenvolvido com React, TypeScript e Chakra UI v3.

## Tecnologias Principais

- **React 18** - Biblioteca para construção de interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **Chakra UI v3** - Sistema de componentes UI
- **React Router** - Navegação entre páginas
- **React Hook Form + Zod** - Gerenciamento e validação de formulários
- **TanStack Query** - Gerenciamento de estado assíncrono
- **Axios** - Cliente HTTP
- **Recharts** - Gráficos e visualizações
- **Vite** - Build tool e dev server
- **Lucide React** - Ícones

## Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis
│   ├── atoms/       # Componentes básicos
│   ├── molecules/   # Componentes compostos
│   ├── organisms/   # Componentes complexos
│   └── ui/          # Componentes de UI base
├── contexts/        # Contextos React (Auth, etc)
├── hooks/           # Hooks customizados
├── lib/             # Utilitários e helpers
├── pages/           # Páginas da aplicação
├── services/        # Serviços de API
├── theme/           # Configuração do tema
└── types/           # Definições de tipos TypeScript
```

## Funcionalidades

- Autenticação de usuários (Login/Registro)
- Dashboard com visão geral financeira
- Gerenciamento de contas
- Registro de receitas
- Registro de despesas fixas e variáveis
- Limite diário sugerido
- Histórico de gastos com gráficos
- Convites e permissões de membros
- Sistema de design (Styleguide)

## Requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

## Instalação

1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd bfin-frotend
```

2. Instale as dependências
```bash
npm install
```

## Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev
```
Inicia o servidor de desenvolvimento em http://localhost:5173/

### Build
```bash
npm run build
```
Compila o TypeScript e cria a build de produção na pasta `dist/`

### Preview
```bash
npm run preview
```
Serve a build de produção localmente para testes

### Lint
```bash
npm run lint
```
Executa o ESLint para verificar problemas no código

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
VITE_API_URL=<url-da-api-backend>
```

## Rotas da Aplicação

- `/` - Redireciona para dashboard ou login
- `/login` - Página de login
- `/register` - Página de registro
- `/dashboard` - Dashboard principal (protegida)
- `/daily-limit` - Limite diário (protegida)
- `/add-income` - Adicionar receita (protegida)
- `/add-fixed-expense` - Adicionar despesa fixa (protegida)
- `/add-variable-expense` - Adicionar despesa variável (protegida)
- `/styleguide` - Sistema de design

## Desenvolvimento

O projeto segue a arquitetura Atomic Design para organização de componentes:
- **Atoms**: Componentes básicos como botões, inputs
- **Molecules**: Combinação de atoms
- **Organisms**: Componentes complexos com lógica de negócio

## Licença

Propriedade privada - Todos os direitos reservados
