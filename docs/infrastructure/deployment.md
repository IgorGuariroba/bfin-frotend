# 🚀 Estratégia de Deploy

Este documento detalha o processo de deploy da aplicação BFIN Frontend.

## 🏗️ Ambientes

Atualmente, o projeto utiliza o **Render** como plataforma principal de hospedagem.

### Deploy Automático (Render)

O deploy é acionado automaticamente sempre que há um push para a branch `main`.

1. **Build Command**:
   ```bash
   node scripts/setup-npmrc.js && npm ci && npm run build
   ```
2. **Publish Directory**: `dist`
3. **Variáveis de Ambiente**:
   - `NPM_TOKEN`: Token GitHub com permissão `read:packages`.
   - `VITE_API_BASE_URL`: URL do backend em produção.

## 📦 Script de Setup NPM

Como utilizamos um SDK privado (`@igorguariroba/bfin-sdk`), o processo de build precisa configurar o acesso ao GitHub Packages:

```js
// scripts/setup-npmrc.js
// Este script cria o arquivo .npmrc dinamicamente usando a variável de ambiente NPM_TOKEN
```

## 🚀 Deploy Manual

Caso precise realizar um deploy manual para outras plataformas:

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

## 🛠️ Otimizações de Build

Configuramos o Vite para realizar code-splitting, reduzindo o tamanho dos bundles iniciais:

```ts
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'chakra': ['@chakra-ui/react'],
          'charts': ['recharts'],
        },
      },
    },
  },
})
```

## 🔄 Trigger via Webhook

O pipeline do GitHub Actions utiliza o Deploy Hook do Render para sinalizar o fim do build de validação e iniciar o deploy na infraestrutura:

```yaml
- name: Trigger Render Deploy
  if: github.ref == 'refs/heads/main'
  run: curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK_URL }}
```
