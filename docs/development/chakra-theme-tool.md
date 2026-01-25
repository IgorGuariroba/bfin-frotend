# Chakra UI Theme Tool - Configuração e Uso

## Visão Geral

O Chakra UI Theme Tool (`@chakra-ui/cli`) é uma ferramenta oficial que gera tipos TypeScript automaticamente baseados no seu tema customizado, proporcionando:

- **Autocomplete melhorado** para tokens de design
- **Type safety** para valores de tokens
- **Detecção de erros** em tempo de compilação
- **Melhor DX** (Developer Experience)

## Status da Instalação

✅ **@chakra-ui/cli**: Já instalado na versão `^3.31.0`
✅ **Script configurado**: `theme:typegen` está disponível no package.json
✅ **Tema configurado**: `src/theme/theme.ts` está estruturado corretamente

## Como Usar

### 1. Gerar Tipos do Tema

```bash
# Executar geração de tipos
npm run theme:typegen

# Ou diretamente
npx @chakra-ui/cli typegen src/theme/theme.ts
```

### 2. Arquivos Gerados

O comando acima irá gerar:

```
src/theme/
├── theme.ts              # Configuração do tema (existente)
├── theme.types.ts        # Tipos gerados automaticamente
└── index.ts              # Exportações (se necessário)
```

### 3. Como Funciona

O CLI analisa seu arquivo `src/theme/theme.ts` e:

1. **Extrai todos os tokens** definidos
2. **Gera interfaces TypeScript** para cada categoria de token
3. **Cria tipos de união** para valores válidos
4. **Expõe autocomplete** no editor

## Exemplo de Tipos Gerados

```typescript
// Exemplo do que será gerado em theme.types.ts
export interface ThemeTokens {
  colors: {
    'brand.50': string;
    'brand.100': string;
    'brand.500': string;
    // ... todos os tokens de cor
    'primary': string;
    'secondary': string;
    // ... cores semânticas
  };

  spacing: {
    '0': string;
    '1': string;
    '2': string;
    // ... todos os tokens de espaçamento
  };

  fontSizes: {
    'xs': string;
    'sm': string;
    'md': string;
    // ... todos os tokens de tipografia
  };
}

// Tipos para props de componentes
type ColorToken = keyof ThemeTokens['colors'];
type SpacingToken = keyof ThemeTokens['spacing'];
type FontSizeToken = keyof ThemeTokens['fontSizes'];
```

## Benefícios no Desenvolvimento

### Antes (sem tipos):
```tsx
// ❌ Sem autocomplete, sujeito a erros
<Box bg="brand.500" p={4} fontSize="md">
  Content
</Box>
```

### Depois (com tipos):
```tsx
// ✅ Autocomplete completo, type safety
<Box
  bg="brand.500"    // autocomplete mostra: brand.50, brand.100, etc.
  p={4}             // autocomplete mostra: 0, 1, 2, etc.
  fontSize="md"     // autocomplete mostra: xs, sm, md, etc.
>
  Content
</Box>
```

## Configuração Avançada

### 1. Customizar Saída

Você pode especificar onde os tipos são gerados:

```bash
npx @chakra-ui/cli typegen src/theme/theme.ts --out src/theme/generated-types.ts
```

### 2. Watch Mode (Desenvolvimento)

Para regenerar tipos automaticamente durante o desenvolvimento:

```bash
npx @chakra-ui/cli typegen src/theme/theme.ts --watch
```

### 3. Adicionar ao Script de Build

No `package.json`:

```json
{
  "scripts": {
    "prebuild": "npm run theme:typegen",
    "build": "vite build",
    "theme:typegen": "npx @chakra-ui/cli typegen src/theme/theme.ts"
  }
}
```

## Integração com o Tema BFIN

### Estrutura Atual
```
src/theme/
├── theme.ts              # Sistema Chakra UI v3 configurado
├── tokens.ts             # Utilitários para acesso aos tokens
├── index.ts              # Exportações principais
└── README.md             # Documentação do design system
```

### Após Geração de Tipos
```
src/theme/
├── theme.ts              # Sistema Chakra UI v3 configurado
├── theme.types.ts        # 🆕 Tipos gerados automaticamente
├── tokens.ts             # Utilitários para acesso aos tokens
├── index.ts              # Exportações principais (atualizado)
└── README.md             # Documentação do design system
```

## Uso nos Componentes

### Importação dos Tipos

```typescript
// Em componentes que precisam de type safety
import type { ColorToken, SpacingToken } from '../theme/theme.types';

interface ButtonProps {
  bg?: ColorToken;
  p?: SpacingToken;
  children: React.ReactNode;
}
```

### Props Tipadas

```tsx
export const CustomButton = ({ bg = 'brand.500', p = 4, children }: ButtonProps) => {
  return (
    <Box bg={bg} p={p}>
      {children}
    </Box>
  );
};
```

## Troubleshooting

### Erro "Command not found"
```bash
# Verificar instalação
npm ls @chakra-ui/cli

# Reinstalar se necessário
npm install --save-dev @chakra-ui/cli@latest
```

### Tipos não aparecem no autocomplete
1. Verificar se o arquivo foi gerado
2. Reiniciar o TypeScript server (VS Code: Ctrl+Shift+P → "Restart TS Server")
3. Verificar importações

### Tokens não sendo detectados
1. Verificar se o tema está usando `createSystem`
2. Verificar estrutura dos tokens no theme.ts
3. Executar o comando novamente

## Comandos Úteis

```bash
# Gerar tipos uma vez
npm run theme:typegen

# Verificar versão do CLI
npx @chakra-ui/cli --version

# Ajuda completa
npx @chakra-ui/cli typegen --help

# Validar tema sem gerar tipos
npx @chakra-ui/cli typegen src/theme/theme.ts --dry-run
```

## Próximos Passos

1. **Execute** `npm run theme:typegen` para gerar os tipos iniciais
2. **Verifique** se os arquivos foram criados corretamente
3. **Teste** o autocomplete em um componente
4. **Configure** regeneração automática no processo de build
5. **Documente** para a equipe o novo fluxo de trabalho

## Observações Importantes

- ⚠️ **Não edite** os arquivos gerados manualmente
- 🔄 **Execute** o comando sempre que modificar o tema
- 📝 **Commite** os tipos gerados no controle de versão
- 🚀 **Automatize** a geração no pipeline de CI/CD

## Links Úteis

- [Chakra UI CLI Documentation](https://chakra-ui.com/docs/tools/cli)
- [TypeScript Theme Configuration](https://chakra-ui.com/docs/theming/customize-theme)
- [Design Tokens Best Practices](https://chakra-ui.com/docs/theming/theme-tokens)