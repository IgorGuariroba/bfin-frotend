#!/bin/bash

# Script para executar testes E2E com backend Docker localmente
# Replica o setup do CI/CD para desenvolvimento

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para logging
log() {
    echo -e "${BLUE}[E2E-BACKEND]${NC} $1"
}

success() {
    echo -e "${GREEN}[E2E-BACKEND]${NC} ✅ $1"
}

warning() {
    echo -e "${YELLOW}[E2E-BACKEND]${NC} ⚠️ $1"
}

error() {
    echo -e "${RED}[E2E-BACKEND]${NC} ❌ $1"
}

cleanup() {
    log "🧹 Fazendo cleanup..."
    if [ -d "./backend" ]; then
        cd backend
        docker compose down || true
        cd ..
    fi
    exit
}

# Trap para cleanup em caso de interrupção
trap cleanup INT TERM

log "🚀 Iniciando setup do backend para testes E2E locais"

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    error "Execute este script do diretório raiz do projeto frontend"
    exit 1
fi

# Verificar se Docker está rodando
if ! docker info >/dev/null 2>&1; then
    error "Docker não está rodando. Inicie o Docker primeiro."
    exit 1
fi

# Verificar se backend já está clonado
if [ ! -d "./backend" ]; then
    log "📥 Clonando repositório do backend..."
    git clone https://github.com/IgorGuariroba/bfin-backend.git backend

    if [ $? -ne 0 ]; then
        error "Falha ao clonar o repositório do backend"
        error "Verifique se você tem acesso ao repositório: https://github.com/IgorGuariroba/bfin-backend.git"
        exit 1
    fi

    success "Backend clonado com sucesso"
else
    log "📁 Backend já existe, atualizando..."
    cd backend
    git pull || warning "Falha ao atualizar backend (continuando mesmo assim)"
    cd ..
fi

# Verificar se backend tem docker-compose
if [ ! -f "./backend/docker-compose.yml" ] && [ ! -f "./backend/compose.yml" ]; then
    error "Arquivo docker-compose.yml não encontrado no backend"
    exit 1
fi

log "🐳 Iniciando backend com Docker..."
cd backend

# Verificar se backend já está rodando
if docker compose ps | grep -q "Up"; then
    log "🟢 Backend já está rodando, mantendo containers existentes"

    # Verificar se API está respondendo
    if curl -f -s http://localhost:3000/health >/dev/null 2>&1; then
        success "Backend já está disponível e respondendo!"
        BACKEND_ALREADY_RUNNING=true
    else
        warning "Containers estão rodando mas API não responde, reiniciando..."
        docker compose restart app
        BACKEND_ALREADY_RUNNING=false
    fi
else
    log "🐳 Backend não está rodando, iniciando containers..."

    # Parar containers existentes para evitar conflitos
    log "🛑 Parando containers existentes (se houver)..."
    docker compose down || true

    # Remover containers órfãos que podem estar causando conflito de nomes
    log "🧹 Limpando containers órfãos..."
    docker container prune -f > /dev/null 2>&1 || true

    # Remover especificamente containers BFIN antigos se existirem
    CONFLICTING_CONTAINERS=$(docker ps -a -q -f name=bfin-)
    if [ ! -z "$CONFLICTING_CONTAINERS" ]; then
        log "🗑️ Removendo containers BFIN antigos..."
        docker rm -f $CONFLICTING_CONTAINERS > /dev/null 2>&1 || true
    fi

    # Iniciar backend
    log "🚀 Iniciando containers do backend..."
    docker compose up -d --build
    BACKEND_ALREADY_RUNNING=false
fi

if [ $? -ne 0 ]; then
    error "Falha ao iniciar o backend com Docker"

    # Debug em caso de falha
    warning "Tentando diagnosticar o problema..."
    docker compose ps
    echo ""
    docker compose logs --tail=10
    cd ..
    exit 1
fi

cd ..
success "Backend iniciado com sucesso"

# Health check apenas se backend não estava rodando
if [ "$BACKEND_ALREADY_RUNNING" = false ]; then
    log "⏳ Aguardando backend ficar disponível..."

    # Health check com múltiplas tentativas
    MAX_ATTEMPTS=30
    ATTEMPT=0

    while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
        ATTEMPT=$((ATTEMPT + 1))

        # Tenta diferentes endpoints de health check
        if curl -f -s http://localhost:3000/health >/dev/null 2>&1 || \
           curl -f -s http://localhost:3000/api/health >/dev/null 2>&1 || \
           curl -f -s http://localhost:3000/ >/dev/null 2>&1; then
            success "Backend está respondendo!"
            break
        fi

        if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
            warning "Backend pode não ter endpoint de health, mas continuando..."

            # Verificar se container está rodando
            echo "🐳 Status dos containers:"
            docker compose ps
            echo ""
            echo "📋 Logs recentes do container:"
            docker compose logs --tail=20 app 2>/dev/null || docker compose logs --tail=20
            break
        fi

        echo -n "."
        sleep 2
    done

    echo ""

    # Configurar banco de dados apenas na primeira execução
    log "⚙️ Configurando banco de dados..."

    # Gerar client do Prisma
    log "📦 Gerando client do Prisma..."
    docker compose exec -T app npx prisma generate > /dev/null 2>&1 || warning "Erro ao gerar client Prisma"

    # Aplicar migrações
    log "📋 Aplicando migrações do banco..."
    docker compose exec -T app npx prisma migrate deploy > /dev/null 2>&1 || warning "Erro ao aplicar migrações"

    # Executar seed
    log "🌱 Criando dados de teste..."
    docker compose exec -T app npm run db:seed > /dev/null 2>&1 || warning "Erro ao executar seed"

    # Criar usuário de teste
    log "👤 Criando usuário de teste..."
    curl -X POST http://localhost:3000/api/v1/auth/register \
        -H "Content-Type: application/json" \
        -d '{"full_name":"Usuario Teste","email":"teste@bfin.com.br","password":"senha123"}' \
        > /dev/null 2>&1 || log "Usuário já existe ou erro ao criar"

    success "Backend configurado com sucesso!"
else
    log "✅ Usando backend já configurado"
fi

log "🧪 Executando testes E2E..."

# Executar testes E2E
TEST_ARGS="$@"
if [ -z "$TEST_ARGS" ]; then
    TEST_ARGS="--project=chromium-auth"
fi

log "Comando: npx playwright test $TEST_ARGS"

# Executar os testes
if npx playwright test $TEST_ARGS; then
    success "Testes E2E executados com sucesso! 🎉"
else
    error "Alguns testes E2E falharam"

    warning "Para debug adicional:"
    echo "  - Screenshots: test-results/"
    echo "  - Relatório: npm run test:e2e:report"
    echo "  - Logs do backend: cd backend && docker compose logs"
fi

# Pergunta se deve manter o backend rodando
echo ""
read -p "Manter backend rodando para desenvolvimento? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    success "Backend mantido rodando em http://localhost:3000"
    warning "Para parar: cd backend && docker compose down"
else
    log "🛑 Parando backend..."
    cd backend
    docker compose down
    cd ..
    success "Backend parado"
fi