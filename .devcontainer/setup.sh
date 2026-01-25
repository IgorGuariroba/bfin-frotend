#!/bin/bash

# BFIN Frontend - Dev Container Setup Script
# Este script configura automaticamente o ambiente de desenvolvimento

set -e

echo "🔧 Configurando ambiente de desenvolvimento BFIN Frontend..."

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    print_error "package.json não encontrado. Certifique-se de estar no diretório raiz do projeto."
    exit 1
fi

print_status "Verificando Node.js e npm..."
node --version
npm --version

# Configurar npm para GitHub Packages
print_status "Configurando acesso ao GitHub Packages..."

# Verificar se NPM_TOKEN está disponível
if [ -z "$NPM_TOKEN" ]; then
    print_warning "NPM_TOKEN não encontrado. Você precisará configurá-lo para acessar @igorguariroba packages."
    print_warning "Vá para: Configurações > Secrets > Add secret > NPM_TOKEN"
else
    print_status "NPM_TOKEN encontrado, configurando .npmrc..."

    # Executar script de setup do projeto
    if [ -f "scripts/setup-npmrc.js" ]; then
        node scripts/setup-npmrc.js
        print_success "Configuração do .npmrc concluída"
    else
        # Configuração manual caso o script não exista
        echo "@igorguariroba:registry=https://npm.pkg.github.com" > .npmrc
        echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" >> .npmrc
        print_success "Arquivo .npmrc criado manualmente"
    fi
fi

# Instalar dependências
print_status "Instalando dependências do projeto..."
if npm ci; then
    print_success "Dependências instaladas com sucesso"
else
    print_warning "Erro na instalação via npm ci, tentando npm install..."
    npm install
fi

# Verificar se Playwright browsers estão instalados
print_status "Configurando Playwright para testes E2E..."
if command -v npx >/dev/null 2>&1; then
    npx playwright install --with-deps chromium
    print_success "Playwright configurado"
else
    print_warning "npx não encontrado, pulando setup do Playwright"
fi

# Gerar tipos do tema (se possível)
print_status "Gerando tipos do tema Chakra UI..."
if npm run theme:typegen >/dev/null 2>&1; then
    print_success "Tipos do tema gerados"
else
    print_warning "Não foi possível gerar tipos do tema (normal na primeira execução)"
fi

# Verificar configuração do Git
print_status "Configurando Git..."
if [ -z "$(git config --global user.name)" ]; then
    print_warning "Git user.name não configurado."
    print_warning "Configure com: git config --global user.name \"Seu Nome\""
fi

if [ -z "$(git config --global user.email)" ]; then
    print_warning "Git user.email não configurado."
    print_warning "Configure com: git config --global user.email \"seu.email@exemplo.com\""
fi

# Configurar safe.directory para o projeto
git config --global --add safe.directory "$(pwd)"
print_success "Git safe.directory configurado"

# Verificar estrutura do projeto
print_status "Verificando estrutura do projeto..."
required_dirs=("src" "public" "docs" ".storybook")
for dir in "${required_dirs[@]}"; do
    if [ -d "$dir" ]; then
        print_success "Diretório $dir ✓"
    else
        print_warning "Diretório $dir não encontrado"
    fi
done

# Verificar arquivos importantes
required_files=("vite.config.ts" "tsconfig.json" "eslint.config.js")
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "Arquivo $file ✓"
    else
        print_warning "Arquivo $file não encontrado"
    fi
done

# Configurações de desenvolvimento úteis
print_status "Aplicando configurações de desenvolvimento..."

# Aumentar limite de file watchers (comum em containers)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf > /dev/null
sudo sysctl -p > /dev/null
print_success "File watchers configurados"

# Criar aliases úteis
echo "# BFIN Frontend aliases" >> ~/.bashrc
echo "alias dev='npm run dev'" >> ~/.bashrc
echo "alias build='npm run build'" >> ~/.bashrc
echo "alias test='npm test'" >> ~/.bashrc
echo "alias lint='npm run lint'" >> ~/.bashrc
echo "alias storybook='npm run storybook'" >> ~/.bashrc
echo "alias type-check='npm run type-check'" >> ~/.bashrc
echo "alias theme-gen='npm run theme:typegen'" >> ~/.bashrc
print_success "Aliases configurados"

# Mensagem final
echo ""
echo "🎉 Setup concluído com sucesso!"
echo ""
echo "📝 Comandos úteis:"
echo "  dev         - Iniciar servidor de desenvolvimento (Vite + Storybook)"
echo "  build       - Build de produção"
echo "  test        - Executar testes"
echo "  lint        - Executar linter"
echo "  storybook   - Iniciar apenas Storybook"
echo "  theme-gen   - Gerar tipos do tema"
echo ""
echo "🌐 URLs locais:"
echo "  Vite:       http://localhost:5173"
echo "  Storybook:  http://localhost:6006"
echo ""

# Verificar se tudo está funcionando
print_status "Executando verificações finais..."

# Test TypeScript
if npx tsc --noEmit >/dev/null 2>&1; then
    print_success "TypeScript OK"
else
    print_warning "TypeScript check falhou (pode ser normal na primeira execução)"
fi

# Test ESLint
if npm run lint >/dev/null 2>&1; then
    print_success "ESLint OK"
else
    print_warning "ESLint check falhou"
fi

echo ""
print_success "🚀 Ambiente BFIN Frontend está pronto para desenvolvimento!"
echo ""

# Reload bash para aplicar aliases
source ~/.bashrc 2>/dev/null || true