# Configuração do Build no Render

## Solução Simples e Direta

Para garantir que o `.npmrc` seja criado **antes** do `npm install`, configure o **Build Command** no Render:

### Build Command (Render)
```
npm run build:render
```

Este comando executa em sequência:
1. `node scripts/setup-npmrc.js` - Cria o `.npmrc` com o token
2. `npm install` - Instala as dependências (agora com autenticação)
3. `npm run build` - Faz o build da aplicação

### Variáveis de Ambiente no Render

Certifique-se de que a variável `NPM_TOKEN` está configurada:
- **Key:** `NPM_TOKEN`
- **Value:** Seu GitHub Personal Access Token (com permissão `read:packages`)
- **Type:** `Secret` (Build & Runtime)

### Alternativa: Build Command Manual

Se preferir, você também pode usar diretamente:
```
node scripts/setup-npmrc.js && npm install && npm run build
```

## Comandos Disponíveis

- `npm run build:render` - Build completo para produção (setup + install + build)
- `npm run install:render` - Apenas setup + install (útil para testes)
- `npm run build` - Build normal (assume que `.npmrc` já existe)
