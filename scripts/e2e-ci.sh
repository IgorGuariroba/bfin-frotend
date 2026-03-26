#!/bin/bash

# Script para executar testes E2E simulando ambiente CI
# Usage: ./scripts/e2e-ci.sh [browser] [pattern]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para logging
log() {
    echo -e "${BLUE}[E2E-CI]${NC} $1"
}

success() {
    echo -e "${GREEN}[E2E-CI]${NC} ✅ $1"
}

warning() {
    echo -e "${YELLOW}[E2E-CI]${NC} ⚠️ $1"
}

error() {
    echo -e "${RED}[E2E-CI]${NC} ❌ $1"
}

# Configurações padrão
BROWSER=${1:-chromium}
TEST_PATTERN=${2:-""}
CI_MODE=true

log "Iniciando simulação do ambiente CI para testes E2E"
log "Browser: $BROWSER"
log "Padrão de testes: ${TEST_PATTERN:-'todos'}"

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    error "Execute este script do diretório raiz do projeto"
    exit 1
fi

# Verificar se Playwright está instalado
if ! command -v npx &> /dev/null; then
    error "npx não encontrado. Instale o Node.js"
    exit 1
fi

log "Verificando dependências..."

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    log "Instalando dependências..."
    npm ci
fi

# Verificar se browsers estão instalados
log "Verificando browsers do Playwright..."
if ! npx playwright --version &> /dev/null; then
    error "Playwright não está instalado"
    exit 1
fi

# Instalar browsers se necessário
log "Instalando/atualizando browsers..."
if [ "$BROWSER" = "all" ]; then
    npx playwright install --with-deps
else
    npx playwright install --with-deps $BROWSER
fi

# Limpar resultados anteriores
log "Limpando resultados anteriores..."
rm -rf test-results/ playwright-report/ coverage/

# Definir variáveis de ambiente como no CI
export CI=true
export FORCE_COLOR=1
export PLAYWRIGHT_BASE_URL=http://localhost:5173
export NODE_ENV=test

log "Variáveis de ambiente configuradas:"
echo "  CI=$CI"
echo "  PLAYWRIGHT_BASE_URL=$PLAYWRIGHT_BASE_URL"
echo "  NODE_ENV=$NODE_ENV"

# Build da aplicação
log "Fazendo build da aplicação..."
npm run build

# Verificar se dist/ foi criado
if [ ! -d "dist" ]; then
    error "Build falhou - diretório dist/ não encontrado"
    exit 1
fi

success "Build concluído"

# Preparar comando de teste
CMD="npx playwright test"

# Adicionar projeto
if [ "$BROWSER" != "all" ]; then
    CMD="$CMD --project=$BROWSER"
fi

# Adicionar padrão de teste se especificado
if [ ! -z "$TEST_PATTERN" ]; then
    CMD="$CMD $TEST_PATTERN"
fi

# Adicionar configurações de CI
CMD="$CMD --reporter=github"

log "Executando comando: $CMD"
log "Iniciando testes E2E..."

# Executar testes
if eval $CMD; then
    success "Todos os testes passaram! 🎉"

    # Mostrar estatísticas se disponível
    if [ -f "test-results/results.json" ]; then
        log "Gerando relatório de estatísticas..."
        node -e "
        try {
            const results = require('./test-results/results.json');
            console.log('📊 Estatísticas dos testes:');
            console.log('  Total:', results.stats.total || 'N/A');
            console.log('  Passou:', results.stats.passed || 'N/A');
            console.log('  Falhou:', results.stats.failed || 'N/A');
            console.log('  Ignorado:', results.stats.skipped || 'N/A');
            console.log('  Duração:', results.stats.duration || 'N/A');
        } catch (e) {
            console.log('Estatísticas não disponíveis');
        }
        "
    fi

    exit 0
else
    error "Alguns testes falharam"

    # Verificar se relatório foi gerado
    if [ -f "playwright-report/index.html" ]; then
        warning "Relatório disponível em: playwright-report/index.html"

        # Tentar abrir o relatório (opcional)
        if command -v xdg-open &> /dev/null; then
            log "Abrindo relatório no browser..."
            xdg-open playwright-report/index.html
        elif command -v open &> /dev/null; then
            log "Abrindo relatório no browser..."
            open playwright-report/index.html
        else
            log "Abra manualmente: file://$(pwd)/playwright-report/index.html"
        fi
    fi

    # Listar arquivos de mídia se existirem
    if [ -d "test-results" ]; then
        warning "Arquivos de debug disponíveis:"
        find test-results -name "*.png" -o -name "*.webm" | head -10 | while read file; do
            echo "  📁 $file"
        done
    fi

    exit 1
fi