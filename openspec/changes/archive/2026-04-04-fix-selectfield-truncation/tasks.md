## 1. Correção do SelectField

- [x] 1.1 Ajustar `Select.Trigger` para garantir `width: 100%` e impedir colapso ao selecionar valor
- [x] 1.2 Ajustar `Select.ValueText` com `flex: 1`, `minWidth: 0`, `overflow: hidden`, `textOverflow: ellipsis` e `whiteSpace: nowrap` para exibir texto completo sem forçar redimensionamento

## 2. Validação

- [x] 2.1 Testar visualmente no `CategorySelector` (IncomeForm) que o select mantém largura estável após seleção
- [x] 2.2 Verificar que textos normais (ex: "Salário") são exibidos por completo sem truncamento
