## ADDED Requirements

### Requirement: CategorySelector DEVE aceitar control de qualquer formulário com categoryId
O componente `CategorySelector` SHALL usar generics para aceitar `Control<T>` onde `T extends FieldValues`, permitindo uso em qualquer formulário que possua campo `categoryId`.

#### Scenario: Uso no ExpenseForm mantém comportamento existente
- **WHEN** o `ExpenseForm` passa `control` tipado como `Control<ExpenseFormData>` ao `CategorySelector`
- **THEN** o componente MUST renderizar o select de categoria com o mesmo visual e comportamento atual

#### Scenario: Uso no IncomeForm com CategorySelector genérico
- **WHEN** o `IncomeFormFields` usa o `CategorySelector` com `control` tipado como `Control<IncomeFormData>`
- **THEN** o componente MUST renderizar o select de categoria com Chakra UI v3 `Select.Root`, ícone de tag, botão de nova categoria e portal popover

### Requirement: IncomeFormFields DEVE usar CategorySelector ao invés de NativeSelect inline
O `IncomeFormFields` SHALL substituir o bloco de `NativeSelect` de categoria pelo componente `CategorySelector` reutilizável.

#### Scenario: Seleção de categoria no IncomeForm
- **WHEN** o usuário abre o formulário de receita e clica no campo de categoria
- **THEN** MUST exibir popover com lista de categorias do tipo 'income' usando `Select.Root` (não `NativeSelect`)

#### Scenario: Criação de nova categoria no IncomeForm
- **WHEN** o usuário clica no botão "+" de nova categoria no formulário de receita
- **THEN** MUST abrir o dialog de criação de categoria (igual ao comportamento atual)

### Requirement: useIncomeFormLogic DEVE expor control do formulário
O hook `useIncomeFormLogic` SHALL incluir `control` (de `form.control`) no objeto de retorno para permitir uso com `Controller`-based components.

#### Scenario: control disponível no retorno do hook
- **WHEN** um componente consome `useIncomeFormLogic`
- **THEN** o retorno MUST incluir `control` do tipo `Control<IncomeFormData>` acessível diretamente e via objeto `form`
