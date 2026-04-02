# 🧪 Testes

Garantimos a qualidade do código através de testes automatizados em diferentes níveis.

## Ferramentas
- **Vitest**: Test runner principal para testes unitários.
- **Testing Library**: Para testes de componentes React.
- **Playwright**: Para testes de integração no navegador e E2E.

## Comandos

### Testes Unitários e de Componentes
```bash
# Executar todos os testes unitários
npm test

# Modo Watch
npm test -- --watch

# Testes com Coverage
npm run test:coverage

# Interface Visual (Vitest UI)
npm run test:ui
```

### Testes E2E (Playwright)
```bash
# Executar todos os testes E2E
npm run test:e2e

# Executar com interface visual
npm run test:e2e:ui

# Executar em modo debug
npm run test:e2e:debug

# Executar com browser visível
npm run test:e2e:headed

# Ver relatório dos testes
npm run test:e2e:report
```

## Estrutura de Testes

### Testes Unitários e de Componentes
Os arquivos de teste devem ficar junto aos componentes ou em pastas `__tests__`:
- `Button.test.tsx`
- `BalanceCard.test.tsx`

### Testes E2E
Organizados na pasta `e2e/` por funcionalidade:
```
e2e/
├── auth/           # Autenticação (login, registro)
├── dashboard/      # Dashboard e fluxos completos
├── forms/          # Formulários específicos
└── utils/          # Helpers e configurações
```

## Cobertura de Testes

### ✅ Testes E2E Implementados
- **Autenticação**: Login, logout, registro, validações
- **Dashboard**: Navegação, widgets, responsividade
- **Formulários**: Criar conta, receitas, validações
- **Fluxos Completos**: Cenários reais de uso

### 🔄 Em Desenvolvimento
- Testes unitários de componentes
- Testes de integração de hooks
- Testes de acessibilidade

## Configuração para Desenvolvimento

### Pré-requisitos para E2E
1. Aplicação rodando: `npm run dev`
2. Browsers do Playwright: `npx playwright install`

### Boas Práticas
1. **Data TestIds**: Use `data-testid` para seletores estáveis
2. **Helpers**: Reutilize funções nos `utils/`
3. **Configurações**: Centralize em `test-config.ts`
4. **Isolamento**: Cada teste deve ser independente

## Testes no Storybook
Utilizamos o `@storybook/addon-vitest` para executar testes diretamente nas histórias dos componentes, garantindo que o que é visto na documentação é o que está sendo testado.

## CI/CD

### Workflows Configurados
- **CI Pipeline**: Testes E2E básicos em PRs e pushes
- **E2E Comprehensive**: Testes completos em múltiplos browsers
- **E2E for PR**: Testes otimizados com feedback rápido

### Execução Automática
- ✅ Pull requests → Smoke tests + Full tests
- ✅ Push para main/develop → Testes básicos no CI
- ✅ Releases → Testes completos em todos os browsers
- ✅ Schedule diário → Testes de regressão

Para mais detalhes:
- **Testes E2E**: [e2e/README.md](../../e2e/README.md)
- **Workflows CI/CD**: [e2e-workflows.md](./e2e-workflows.md)
