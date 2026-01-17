# 🏗 Arquitetura

A arquitetura do BFIN Frontend foi desenhada para ser escalável, modular e fácil de manter.

## 1. Atomic Design
Organizamos nossos componentes seguindo a metodologia de Atomic Design:

- **Atoms**: Componentes de interface indivisíveis (Button, Input, Badge). Eles não possuem lógica de negócio.
- **Molecules**: Combinações simples de átomos que formam uma unidade funcional (FormField, BalanceCard).
- **Organisms**: Componentes complexos que formam seções da interface. Geralmente interagem com hooks e estado global (Formulários, Listas, Gráficos).
- **Templates**: (Opcional) Layouts de página que definem a estrutura visual.

## 2. Feature-based Structure
A lógica de negócio é organizada por funcionalidade:
- **Hooks**: Centralizam a lógica de dados (ex: `useTransactions`).
- **Services**: Camada de abstração para chamadas de API.
- **Contexts**: Estado compartilhado que atravessa a árvore de componentes (ex: `AuthContext`).

## 3. Separação de Preocupações (Separation of Concerns)
- **Camada de Apresentação**: Componentes React focados em UI.
- **Camada de Lógica**: Hooks customizados que lidam com regras de negócio e chamadas de API.
- **Camada de Dados**: React Query gerencia o cache e sincronização com o servidor.

## 📁 Estrutura de Pastas

```
src/
├── components/          # Componentes UI (Atoms, Molecules, Organisms)
│   ├── ui/              # Snippets customizados do Chakra UI v3
│   └── utils/           # Utilitários de UI
├── contexts/            # Contextos React (Autenticação, etc)
├── hooks/               # Custom hooks para lógica de negócio
├── pages/               # Componentes de página (Rotas)
├── services/            # Serviços de API e integração
├── config/              # Configurações globais (SDK, etc)
├── theme/               # Definições de tema e tokens
├── types/               # Definições globais de tipos TypeScript
└── stories/             # Documentação de histórias do Storybook
```
