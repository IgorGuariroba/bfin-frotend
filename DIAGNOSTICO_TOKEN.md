# Diagnóstico do NPM_TOKEN

## Como Verificar se o Problema é com o Token

### 🔍 Teste Rápido no Render

Use este Build Command temporário para validar o token:

```bash
node scripts/test-npm-token.js && node scripts/setup-npmrc.js && npm ci && npm run build
```

### ✅ O que você deve ver se o token estiver correto:

```
=== Teste de Validação do NPM_TOKEN ===

1. Verificando variáveis de ambiente:
   NPM_TOKEN: ✅ Configurado
   Token usado: ✅ Sim (ghp_xxx...xxx)

2. Verificando formato do token:
   Formato GitHub: ✅ Correto
   Tamanho: 40+ caracteres ✅

3. Testando acesso ao GitHub Packages:
   Status HTTP: 200 OK
   ✅ Token tem acesso ao pacote @igorguariroba/bfin-sdk

4. Verificando .npmrc gerado:
   ✅ .npmrc está configurado corretamente com o token
```

### ❌ Problemas Comuns e Soluções

#### 1. Token não encontrado
```
NPM_TOKEN: ❌ Não configurado
```
**Solução:** Configure o `NPM_TOKEN` no Render (Environment > Environment Variables)

#### 2. Token sem permissão
```
Status HTTP: 401 Unauthorized
❌ Token inválido ou sem permissão
```
**Solução:** 
- Gere um novo token em: https://github.com/settings/tokens
- Marque a permissão `read:packages`
- Atualize o token no Render

#### 3. Token com formato incorreto
```
Formato GitHub: ⚠️ Formato não reconhecido
```
**Solução:** Use um GitHub Personal Access Token (deve começar com `ghp_`)

#### 4. Token não consegue acessar o pacote
```
Status HTTP: 404 Not Found
```
**Solução:** 
- Verifique se o pacote `@igorguariroba/bfin-sdk` existe
- Verifique se o token tem acesso ao repositório do pacote

### 📋 Checklist de Validação

- [ ] `NPM_TOKEN` está configurado no Render
- [ ] Token está marcado como "Build & Runtime"
- [ ] Token tem formato GitHub (`ghp_` ou `github_pat_`)
- [ ] Token tem permissão `read:packages`
- [ ] Token tem acesso ao repositório do pacote
- [ ] Script `test-npm-token.js` retorna status 200

### 🧪 Teste Local (Opcional)

Se você tiver acesso ao token, pode testar localmente:

```bash
export NPM_TOKEN=seu_token_aqui
node scripts/test-npm-token.js
```

### 🔗 Links Úteis

- Gerar novo token: https://github.com/settings/tokens
- Verificar permissões do token: https://github.com/settings/tokens
- Dashboard do Render: https://dashboard.render.com/static/srv-d5kjhjq4d50c739riq7g
