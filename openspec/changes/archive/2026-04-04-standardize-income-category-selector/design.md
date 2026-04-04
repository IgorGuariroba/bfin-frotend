## Context

O `CategorySelector` atual (`src/components/molecules/CategorySelector.tsx`) usa `Control<ExpenseFormData>` como tipo do prop `control`, tornando-o exclusivo para o `ExpenseForm`. O `IncomeFormFields` implementa sua própria seleção de categoria com `NativeSelect` + `register`, que é visualmente diferente (native dropdown vs Chakra Select.Root com portal/popover) e não usa `Controller`.

O hook `useIncomeFormLogic` cria o `form` via `useForm<IncomeFormData>()` mas não expõe `control` no retorno.

## Goals / Non-Goals

**Goals:**
- Tornar `CategorySelector` genérico usando `Control<FieldValues>` com constraint em `categoryId`
- Reutilizar `CategorySelector` no `IncomeFormFields` substituindo o bloco inline
- Expor `control` do `useIncomeFormLogic` para uso no `IncomeForm`/`IncomeFormFields`
- Manter consistência visual entre formulários de despesa e receita

**Non-Goals:**
- Refatorar outros campos do `IncomeFormFields` (descrição, data, recorrência)
- Alterar comportamento funcional do `ExpenseForm`
- Criar abstração genérica para todos os selects do sistema

## Decisions

### 1. Usar generic type constraint ao invés de `FieldValues`

O `CategorySelector` usará um generic `T extends FieldValues` com `Control<T>`, onde `T` deve ter campo `categoryId`. Isso mantém type-safety sem acoplar ao tipo específico de formulário.

```tsx
interface CategorySelectorProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>; // default pode ser 'categoryId'
  // ... demais props mantidas
}
```

**Alternativa descartada**: Usar `Control<FieldValues>` sem generic — perde type-safety.

### 2. Expor `control` do `useIncomeFormLogic`

Adicionar `control: form.control` ao objeto de retorno, tanto no objeto `form` quanto diretamente.

### 3. Passar `control` como prop pelo `IncomeFormFields`

O `IncomeFormFields` receberá `control` como prop e repassará ao `CategorySelector`, mantendo o mesmo padrão do `ExpenseForm`.

## Risks / Trade-offs

- **[Risco] Quebra do ExpenseForm ao mudar tipagem** → Mitigação: Manter backward compatibility, o generic inferirá `ExpenseFormData` automaticamente quando `control` do tipo correto for passado.
- **[Risco] Nome do campo hardcoded como 'categoryId'** → Mitigação: Usar `name` prop com default, mas inicialmente manter como string fixa já que ambos os forms usam `categoryId`.
