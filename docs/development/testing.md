# 🧪 Testes

Garantimos a qualidade do código através de testes automatizados em diferentes níveis.

## Ferramentas
- **Vitest**: Test runner principal.
- **Testing Library**: Para testes de componentes React.
- **Playwright**: Para testes de integração no navegador e E2E.

## Comandos

```bash
# Executar todos os testes
npm test

# Modo Watch
npm test -- --watch

# Testes com Coverage
npm run test:coverage

# Interface Visual (Vitest UI)
npm run test:ui
```

## Estrutura de Testes
Os arquivos de teste devem ficar junto aos componentes ou em pastas `__tests__`:
- `Button.test.tsx`
- `BalanceCard.test.tsx`

## Testes no Storybook
Utilizamos o `@storybook/addon-vitest` para executar testes diretamente nas histórias dos componentes, garantindo que o que é visto na documentação é o que está sendo testado.
