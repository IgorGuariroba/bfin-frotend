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

## Verificação

Após atualizar, nos logs do build você deve ver:
```
[setup-npmrc] Script iniciado
[setup-npmrc] Ambiente CI/CD detectado
[setup-npmrc] Token disponível: Sim
✅ .npmrc configurado com sucesso
```
