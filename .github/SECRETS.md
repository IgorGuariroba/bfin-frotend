# 🔐 Configuração de Secrets - GitHub Actions

Este guia explica como configurar os secrets necessários para o CI/CD funcionar.

---

## 📋 Secrets Necessários

### 1. NPM_TOKEN (Obrigatório)

**Descrição**: Token do GitHub para acessar o SDK privado `@igorguariroba/bfin-sdk`

**Permissões necessárias**: `read:packages`

#### Como gerar:

1. Acesse: https://github.com/settings/tokens
2. Clique em **"Generate new token (classic)"**
3. **Name**: `BFIN CI/CD - NPM Packages`
4. **Expiration**: Recomendado: 90 days ou No expiration
5. **Scopes**: Marque apenas:
   - ✅ `read:packages` - Download packages from GitHub Package Registry
6. Clique em **"Generate token"**
7. ⚠️ **IMPORTANTE**: Copie o token agora! (formato: `ghp_xxxxxxxxxxxxx`)

#### Como configurar no GitHub:

1. Acesse: `https://github.com/SEU_USUARIO/bfin-frontend/settings/secrets/actions`
2. Clique em **"New repository secret"**
3. **Name**: `NPM_TOKEN`
4. **Value**: Cole o token copiado (ex: `ghp_xxxxxxxxxxxxx`)
5. Clique em **"Add secret"**

---

### 2. VITE_API_BASE_URL (Opcional - recomendado para deploy)

**Descrição**: URL base da API backend

**Valor**: `https://bfin-backend.onrender.com` (ou sua URL)

**⚠️ Nota**: Este secret é opcional para testes do CI. Se não configurado, o CI usará `http://localhost:3000` como fallback. Configure apenas se quiser usar a URL de produção no build.

#### Como configurar:

1. Acesse: `https://github.com/SEU_USUARIO/bfin-frontend/settings/secrets/actions`
2. Clique em **"New repository secret"**
3. **Name**: `VITE_API_BASE_URL`
4. **Value**: `https://bfin-backend.onrender.com`
5. Clique em **"Add secret"**

---

### 3. RENDER_DEPLOY_HOOK_URL (Opcional - só para deploy automático)

**Descrição**: Webhook do Render para trigger de deploy automático

#### Como obter no Render:

1. Acesse: https://dashboard.render.com
2. Selecione seu serviço (bfin-frontend)
3. Vá em **Settings** (barra lateral)
4. Role até **Deploy Hook**
5. Clique em **"Create Deploy Hook"**
6. Copie a URL gerada (formato: `https://api.render.com/deploy/srv-xxxxx?key=xxxxx`)

#### Como configurar no GitHub:

1. Acesse: `https://github.com/SEU_USUARIO/bfin-frontend/settings/secrets/actions`
2. Clique em **"New repository secret"**
3. **Name**: `RENDER_DEPLOY_HOOK_URL`
4. **Value**: Cole a URL do webhook
5. Clique em **"Add secret"**

---

## ✅ Verificação

### Testar se os secrets estão configurados

1. Acesse: `https://github.com/SEU_USUARIO/bfin-frontend/settings/secrets/actions`
2. Você deve ver (mínimo):
   - ✅ `NPM_TOKEN` (obrigatório)
   - 📌 `VITE_API_BASE_URL` (opcional - recomendado para deploy)
   - 📌 `RENDER_DEPLOY_HOOK_URL` (opcional - só para deploy automático)

### Testar o CI/CD

1. Faça um commit e push em qualquer branch
2. Acesse: `https://github.com/SEU_USUARIO/bfin-frontend/actions`
3. Verifique se o workflow está executando
4. Se houver erros relacionados a secrets, verifique os passos acima

---

## 🔄 Renovar Token Expirado

Se o token expirar, você verá este erro no CI:

```
npm error code E401
npm error 401 Unauthorized - GET https://npm.pkg.github.com/@igorguariroba%2fbfin-sdk
```

### Solução:

1. Gere um novo token seguindo os passos do item 1
2. Atualize o secret `NPM_TOKEN` com o novo token:
   - Acesse: `https://github.com/SEU_USUARIO/bfin-frontend/settings/secrets/actions`
   - Clique em `NPM_TOKEN`
   - Clique em **"Update secret"**
   - Cole o novo token
   - Clique em **"Update secret"**

---

## 🔒 Segurança

### ✅ Boas Práticas

- ✅ **Nunca** commite secrets no código
- ✅ Use `.env.local` para desenvolvimento local
- ✅ Adicione `.env*` no `.gitignore`
- ✅ Revogue tokens que não são mais necessários
- ✅ Use tokens com permissões mínimas necessárias
- ✅ Configure expiração de tokens

### ❌ Nunca Faça

- ❌ Não compartilhe tokens em chat/email
- ❌ Não coloque tokens em logs
- ❌ Não use o mesmo token para múltiplos propósitos
- ❌ Não versione arquivos `.env` com secrets reais

---

## 🆘 Problemas Comuns

### Erro: secret not found

**Sintoma**:
```
Error: Secret NPM_TOKEN not found
```

**Solução**:
- Verifique se o secret está configurado corretamente
- Verifique se o nome está exato (case-sensitive)
- Re-execute o workflow após configurar

### Erro: unauthorized

**Sintoma**:
```
npm error 401 Unauthorized
```

**Solução**:
- Token expirou ou é inválido
- Gere novo token com permissão `read:packages`
- Atualize o secret `NPM_TOKEN`

### Deploy não funciona

**Sintoma**:
```
curl: (52) Empty reply from server
```

**Solução**:
- Verifique se `RENDER_DEPLOY_HOOK_URL` está configurado
- Verifique se a URL está completa (com `?key=xxxxx`)
- Teste a URL manualmente: `curl -X POST "URL_DO_WEBHOOK"`

---

## 📚 Referências

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub Packages Authentication](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages)
- [Render Deploy Hooks](https://render.com/docs/deploy-hooks)

---

**Última atualização**: Janeiro 2026
