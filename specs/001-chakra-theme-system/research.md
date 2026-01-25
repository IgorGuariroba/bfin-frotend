# Research: Chakra UI v3 Theme System

**Branch**: `001-chakra-theme-system` | **Date**: 2026-01-25

## Decisao 1: Uso do defineConfig

**Decision**: Usar `defineConfig` para definir a configuracao do tema antes de passar para `createSystem`.

**Rationale**:
- `defineConfig` oferece melhor inferencia de tipos TypeScript
- Permite separar a configuracao da criacao do sistema
- Facilita a composicao de multiplas configuracoes com `mergeConfigs`
- Padrao recomendado pela documentacao oficial do Chakra UI v3

**Alternatives considered**:
- Configuracao inline em `createSystem`: Funciona, mas sem type-safety completo
- Eject completo via CLI: Excesso de arquivos para o escopo atual

## Decisao 2: Manter defaultConfig como base

**Decision**: Continuar usando `defaultConfig` como base e estender com tokens customizados.

**Rationale**:
- Preserva todos os tokens e recipes padrao do Chakra UI
- Evita reescrever componentes que dependem de tokens padrao
- Permite override seletivo apenas do necessario
- Projeto atual ja usa essa abordagem com sucesso

**Alternatives considered**:
- `defaultBaseConfig`: Muito minimalista, perderia muitos tokens uteis
- Configuracao do zero: Trabalho excessivo sem beneficio claro

## Decisao 3: Estrutura de arquivos

**Decision**: Manter estrutura atual em `src/theme/` com adicao de arquivo de config.

**Rationale**:
- Projeto ja tem organizacao clara: `theme.ts`, `tokens.ts`, `index.ts`
- Adicionar `config.ts` para `defineConfig` mantem consistencia
- Nao requer migracao de imports existentes
- Separacao logica: config (defineConfig) vs sistema (createSystem)

**Nova estrutura proposta**:
```
src/theme/
├── config.ts        # defineConfig com tokens e recipes (NOVO)
├── theme.ts         # createSystem usando config (MODIFICAR)
├── tokens.ts        # Utilitarios cssVar e constantes (MANTER)
├── index.ts         # Re-exports publicos (MANTER)
└── theme.types.ts   # Tipos gerados pelo CLI (EXISTENTE)
```

**Alternatives considered**:
- Eject para `./theme/` na raiz: Padrao do CLI, mas quebraria imports existentes
- Tudo em um arquivo: Atual abordagem, mas dificulta manutencao

## Decisao 4: Geracao de tipos

**Decision**: Usar CLI do Chakra UI para gerar tipos em `src/theme/theme.types.ts`.

**Rationale**:
- Projeto ja tem arquivo `theme.types.ts` com tipos manuais
- CLI gera tipos precisos baseados na configuracao real
- Comando ja existe em `package.json`: `npm run theme:typegen`

**Alternatives considered**:
- Tipos manuais: Propenso a erros e desincronizacao
- Inferencia automatica: Limitada para tokens aninhados

## Decisao 5: Compatibilidade com CSS variables

**Decision**: Manter mapeamento de tokens para variaveis CSS do `index.css`.

**Rationale**:
- Arquitetura atual usa CSS variables como source of truth
- Permite mudar valores sem rebuild
- Suporta dark mode via seletor CSS
- Funciona bem com ferramentas externas de design

**Alternatives considered**:
- Tokens hardcoded: Perderia flexibilidade de CSS variables
- CSS-in-JS puro: Nao suportaria theming externo

## Referencias

- [Chakra UI v3 Customization](https://chakra-ui.com/docs/theming/customization/overview)
- [Chakra UI v3 Migration Guide](https://chakra-ui.com/docs/get-started/migration)
- [Chakra UI v3 Recipes](https://chakra-ui.com/docs/theming/recipes)
