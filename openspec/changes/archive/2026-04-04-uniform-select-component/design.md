## Context

O projeto BFIN Frontend usa Chakra UI v3 com Atomic Design. O `CategorySelector` em `src/components/molecules/CategorySelector.tsx` estabelece o padrão visual para selects: usa `Select` (Chakra v3) com `Controller` (react-hook-form), ícone à esquerda, `borderRadius="full"`, Portal para dropdown, e estilo consistente com o tema.

Porém, o select de "Frequência de Recorrência" no `IncomeFormFields.tsx` usa `NativeSelect` — componente diferente com aparência nativa do browser, quebrando a uniformidade visual.

## Goals / Non-Goals

**Goals:**
- Criar componente `FormSelect` genérico em `src/components/molecules/` que encapsule o padrão visual do select (Chakra v3 Select + Controller + Portal + ícone)
- Substituir o NativeSelect de recorrência pelo FormSelect
- Refatorar o CategorySelector para usar o FormSelect internamente, mantendo sua lógica específica (botão "+", validação de conta)

**Non-Goals:**
- Alterar o AccountSelector (usa padrão diferente com cards)
- Modificar outros formulários além do IncomeFormFields neste momento
- Mudar comportamento funcional dos selects existentes

## Decisions

### 1. Componente `FormSelect` genérico

**Decisão:** Criar `src/components/molecules/FormSelect.tsx` como componente genérico.

**Props principais:**
- `control` — Controller do react-hook-form
- `name` — nome do campo
- `label` — label do field
- `placeholder` — texto placeholder
- `icon` — componente de ícone (LucideIcon)
- `items` — array de `{ label: string, value: string }`
- `error` — mensagem de erro
- `required` — opcional, indicar campo obrigatório

**Rationale:** Extrair o padrão repetido do CategorySelector em um componente reutilizável segue o Atomic Design (molécula) e evita duplicação. O CategorySelector mantém sua lógica de negócio (botão nova categoria, validação de conta) e delega a renderização do select para o FormSelect.

### 2. Usar Controller (react-hook-form) ao invés de register

**Decisão:** O FormSelect usará `Controller` como o CategorySelector já faz.

**Rationale:** O `Select` do Chakra v3 não é um input nativo, então `register` não funciona diretamente. `Controller` é o padrão correto para componentes controlados.

### 3. Manter a mesma estrutura visual

**Decisão:** Replicar exatamente o estilo do CategorySelector: `borderRadius="full"`, ícone posicionado à esquerda com `pl={10}`, Portal para dropdown, cores usando CSS variables do tema.

**Rationale:** O objetivo é uniformidade — qualquer desvio visual invalidaria o propósito da mudança.

## Risks / Trade-offs

- **[Risco] Quebra visual sutil** → Testar visualmente ambos os selects após refatoração para garantir que o CategorySelector não mudou de aparência.
- **[Trade-off] CategorySelector fica com duas camadas** → A composição (CategorySelector > FormSelect) adiciona um nível de abstração, mas simplifica manutenção futura e garante consistência.
