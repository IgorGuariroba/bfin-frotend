#!/bin/bash

# Script para verificar configuração do CI/CD
# Execute: bash scripts/check-cicd-setup.sh

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║         🔍 VERIFICAÇÃO DE SETUP CI/CD                          ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para verificar
check() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✅${NC} $2"
  else
    echo -e "${RED}❌${NC} $2"
  fi
}

# Verificar se está no diretório correto
echo "📁 Verificando diretório..."
if [ -f "package.json" ]; then
  check 0 "Diretório correto (package.json encontrado)"
else
  check 1 "ERRO: Execute este script na raiz do projeto"
  exit 1
fi

echo ""
echo "📦 Verificando arquivos do CI/CD..."

# Verificar workflows
if [ -f ".github/workflows/ci.yml" ]; then
  check 0 "Workflow CI existe (.github/workflows/ci.yml)"
else
  check 1 "Workflow CI não encontrado"
fi

if [ -f ".github/workflows/deploy.yml" ]; then
  check 0 "Workflow Deploy existe (.github/workflows/deploy.yml)"
else
  check 1 "Workflow Deploy não encontrado"
fi

# Verificar documentação
echo ""
echo "📚 Verificando documentação..."

if [ -f "CI-CD.md" ]; then
  check 0 "CI-CD.md existe"
else
  check 1 "CI-CD.md não encontrado"
fi

if [ -f ".github/SECRETS.md" ]; then
  check 0 ".github/SECRETS.md existe"
else
  check 1 ".github/SECRETS.md não encontrado"
fi

# Verificar scripts no package.json
echo ""
echo "📝 Verificando scripts no package.json..."

if grep -q '"type-check"' package.json; then
  check 0 "Script 'type-check' configurado"
else
  check 1 "Script 'type-check' não encontrado"
fi

if grep -q '"test"' package.json; then
  check 0 "Script 'test' configurado"
else
  check 1 "Script 'test' não encontrado"
fi

if grep -q '"lint"' package.json; then
  check 0 "Script 'lint' configurado"
else
  check 1 "Script 'lint' não encontrado"
fi

# Verificar Git
echo ""
echo "🔀 Verificando Git..."

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo -e "  Branch atual: ${YELLOW}${CURRENT_BRANCH}${NC}"

if [ "$CURRENT_BRANCH" = "main" ]; then
  echo -e "  ${RED}⚠️  ATENÇÃO: Você está na branch main!${NC}"
  echo -e "  ${YELLOW}Crie uma branch de feature antes de fazer alterações${NC}"
fi

# Verificar se há mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
  echo -e "  ${YELLOW}⚠️  Há mudanças não commitadas${NC}"
else
  check 0 "Não há mudanças pendentes"
fi

# Verificar Node e NPM
echo ""
echo "🟢 Verificando ambiente..."

NODE_VERSION=$(node --version 2>/dev/null)
if [ $? -eq 0 ]; then
  check 0 "Node.js instalado: $NODE_VERSION"
else
  check 1 "Node.js não encontrado"
fi

NPM_VERSION=$(npm --version 2>/dev/null)
if [ $? -eq 0 ]; then
  check 0 "npm instalado: $NPM_VERSION"
else
  check 1 "npm não encontrado"
fi

# Verificar .env
echo ""
echo "🔐 Verificando variáveis de ambiente..."

if [ -f ".env" ]; then
  check 0 "Arquivo .env existe"

  if grep -q "NPM_TOKEN=" .env; then
    if grep -q "NPM_TOKEN=.*[^=]" .env; then
      check 0 "NPM_TOKEN configurado no .env"
    else
      check 1 "NPM_TOKEN vazio no .env"
    fi
  else
    check 1 "NPM_TOKEN não encontrado no .env"
  fi

  if grep -q "VITE_API_BASE_URL=" .env; then
    check 0 "VITE_API_BASE_URL configurado no .env"
  else
    check 1 "VITE_API_BASE_URL não encontrado no .env"
  fi
else
  echo -e "  ${YELLOW}⚠️  Arquivo .env não encontrado (opcional para local)${NC}"
fi

# Resumo
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo ""
echo "1. Configure os secrets no GitHub:"
echo "   https://github.com/IgorGuariroba/bfin-frotend/settings/secrets/actions"
echo ""
echo "   Secrets necessários:"
echo "   • NPM_TOKEN (obrigatório)"
echo "   • VITE_API_BASE_URL (obrigatório)"
echo "   • RENDER_DEPLOY_HOOK_URL (opcional)"
echo ""
echo "2. Crie o Pull Request:"
echo "   https://github.com/IgorGuariroba/bfin-frotend/pull/new/feature/setup-cicd"
echo ""
echo "3. Monitore o CI:"
echo "   https://github.com/IgorGuariroba/bfin-frotend/actions"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""
