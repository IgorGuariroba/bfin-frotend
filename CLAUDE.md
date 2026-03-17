# 🤖 BFIN Frontend - Núcleo Essencial

Aplicação React/TypeScript de gerenciamento financeiro pessoal.

---

## 🏛️ REGRA ARQUITETURAL FUNDAMENTAL

### **DASHBOARD-FIRST NAVIGATION**

⚠️ **REGRA INVIOLÁVEL**: Exceto Login/Register, **TODA funcionalidade DEVE ser implementada como FORM no Dashboard**.

#### Estrutura Obrigatória:
```tsx
// Dashboard.tsx - renderExpandedContent()
case 'nova-funcionalidade':
  return <NovaFuncionalidadeForm onCancel={() => setExpandedForm(null)} />
```

**✅ Permitido:** `Login.tsx`, `Register.tsx`, `Dashboard.tsx`
**❌ Proibido:** Pages dedicadas, rotas extras, navegação externa ao Dashboard

---

## 🛠 Stack Principal

- **React 18.2** + **TypeScript 5.3** + **Vite 7.3**
- **Chakra UI v3.30** ⚠️ (V3 - sintaxe diferente!)
- **React Query 5.17** (server state)
- **React Hook Form + Zod** (forms + validation)
- **@igorguariroba/bfin-sdk** (API privada)

---

## 📁 Estrutura Básica

```
src/components/
├── atoms/           # Button, Input
├── molecules/       # BalanceCard, FormField
└── organisms/forms/ # 🔑 FORMULÁRIOS PRINCIPAIS
```

---

## ⚠️ Proibições Absolutas

1. **❌ NUNCA criar páginas dedicadas** - use Forms no Dashboard
2. **❌ NUNCA use Chakra UI v2 syntax** - sempre v3
3. **❌ NUNCA push direto na main** - sempre via PR
4. **❌ NUNCA use `any` em TypeScript**

---

## 🎯 Skills Disponíveis

Use conforme necessário:

- **`/skill chakra-v3`** - Guia completo Chakra UI v3 (props, componentes, syntax)
- **`/skill forms-patterns`** - Padrões React Hook Form + Zod detalhados
- **`/skill git-workflow`** - Workflow Git completo (branches, PRs, validação)
- **`/skill bfin-sdk`** - Como usar SDK privado (setup, configuração, exemplos)
- **`/skill component-patterns`** - Atomic Design e padrões de componentes
- **`/skill dev-commands`** - Scripts npm e comandos de desenvolvimento

---

**Última atualização**: Março 2025
**Versão**: 2.0.0 (Skills-based)