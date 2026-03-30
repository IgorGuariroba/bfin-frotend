#!/bin/bash

echo "🚀 Instalando dependências do Playwright..."

# Atualiza lista de pacotes
sudo apt update

# Instala dependências via Playwright
echo "📦 Instalando via Playwright..."
npx playwright install-deps

# Reinstala browsers
echo "🌐 Reinstalando browsers..."
npx playwright install

# Verifica se funcionou
echo "✅ Testando instalação..."
npx playwright --version

echo "🎉 Pronto! Agora você pode executar os testes."
echo "Teste com: npx playwright test --grep \"deve criar receita com dados válidos\" --headed"