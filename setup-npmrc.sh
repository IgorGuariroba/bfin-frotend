#!/bin/bash
set -e

echo "[SETUP-NPMRC] Iniciando configuração do .npmrc..."

if [ -z "$NPM_TOKEN" ]; then
  echo "[SETUP-NPMRC] ⚠️  NPM_TOKEN não encontrado nas variáveis de ambiente"
  echo "[SETUP-NPMRC] Variáveis de ambiente disponíveis:"
  env | grep -i -E "(NPM|TOKEN|GITHUB|RENDER)" || echo "Nenhuma variável relevante encontrada"
  exit 1
fi

echo "[SETUP-NPMRC] ✅ NPM_TOKEN encontrado (tamanho: ${#NPM_TOKEN} caracteres)"

# Criar .npmrc no diretório atual
cat > .npmrc << EOF
@igorguariroba:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
EOF

echo "[SETUP-NPMRC] ✅ Arquivo .npmrc criado com sucesso"
echo "[SETUP-NPMRC] Conteúdo do .npmrc (primeiras 50 caracteres):"
head -c 50 .npmrc
echo ""
echo "[SETUP-NPMRC] Verificando se arquivo existe:"
ls -la .npmrc || echo "❌ Arquivo .npmrc não encontrado após criação"
