#!/bin/bash

# Script para debug de problemas E2E no CI
# Executa checks detalhados para identificar problemas

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${BLUE}[DEBUG-E2E]${NC} $1"
}

success() {
    echo -e "${GREEN}[DEBUG-E2E]${NC} ✅ $1"
}

warning() {
    echo -e "${YELLOW}[DEBUG-E2E]${NC} ⚠️ $1"
}

error() {
    echo -e "${RED}[DEBUG-E2E]${NC} ❌ $1"
}

log "🔍 Iniciando debug de E2E no CI..."

# 1. Verificar ambiente
log "📋 Verificando ambiente..."
echo "Node version: $(node --version)"
echo "npm version: $(npm --version)"
echo "Playwright version: $(npx playwright --version)"
echo "Docker version: $(docker --version)"
echo "Docker Compose version: $(docker compose version)"

# 2. Verificar variáveis de ambiente
log "🔧 Verificando variáveis de ambiente..."
echo "CI: ${CI:-'not set'}"
echo "PLAYWRIGHT_BASE_URL: ${PLAYWRIGHT_BASE_URL:-'not set'}"
echo "VITE_API_BASE_URL: ${VITE_API_BASE_URL:-'not set'}"

# 3. Verificar se backend está rodando
log "🐳 Verificando status do backend..."
if [ -d "./backend" ]; then
    cd backend
    echo "Status dos containers:"
    docker compose ps || echo "Erro ao verificar containers"

    echo ""
    echo "Logs recentes (últimas 20 linhas):"
    docker compose logs --tail=20 app 2>/dev/null || docker compose logs --tail=20 || echo "Sem logs disponíveis"

    cd ..
else
    warning "Diretório backend não encontrado"
fi

# 4. Verificar conectividade
log "🌐 Verificando conectividade..."
echo "Testando localhost:3000..."
curl -v http://localhost:3000/ 2>&1 || echo "Falha ao conectar na porta 3000"

echo ""
echo "Testando localhost:5173..."
curl -v http://localhost:5173/ 2>&1 || echo "Falha ao conectar na porta 5173"

# 5. Verificar processos nas portas
log "🔍 Verificando processos nas portas..."
netstat -tlnp 2>/dev/null | grep :3000 || echo "Nada rodando na porta 3000"
netstat -tlnp 2>/dev/null | grep :5173 || echo "Nada rodando na porta 5173"

# 6. Verificar configuração do Playwright
log "🎭 Verificando configuração do Playwright..."
if [ -f "playwright.config.ts" ]; then
    echo "Arquivo de configuração encontrado"
    npx playwright test --list 2>&1 | head -10 || echo "Erro ao listar testes"
else
    error "playwright.config.ts não encontrado"
fi

# 7. Verificar arquivos de teste
log "📁 Verificando arquivos de teste..."
find e2e/ -name "*.spec.ts" | head -5
echo "Total de arquivos de teste: $(find e2e/ -name "*.spec.ts" | wc -l)"

# 8. Verificar auth setup
log "🔐 Verificando setup de autenticação..."
if [ -f "e2e/.auth/user.json" ]; then
    echo "Arquivo de auth encontrado"
    ls -la e2e/.auth/
else
    warning "Arquivo de autenticação não encontrado"
fi

# 9. Teste de conectividade específico
log "🧪 Teste de conectividade específico..."
if command -v curl &> /dev/null; then
    # Testar endpoints específicos do backend
    for endpoint in "" "health" "api/health" "api/v1/auth/register"; do
        echo "Testando: http://localhost:3000/$endpoint"
        response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/$endpoint" 2>/dev/null || echo "erro")
        echo "  Resposta: $response"
    done
fi

success "Debug concluído!"
echo ""
echo "📋 Próximos passos:"
echo "1. Verificar logs do backend se containers não estiverem rodando"
echo "2. Verificar se URLs estão corretas no CI"
echo "3. Verificar se variáveis de ambiente estão definidas"
echo "4. Verificar se backend tem endpoint de health"