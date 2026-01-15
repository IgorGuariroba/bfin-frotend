# Como Atualizar o Build Command no Render

## ⚠️ Ação Necessária no Dashboard do Render

Como a API do Render não permite atualizar Static Sites diretamente, você precisa atualizar manualmente no dashboard:

### Passo a Passo:

1. **Acesse o Dashboard:**
   - URL: https://dashboard.render.com/static/srv-d5kjhjq4d50c739riq7g/settings

2. **Vá para a seção "Build & Deploy"**

3. **Atualize o Build Command:**
   - **Comando atual:** `npm run build:render`
   - **Novo comando:** `node scripts/setup-npmrc.js && npm ci && npm run build`

   Ou mantenha `npm run build:render` se preferir (já está configurado corretamente no package.json)

4. **Salve as alterações**

5. **Faça um Manual Deploy** para testar

## Por que essa mudança?

O problema é que o Render executa `npm install` automaticamente ANTES do Build Command. Isso faz com que o `preinstall` hook seja executado, mas:
- Os logs do `preinstall` podem não aparecer
- O token pode não estar disponível no momento do `preinstall`
- O `.npmrc` pode não ser criado a tempo

**Solução:** Executar o `setup-npmrc.js` diretamente no Build Command garante que:
1. O script seja executado com logs visíveis
2. O `.npmrc` seja criado antes do `npm ci`
3. A autenticação funcione corretamente

## Como Validar se o NPM_TOKEN está Correto

### Opção 1: Teste Local (se você tiver o token)

```bash
# Configure o token localmente
export NPM_TOKEN=seu_token_aqui

# Execute o script de validação
node scripts/test-npm-token.js
```

### Opção 2: Teste no Render (Build Command temporário)

Para validar o token no Render, use este Build Command temporário:

```bash
node scripts/test-npm-token.js && node scripts/setup-npmrc.js && npm ci && npm run build
```

Ou use o script shell:

```bash
bash scripts/validate-token-render.sh && node scripts/setup-npmrc.js && npm ci && npm run build
```

### O que verificar:

1. **Token está configurado?**
   - Deve aparecer: `NPM_TOKEN: ✅ Configurado`

2. **Token tem formato correto?**
   - Deve começar com `ghp_` ou `github_pat_`

3. **Token tem permissão?**
   - Status HTTP deve ser `200` (não `401`)
   - Se for `401`, o token não tem permissão `read:packages`

4. **Token consegue acessar o pacote?**
   - Deve conseguir acessar `@igorguariroba/bfin-sdk`

## Verificação Após Atualizar Build Command

Após atualizar o Build Command, nos logs do build você deve ver:
```
[setup-npmrc] Script iniciado
[setup-npmrc] Ambiente CI/CD detectado
[setup-npmrc] Token disponível: Sim
✅ .npmrc configurado com sucesso
```
