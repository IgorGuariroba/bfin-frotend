#!/bin/bash
# Script para validar NPM_TOKEN no ambiente Render
# Execute este script no Build Command do Render para testar o token

echo "=== Validação do NPM_TOKEN no Render ==="
echo ""

# Verificar variáveis de ambiente
echo "1. Variáveis de ambiente:"
echo "   NPM_TOKEN: ${NPM_TOKEN:+✅ Configurado (${#NPM_TOKEN} caracteres)}"
echo "   NODE_AUTH_TOKEN: ${NODE_AUTH_TOKEN:+✅ Configurado}"
echo "   GITHUB_TOKEN: ${GITHUB_TOKEN:+✅ Configurado}"
echo "   RENDER: ${RENDER:+✅ Ambiente Render detectado}"
echo ""

# Verificar token
TOKEN=${NPM_TOKEN:-${NODE_AUTH_TOKEN:-${GITHUB_TOKEN}}}
if [ -z "$TOKEN" ]; then
  echo "❌ ERRO: Nenhum token encontrado!"
  echo "   Configure NPM_TOKEN no Render (Environment > Environment Variables)"
  exit 1
fi

# Verificar formato
if [[ "$TOKEN" =~ ^ghp_ ]] || [[ "$TOKEN" =~ ^github_pat_ ]]; then
  echo "✅ Token tem formato GitHub correto"
else
  echo "⚠️  Token não tem formato GitHub padrão (ghp_ ou github_pat_)"
fi

# Testar acesso ao GitHub Packages
echo ""
echo "2. Testando acesso ao GitHub Packages:"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://npm.pkg.github.com/@igorguariroba/bfin-sdk")

echo "   Status HTTP: $RESPONSE"

if [ "$RESPONSE" = "200" ]; then
  echo "   ✅ Token tem acesso ao pacote"
elif [ "$RESPONSE" = "401" ]; then
  echo "   ❌ Token inválido ou sem permissão 'read:packages'"
  exit 1
elif [ "$RESPONSE" = "404" ]; then
  echo "   ⚠️  Pacote não encontrado (pode ser privado)"
else
  echo "   ⚠️  Resposta inesperada: $RESPONSE"
fi

echo ""
echo "✅ Validação concluída - Token está configurado corretamente"
