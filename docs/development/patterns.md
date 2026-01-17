# 💻 Padrões de Desenvolvimento

Seguimos um conjunto de padrões para garantir a consistência e qualidade do código em todo o projeto.

## 1. Chakra UI v3 (Regras Críticas)

O projeto utiliza a **versão 3 do Chakra UI**. Existem mudanças significativas em relação à v2:

- **Componentes Compostos**: Use sempre o padrão `Root`, `Trigger`, `Content`.
  - *Exemplo*: `Dialog.Root`, `Table.Root`, `Field.Root`.
- **Props Renomeadas**:
  - `isOpen` -> `open`
  - `isInvalid` -> `invalid`
  - `isLoading` -> `loading`
  - `colorScheme` -> `colorPalette`
  - `spacing` -> `gap`
- **Ícones**: Não utilize `leftIcon` ou `rightIcon`. Insira o ícone diretamente como children do componente.
- **Toaster**: Utilize o objeto `toaster` exportado de `src/components/ui/toaster.tsx` via `toaster.create()`.

## 2. TypeScript
- **Interfaces**: Prefira `interface` para definir props de componentes.
- **Tipagem de Eventos**: Sempre tipar corretamente eventos de formulário e cliques.
- **Strict Mode**: O projeto opera com `strict: true` no `tsconfig.json`. Evite o uso de `any`.

## 3. Padrões de Commit
Utilizamos o padrão **Conventional Commits**:

- `feat:` Introdução de uma nova funcionalidade.
- `fix:` Correção de um bug.
- `docs:` Alterações na documentação.
- `style:` Alterações que não afetam o sentido do código (espaços, formatação).
- `refactor:` Alteração de código que não corrige um bug nem adiciona uma funcionalidade.
- `test:` Adição ou correção de testes.
- `chore:` Atualização de tarefas de build, pacotes, etc.

## 4. Formulários
Utilize sempre a combinação **React Hook Form + Zod** para garantir performance e validação robusta no lado do cliente.

```tsx
const schema = z.object({ ... })
const { register, handleSubmit } = useForm({
  resolver: zodResolver(schema)
})
```
