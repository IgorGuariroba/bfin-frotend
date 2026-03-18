# Clean Code Skill - BFIN Frontend

Sistema de regras e padrões para manter código limpo, manutenível e escalável no projeto BFIN Frontend.

## 🎯 Quando Usar

- Sempre antes de implementar novas funcionalidades
- Durante revisões de código e refatorações
- Ao detectar code smells ou violações de princípios SOLID
- Para validar se a arquitetura está seguindo as melhores práticas

## 📐 Princípios SOLID Aplicados

### 1. Single Responsibility Principle (SRP)
```tsx
// ❌ Função fazendo muitas coisas
const renderExpandedContent = () => {
  // Lógica de renderização
  // Mapeamento de strings para componentes
  // Gerenciamento de animações
  // Configuração de props
};

// ✅ Responsabilidades separadas
const ExpandedFormRenderer = ({ expandedForm, onClose }) => { /* Só renderiza */ };
const useExpandedForm = () => { /* Só gerencia estado */ };
const FORM_REGISTRY = { /* Só mapeia configs */ };
```

### 2. Open/Closed Principle (OCP)
```tsx
// ✅ Aberto para extensão, fechado para modificação
const FORM_REGISTRY: Record<string, FormConfig> = {
  [EXPANDED_FORMS.NOVO_FORM]: {
    component: NovoFormComponent,
    props: { /* configurações específicas */ }
  }
  // Adicionar novos forms sem modificar código existente
};
```

### 3. Dependency Inversion Principle (DIP)
```tsx
// ✅ Dependendo de abstrações, não de concretudes
interface FormConfig {
  component: React.ComponentType<any>;
  props?: Record<string, any>;
}

// Renderer depende da abstração FormConfig, não de componentes específicos
```

## 🚨 Code Smells Proibidos

### 1. **Long Method**
- ❌ Métodos com mais de 20 linhas
- ✅ Extrair submétodos com responsabilidades específicas

### 2. **Magic Strings/Numbers**
```tsx
// ❌ Magic strings
setExpandedForm('extrato');

// ✅ Constants centralizadas
import { EXPANDED_FORMS } from '../types/ExpandedForms';
openForm(EXPANDED_FORMS.EXTRATO);
```

### 3. **Nested Ternary Hell**
```tsx
// ❌ Ternários aninhados
expandedForm === 'a' ? <A /> : expandedForm === 'b' ? <B /> : expandedForm === 'c' ? <C /> : null

// ✅ Registry pattern ou switch/case
const FormComponent = FORM_REGISTRY[expandedForm]?.component;
return FormComponent ? <FormComponent {...props} /> : null;
```

### 4. **Duplicate Code**
```tsx
// ❌ Props repetidas
<FormA onCancel={() => setForm(null)} onSuccess={() => setForm(null)} />
<FormB onCancel={() => setForm(null)} onSuccess={() => setForm(null)} />

// ✅ Props base centralizadas
const baseProps = { onCancel: closeForm, onSuccess: closeForm };
```

## 🏗️ Padrões Arquiteturais

### 1. **Factory Pattern**
```tsx
// Registry como factory para componentes
export const getFormConfig = (formType: string): FormConfig | null => {
  return FORM_REGISTRY[formType] || null;
};
```

### 2. **Strategy Pattern**
```tsx
// Diferentes estratégias para wrapper customizado
const content = CustomWrapper ? (
  <CustomWrapper onCancel={onClose}>
    <FormComponent {...props} />
  </CustomWrapper>
) : (
  <FormComponent {...props} />
);
```

### 3. **Hook Pattern**
```tsx
// Estado e lógica encapsulados em hooks customizados
const { expandedForm, openForm, closeForm, hasOpenForm } = useExpandedForm();
```

## ✅ Checklist de Implementação

### Antes de commitar:
- [ ] **Funções têm responsabilidade única**
- [ ] **Sem magic strings - usar constants**
- [ ] **Sem código duplicado**
- [ ] **Métodos com máximo 20 linhas**
- [ ] **Nomes expressivos e auto-documentados**
- [ ] **Dependencies injetadas via props/hooks**
- [ ] **Tipagem TypeScript completa**
- [ ] **Early returns para reduzir aninhamento**

### Arquitetura:
- [ ] **Segue padrão Dashboard-First**
- [ ] **Components seguem Atomic Design**
- [ ] **Estado gerenciado por hooks customizados**
- [ ] **Configurações centralizadas em registries**
- [ ] **Separação clara de concerns**

## 🔧 Comandos de Validação

```bash
# Lint com regras Clean Code
npm run lint

# Verificar tipos TypeScript
npm run type-check

# Executar testes
npm test

# Verificar coverage
npm run test:coverage
```

## 📚 Refatorações Recentes

### ✅ Dashboard renderExpandedContent → ExpandedFormRenderer
**Antes**: 100+ linhas com ternários aninhados
**Depois**: 3 componentes com responsabilidades únicas
- `ExpandedFormRenderer` (renderização)
- `useExpandedForm` (estado)
- `FORM_REGISTRY` (configuração)

## 🎯 Próximas Melhorias

1. **Error Boundaries** para formulários
2. **Lazy Loading** de componentes pesados
3. **Memoização** de renders caros
4. **Custom Hooks** para lógicas repetitivas
5. **Testes unitários** para cada pattern

---

**Lembre-se**: Clean Code é sobre **comunicação**. O código deve contar uma história clara para o próximo desenvolvedor (que pode ser você em 6 meses)!