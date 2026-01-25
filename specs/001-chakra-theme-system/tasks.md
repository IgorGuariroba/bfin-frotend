# Tasks: Chakra UI v3 Theme System com defineConfig

**Branch**: `001-chakra-theme-system` | **Date**: 2026-01-25

## Phase 1: Core Implementation

### Setup

- [ ] **T1.1**: Verificar dependência @chakra-ui/cli em devDependencies
  - Files: `package.json`
  - Description: Garantir que CLI está instalado para geração de tipos

### Core

- [ ] **T1.2**: Criar arquivo config.ts com defineConfig
  - Files: `src/theme/config.ts`
  - Description: Extrair configuração de theme.ts para defineConfig
  - Tokens: breakpoints, fonts, fontSizes, fontWeights, lineHeights, letterSpacings, spacing, radii, shadows, colors, semanticTokens

- [ ] **T1.3**: Refatorar theme.ts para usar config
  - Files: `src/theme/theme.ts`
  - Description: Importar config e usar createSystem(defaultConfig, config)
  - Dependencies: T1.2

- [ ] **T1.4**: Atualizar index.ts com export de config
  - Files: `src/theme/index.ts`
  - Description: Adicionar export { config } from './config'
  - Dependencies: T1.2

## Phase 2: Validation

### Tests

- [ ] **T2.1**: Executar type-check do projeto
  - Command: `npm run type-check`
  - Description: Verificar se não há erros de tipo após refatoração

- [ ] **T2.2**: Executar build do projeto
  - Command: `npm run build`
  - Description: Garantir que build compila sem erros

- [ ] **T2.3**: Executar testes existentes
  - Command: `npm test -- --run`
  - Description: Verificar se testes continuam passando

## Phase 3: Polish

### Documentation

- [ ] **T3.1**: Criar quickstart.md
  - Files: `specs/001-chakra-theme-system/quickstart.md`
  - Description: Documentar uso do novo sistema de tema

## Summary

| Phase | Tasks | Status |
|-------|-------|--------|
| Phase 1: Core | 4 | Pending |
| Phase 2: Validation | 3 | Pending |
| Phase 3: Polish | 1 | Pending |
| **Total** | **8** | **0 completed** |
