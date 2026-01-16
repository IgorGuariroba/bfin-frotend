#!/bin/bash
# Script de instalação para o Render
# Este script configura o .npmrc e instala as dependências

echo "🚀 Iniciando instalação..."

# Executa o setup do .npmrc
node scripts/setup-npmrc.js

if [ $? -eq 0 ]; then
  echo "✅ .npmrc configurado com sucesso!"

  # Instala as dependências
  echo "📦 Instalando dependências..."
  npm ci

  if [ $? -eq 0 ]; then
    echo "✅ Dependências instaladas com sucesso!"
  else
    echo "❌ Erro ao instalar dependências"
    exit 1
  fi
else
  echo "❌ Erro ao configurar .npmrc"
  exit 1
fi
