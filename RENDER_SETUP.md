# Configuração do Build no Render

## ⚠️ IMPORTANTE: Configuração Necessária

### 1. Variável de Ambiente no Render

**OBRIGATÓRIO:** Configure a variável `NPM_TOKEN` no Render:

1. Acesse: https://dashboard.render.com/static/srv-d5kjhjq4d50c739riq7g
2. Vá em **Environment**
3. Adicione a variável:
   - **Key:** `NPM_TOKEN`
   - **Value:** Seu GitHub Personal Access Token (com permissão `read:packages`)
   - **Type:** `Secret`
   - **Scope:** `Build & Runtime` ✅

### 2. Build Command no Render

**IMPORTANTE:** Configure o Build Command no Render como:
```
node scripts/setup-npmrc.js && npm ci && npm run build
```

Ou use o script npm:
```
npm run build:render
```

Este comando executa em sequência:
1. `node scripts/setup-npmrc.js` - Cria o `.npmrc` com o token do ambiente
2. `npm ci` - Instala as dependências (com autenticação do .npmrc)
3. `npm run build` - Faz o build da aplicação

**⚠️ NOTA:** O Render para Static Sites executa `npm install` automaticamente ANTES do Build Command. Para garantir que o `.npmrc` seja criado antes, use o Build Command completo acima em vez de depender apenas do `preinstall` hook.

### Como Funciona

1. O script `setup-npmrc.js` detecta automaticamente o ambiente Render
2. Lê a variável `NPM_TOKEN` do ambiente
3. Cria o arquivo `.npmrc` com o token
4. O `npm ci` usa o `.npmrc` para autenticar com GitHub Packages
5. O build é executado normalmente

### Troubleshooting

Se o build ainda falhar com erro 401:

1. **Verifique se `NPM_TOKEN` está configurado:**
   - Vá em Environment no Render
   - Confirme que `NPM_TOKEN` existe e está marcado como "Build & Runtime"

2. **Verifique o token:**
   - O token deve ter permissão `read:packages`
   - Gere um novo token em: https://github.com/settings/tokens

3. **Verifique os logs:**
   - Procure por `[setup-npmrc]` nos logs do build
   - Deve aparecer "Token disponível: Sim"

## Comandos Disponíveis

- `npm run build:render` - Build completo para produção (setup + install + build)
- `npm run install:render` - Apenas setup + install (útil para testes)
- `npm run build` - Build normal (assume que `.npmrc` já existe)
