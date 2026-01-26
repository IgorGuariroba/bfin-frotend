# Design System BFIN — Tokens Semanticos

## Visao geral do app
O BFIN e um app de gerenciamento financeiro pessoal, com foco em visao geral de saldo, transacoes, categorias, formularios e visualizacao de dados. A interface prioriza leitura rapida, contraste adequado e estados claros para acoes e feedback.

## Codex skill
Para padronizar ajustes de UI com tokens e componentes deste documento, use a skill:
`bfin-design-system` em `/home/igorguariroba/.codex/skills/bfin-design-system/`.

## Paleta de cores (valores reais -> tokens)
Valores extraidos de `src/index.css` e mapeados para os tokens semanticos abaixo. Onde existe modo escuro, o token muda automaticamente pelo valor do tema.

### Texto
| Token | Light | Dark | Fonte |
| --- | --- | --- | --- |
| `text-primary` | `hsl(0, 0%, 13%)` | `hsl(0, 0%, 98%)` | `--foreground` |
| `text-secondary` | `hsl(0, 0%, 48%)` | `hsl(0, 0%, 64%)` | `--muted-foreground` |
| `text-muted` | `hsl(0, 0%, 64%)` | `hsl(0, 0%, 64%)` | `--gray-400` |
| `text-on-dark` | `hsl(0, 0%, 100%)` | `hsl(0, 0%, 98%)` | `--primary-foreground` (light) / `--foreground` (dark) |
| `text-on-brand` | `hsl(0, 0%, 100%)` | `hsl(0, 0%, 9%)` | `--primary-foreground` |

### Superficies (fundos)
| Token | Light | Dark | Fonte |
| --- | --- | --- | --- |
| `surface-page` | `hsl(0, 0%, 100%)` | `hsl(0, 0%, 9%)` | `--background` |
| `surface-section` | `hsl(0, 0%, 96%)` | `hsl(0, 0%, 18%)` | `--secondary` |
| `surface-card` | `hsl(0, 0%, 100%)` | `hsl(0, 0%, 14%)` | `--card` |
| `surface-subtle` | `hsl(152, 76%, 97%)` | `hsl(160, 84%, 20%)` | `--accent` |
| `surface-elevated` | `hsl(0, 0%, 100%)` | `hsl(0, 0%, 14%)` | `--card` |

### Acoes (botoes, links)
| Token | Light | Dark | Fonte |
| --- | --- | --- | --- |
| `action-primary` | `hsl(160, 84%, 39%)` | `hsl(158, 64%, 52%)` | `--primary` |
| `action-primary-hover` | `hsl(161, 94%, 30%)` | `hsl(161, 94%, 30%)` | `--primary-600` |
| `action-primary-active` | `hsl(163, 94%, 24%)` | `hsl(163, 94%, 24%)` | `--primary-700` |
| `action-secondary` | `hsl(0, 0%, 96%)` | `hsl(0, 0%, 18%)` | `--secondary` |
| `action-strong` | `hsl(0, 0%, 13%)` | `hsl(0, 0%, 13%)` | `--gray-900` |
| `action-strong-hover` | `hsl(0, 0%, 20%)` | `hsl(0, 0%, 20%)` | `--gray-800` |

### Bordas
| Token | Light | Dark | Fonte |
| --- | --- | --- | --- |
| `border-default` | `hsl(0, 0%, 91%)` | `hsl(0, 0%, 20%)` | `--border` |
| `border-subtle` | `hsl(0, 0%, 91%)` | `hsl(0, 0%, 20%)` | `--border` |
| `border-focus` | `hsl(160, 84%, 39%)` | `hsl(158, 64%, 52%)` | `--ring` |

### Status
| Token | Light | Dark | Fonte |
| --- | --- | --- | --- |
| `status-success` | `hsl(160, 84%, 39%)` | `hsl(158, 64%, 52%)` | `--success` |
| `status-warning` | `hsl(38, 92%, 50%)` | `hsl(43, 96%, 56%)` | `--warning` |
| `status-error` | `hsl(0, 84%, 60%)` | `hsl(0, 91%, 71%)` | `--destructive` |

### Sombras
| Token | Light | Dark | Fonte |
| --- | --- | --- | --- |
| `shadow-sm` | `0 1px 3px 0 hsla(0, 0%, 0%, 0.1), 0 1px 2px -1px hsla(0, 0%, 0%, 0.1)` | `0 1px 3px 0 hsla(0, 0%, 0%, 0.4), 0 1px 2px -1px hsla(0, 0%, 0%, 0.4)` | `--shadow-sm` |
| `shadow-md` | `0 4px 6px -1px hsla(0, 0%, 0%, 0.1), 0 2px 4px -2px hsla(0, 0%, 0%, 0.1)` | `0 4px 6px -1px hsla(0, 0%, 0%, 0.4), 0 2px 4px -2px hsla(0, 0%, 0%, 0.4)` | `--shadow-md` |
| `shadow-lg` | `0 10px 15px -3px hsla(0, 0%, 0%, 0.1), 0 4px 6px -4px hsla(0, 0%, 0%, 0.1)` | `0 10px 15px -3px hsla(0, 0%, 0%, 0.4), 0 4px 6px -4px hsla(0, 0%, 0%, 0.4)` | `--shadow-lg` |
| `shadow-card` | `0 4px 6px -1px hsla(0, 0%, 0%, 0.1), 0 2px 4px -2px hsla(0, 0%, 0%, 0.1)` | `0 4px 6px -1px hsla(0, 0%, 0%, 0.4), 0 2px 4px -2px hsla(0, 0%, 0%, 0.4)` | `--shadow-md` |
| `shadow-card-hover` | `0 10px 15px -3px hsla(0, 0%, 0%, 0.1), 0 4px 6px -4px hsla(0, 0%, 0%, 0.1)` | `0 10px 15px -3px hsla(0, 0%, 0%, 0.4), 0 4px 6px -4px hsla(0, 0%, 0%, 0.4)` | `--shadow-lg` |
| `shadow-button-primary` | `0 4px 14px hsla(160, 84%, 39%, 0.3)` | `0 4px 14px hsla(158, 64%, 52%, 0.25)` | `--shadow-green-md` |

## Componentes documentados
Todos os componentes interativos seguem estados: Default, Hover, Active/Pressed, Focus e Disabled. O estado Disabled usa `text-muted`, `surface-subtle`, `border-subtle`, remove sombras e aplica `cursor: not-allowed`.

### Botoes
**Primary**
- Default: `bg action-primary`, `text text-on-brand`, `radius radius-md`, `shadow shadow-button-primary`
- Hover: `bg action-primary-hover`
- Active: `bg action-primary-active`
- Focus: `border border-focus` com ring visivel
- Disabled: `bg surface-subtle`, `text text-muted`

**Secondary**
- Default: `bg action-secondary`, `text text-primary`, `border border-default`, `radius radius-md`
- Hover: `bg surface-subtle`
- Active: `bg surface-section`
- Focus: `border border-focus` com ring visivel
- Disabled: `bg surface-subtle`, `text text-muted`

**Strong (CTA)**
- Default: `bg action-strong`, `text text-on-dark`, `radius radius-md`, `shadow shadow-lg`
- Hover: `bg action-strong-hover`
- Active: `bg action-strong`
- Focus: `border border-focus` com ring visivel
- Disabled: `bg surface-subtle`, `text text-muted`

### Cards
- Default: `bg surface-card`, `radius radius-xl`, `shadow shadow-card`, `padding space-6`, `text text-primary`
- Hover: `shadow shadow-card-hover`
- Focus: se clicavel, usar `border border-focus` com ring visivel
- Disabled: `bg surface-subtle`, `text text-muted`, sem sombra

### Inputs
- Default: `bg surface-card`, `border border-default`, `radius radius-sm`, `text text-primary`
- Hover: `border border-default` (mantem) e `shadow shadow-sm`
- Active: `border border-default`
- Focus: `border border-focus` com ring visivel
- Disabled: `bg surface-subtle`, `text text-muted`, `border border-subtle`

### FormField
- Label: `text text-secondary`, `font-size text-sm`, `font-weight font-medium`
- Helper/Error: usar `text text-muted` ou `text status-error`
- Input: segue padrao de Inputs

### StatusBadge
- Success: `bg status-success`, `text text-on-brand`, `radius radius-full`
- Warning: `bg status-warning`, `text text-primary`, `radius radius-full`
- Error: `bg status-error`, `text text-on-brand`, `radius radius-full`

### BalanceCard
- Usa Card padrao
- Valor: `text text-primary`, `font-size text-3xl`, `font-weight font-semibold`
- Variantes: `status-success`, `status-warning`, `status-error` em detalhes ou indicadores

### TransactionList (item)
- Item: `bg surface-card`, `border border-default`, `radius radius-lg`, `padding space-4`
- Hover: `bg surface-subtle`
- Valores positivos: `text status-success`
- Valores negativos: `text status-error`

### Charts
- Series: `status-success`, `status-warning`, `status-error`, `action-primary` e `text-secondary` para eixos

## Exemplos de uso

### Botao Primary
```
Button
- bg: action-primary
- color: text-on-brand
- radius: radius-md
- shadow: shadow-button-primary
- padding-inline: space-4
- padding-block: space-3
```

### Card de resumo
```
Card
- bg: surface-card
- radius: radius-xl
- shadow: shadow-card
- padding: space-6

Title
- color: text-secondary
- size: text-sm

Value
- color: text-primary
- size: text-3xl
- weight: font-semibold
```

### Input com erro
```
Input
- bg: surface-card
- border: border-default
- radius: radius-sm
- text: text-primary

Error message
- color: status-error
- size: text-sm
```

### Layout de secao
```
Section
- bg: surface-section
- padding-block: space-12
- gap: space-8

Card grid
- gap: space-6
```
