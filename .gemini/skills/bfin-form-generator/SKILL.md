---
name: bfin-form-generator
description: Create and implement new forms and pages for the BFIN project, following the BFIN-specific standard (Chakra UI v3, React Hook Form, Zod, and React Query). Use this skill when asked to build a new screen for adding, editing, or managing data like expenses, incomes, categories, or accounts.
---

# BFIN Form & Page Generator

Esta skill orienta a criação de novas telas e formulários no projeto BFIN, garantindo consistência com os padrões de arquitetura (Atomic Design) e tecnologias (Chakra UI v3, React Hook Form, Zod).

## Workflow Padrão

### 1. Criar o Organism (Formulário)
Sempre crie um componente de formulário em `src/components/organisms/forms/`.
- Use o template em `assets/form-template.tsx` como base.
- **Validação**: Defina o schema com Zod (`z.object`).
- **Estado**: Use `useForm` do `react-hook-form` com o `zodResolver`.
- **Dados**: Utilize hooks customizados do React Query (em `src/hooks/`) para mutations e queries.
- **UI**: Siga o padrão Chakra UI v3 (veja Regras Críticas abaixo).

### 2. Criar a Página
Crie a página em `src/pages/`.
- Use o template em `assets/page-template.tsx` como base.
- A página deve ser um container simples que gerencia a navegação via `useNavigate`.
- Integre o Organism criado no passo 1 dentro do layout da página.

### 3. Registrar a Rota
Adicione a nova página ao roteamento principal em `src/App.tsx`.

## Regras Críticas (Chakra UI v3)

O BFIN utiliza **Chakra UI v3**. É obrigatório seguir estas mudanças de props:
- `isOpen` -> `open`
- `isInvalid` -> `invalid` (em `Field.Root`)
- `isLoading` -> `loading` (em `Button`)
- `colorScheme` -> `colorPalette`
- `spacing` -> `gap`
- **Componentes**: Use `Field.Root`, `Field.Label`, `Field.ErrorText` para campos de formulário.
- **Botões**: Use o componente Atom `Button` de `src/components/atoms/Button`.
- **Toasts**: Use `toast` de `src/lib/toast`.

## Exemplo de Disparo
- "Crie uma tela para adicionar um novo membro à conta."
- "Implemente o formulário de edição de perfil seguindo o padrão do projeto."
- "Crie a página de Nova Receita Fixa."

## Referências
- Templates: `assets/form-template.tsx`, `assets/page-template.tsx`
- Documentação do Projeto: `GEMINI.md`, `DOCUMENTACAO.md`
