# 📖 Storybook

O Storybook é nossa ferramenta de documentação e desenvolvimento de componentes isolados.

## Acesso
Para iniciar o Storybook localmente:
```bash
npm run storybook
```
Ele estará disponível em `http://localhost:6006`.

## Estrutura de Stories
As histórias estão localizadas em `src/components/` seguindo a nomenclatura `.stories.tsx`.

### Exemplo:
```tsx
// Button.stories.tsx
export const Primary = {
  args: {
    children: 'Botão',
    colorPalette: 'orange'
  }
}
```

## Addons Utilizados
- **Essential**: Conjunto básico de ferramentas.
- **A11y**: Verificação de acessibilidade em tempo real.
- **Vitest**: Integração de testes unitários nas histórias.
- **Docs**: Geração automática de documentação baseada em JSDoc e tipos.
