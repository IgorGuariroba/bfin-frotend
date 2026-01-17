# 🔧 Troubleshooting

Guia de soluções para problemas comuns encontrados durante o desenvolvimento.

## ❌ Erro 401 Unauthorized (NPM)
**Problema**: O `npm install` falha com erro de autorização ao tentar baixar o SDK privado.

**Causa**: Token do GitHub não configurado ou expirado.

**Solução**:
1. Verifique se existe um arquivo `.env` com a variável `NPM_TOKEN`.
2. O token deve ter a permissão `read:packages`.
3. Execute `npm run setup:npmrc` para gerar o `.npmrc` corretamente.

## ❌ Erro de Autenticação (Refresh Token)
**Problema**: A aplicação desloga o usuário constantemente.

**Solução**:
1. Verifique se o backend está retornando o `Set-Cookie` ou o objeto de tokens corretamente.
2. Limpe o LocalStorage e Cookies do navegador e tente novamente.

## ❌ Componentes Chakra UI não estilizados
**Problema**: Componentes aparecem sem CSS ou com estilos quebrados.

**Solução**:
1. Verifique se o componente está dentro do `Provider` (em `App.tsx` ou `main.tsx`).
2. Se estiver criando um novo snippet, verifique a pasta `src/components/ui`.

## ❌ Build falha no TypeScript
**Problema**: `npm run build` falha com erros de tipo.

**Solução**:
1. Execute `npx tsc --noEmit` para ver a lista completa de erros.
2. Certifique-se de que não há erros de importação circular.
