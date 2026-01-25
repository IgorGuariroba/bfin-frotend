# Implementation Plan: Chakra UI v3 Theme System com defineConfig

**Branch**: `001-chakra-theme-system` | **Date**: 2026-01-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-chakra-theme-system/spec.md`

## Summary

Refatorar a configuracao do tema Chakra UI v3 para usar `defineConfig` em vez de configuracao inline, melhorando type-safety e organizacao. A implementacao mantera compatibilidade total com os tokens CSS existentes e componentes atuais.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18.x
**Primary Dependencies**: @chakra-ui/react ^3.30.0, @emotion/react ^11.14.0
**Storage**: N/A (configuracao de UI)
**Testing**: Vitest com jsdom
**Target Platform**: Web (browsers modernos)
**Project Type**: Web application (frontend only)
**Performance Goals**: Hot reload < 2s, build time sem aumento significativo
**Constraints**: Compatibilidade com tokens CSS existentes em index.css
**Scale/Scope**: ~50 componentes usando o tema

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

O projeto nao possui constitution definida (template vazio). Seguindo boas praticas gerais:

- [x] Mudanca isolada em `src/theme/` sem afetar outros dominios
- [x] Compatibilidade retroativa mantida
- [x] Tipos TypeScript para type-safety
- [x] Testes existentes devem continuar passando

## Project Structure

### Documentation (this feature)

```text
specs/001-chakra-theme-system/
├── plan.md              # This file
├── research.md          # Decisoes tecnicas (COMPLETE)
├── quickstart.md        # Guia rapido de uso (PENDENTE)
└── tasks.md             # Tarefas de implementacao (via /speckit.tasks)
```

### Source Code (repository root)

```text
src/theme/
├── config.ts        # NOVO: defineConfig com tokens e recipes
├── theme.ts         # MODIFICAR: createSystem usando config
├── tokens.ts        # MANTER: Utilitarios cssVar e constantes
├── index.ts         # MODIFICAR: Adicionar export de config
└── theme.types.ts   # EXISTENTE: Tipos gerados pelo CLI
```

**Structure Decision**: Manter estrutura atual adicionando `config.ts` para separar definicao de configuracao da criacao do sistema.

## Complexity Tracking

> Nenhuma violacao identificada - implementacao simples e direta.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | - | - |

## Implementation Phases

### Phase 1: Criar config.ts com defineConfig

1. Criar arquivo `src/theme/config.ts`
2. Extrair configuracao de `theme.ts` para `defineConfig`
3. Manter todos os tokens existentes

### Phase 2: Refatorar theme.ts

1. Importar config de `config.ts`
2. Usar `createSystem(defaultConfig, config)`
3. Remover configuracao inline

### Phase 3: Atualizar exports

1. Adicionar export de `config` em `index.ts`
2. Garantir backward compatibility

### Phase 4: Gerar tipos e validar

1. Executar `npm run theme:typegen`
2. Verificar autocomplete funcionando
3. Rodar testes e build

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Quebra de imports existentes | Alto | Manter mesmos exports em index.ts |
| Tipos nao gerados corretamente | Medio | Validar CLI do Chakra UI |
| Performance de build | Baixo | Monitorar tempo de build |

## Files to Modify

1. `src/theme/config.ts` - CRIAR
2. `src/theme/theme.ts` - MODIFICAR
3. `src/theme/index.ts` - MODIFICAR (adicionar export)
4. `package.json` - VERIFICAR script theme:typegen

## Dependencies

- @chakra-ui/cli (devDependency) - para geracao de tipos
