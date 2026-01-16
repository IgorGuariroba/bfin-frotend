# Instalação do Projeto BFIN Frontend

Este projeto usa o SDK privado `@igorguariroba/bfin-sdk` hospedado no GitHub Packages.

## 🔑 Pré-requisitos

Você precisa ter um **GitHub Personal Access Token** com permissão `read:packages`.

### Como criar o token:

1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token (classic)"
3. Marque a permissão: **`read:packages`**
4. Copie o token gerado

## 💻 Instalação Local

### 1. Configure o arquivo `.env`

Crie um arquivo `.env` na raiz do projeto:

```bash
NPM_TOKEN=seu_token_aqui
VITE_API_BASE_URL=https://bfin-backend.onrender.com
```

### 2. Execute a instalação

O script automaticamente lê o `.env` e configura o `.npmrc`:

```bash
npm run install:all
```

Ou manualmente:

```bash
node scripts/setup-npmrc.js
npm install
```

## 🚀 Deploy no Render

### 1. Configure a variável de ambiente

No Render Dashboard:
1. Vá em **Environment** > **Environment Variables**
2. Adicione:
   - **Key:** `NPM_TOKEN`
   - **Value:** Seu GitHub Personal Access Token
   - **Type:** `Secret`
   - **Scope:** `Build & Runtime` ✅

### 2. Configure o Build Command

No Render Dashboard, configure o **Build Command**:

```bash
node scripts/setup-npmrc.js && npm ci && npm run build
```

Ou use o script npm:

```bash
npm run build:prod
```

## 📝 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run setup:npmrc` | Configura o `.npmrc` com o token |
| `npm run install:all` | Setup + Install completo |
| `npm run build:prod` | Setup + Install + Build (para Render) |
| `npm run dev` | Inicia dev server + Storybook |
| `npm run build` | Build de produção |

## 🔍 Troubleshooting

### Erro 401 Unauthorized

**Causa:** Token inválido ou sem permissão

**Solução:**
1. Verifique se o token tem permissão `read:packages`
2. Gere um novo token: https://github.com/settings/tokens
3. Atualize no `.env` (local) ou no Render (produção)

### Erro 404 Not Found

**Causa:** `.npmrc` não foi configurado

**Solução:**
```bash
npm run setup:npmrc
npm install
```

### Token não encontrado

**Causa:** Arquivo `.env` não existe ou está vazio

**Solução:**
1. Crie o arquivo `.env` na raiz do projeto
2. Adicione: `NPM_TOKEN=seu_token_aqui`
3. Execute: `npm run setup:npmrc`

## 🔐 Segurança

⚠️ **IMPORTANTE:**
- Nunca commite o arquivo `.env` ou `.npmrc` para o Git
- Ambos já estão no `.gitignore`
- O token é sensível e deve ser mantido em segredo
