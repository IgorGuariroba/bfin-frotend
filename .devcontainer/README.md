# 🐳 BFIN Frontend Dev Container

Ambiente de desenvolvimento padronizado usando VS Code Dev Containers.

## 🎯 O que está incluído

### 🔧 Base
- **Node.js 20** - Versão LTS requerida pelo projeto
- **npm** - Gerenciador de pacotes
- **Git** - Controle de versão
- **GitHub CLI** - Integração com GitHub
- **Docker-in-Docker** - Para builds e testes

### 🎨 VS Code Extensions
- **TypeScript/JavaScript**: IntelliSense avançado
- **React**: Sintaxe e autocomplete para JSX/TSX
- **ESLint/Prettier**: Formatação e linting automáticos
- **Vitest/Playwright**: Integração de testes
- **Storybook**: Documentação de componentes
- **GitLens**: Git integrado ao VS Code

### ⚙️ Configurações
- **Portas expostas**: 5173 (Vite), 6006 (Storybook), 3000 (API)
- **Formatação automática**: Prettier + ESLint on save
- **TypeScript**: Configurações otimizadas
- **Performance**: Node modules em volume Docker

## 🚀 Como usar

### 1. Pré-requisitos
- **VS Code** com extensão [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- **Docker Desktop** rodando

### 2. Abrir no Dev Container

#### Opção A: Command Palette
1. `Ctrl+Shift+P` (ou `Cmd+Shift+P` no Mac)
2. Digite: `Dev Containers: Reopen in Container`
3. Aguarde o build e setup automático

#### Opção B: Notification
1. Abra o projeto no VS Code
2. Clique em "Reopen in Container" na notificação
3. Aguarde o setup

#### Opção C: Terminal
```bash
# No diretório do projeto
code .
# Depois use Ctrl+Shift+P > Reopen in Container
```

### 3. Configurar NPM Token

#### Via VS Code (Recomendado)
1. No VS Code, vá para: Command Palette (`Ctrl+Shift+P`)
2. Digite: `Dev Containers: Configure Container Features`
3. Configure o secret `NPM_TOKEN` com seu GitHub token

#### Via arquivo local
1. Crie `.env` na raiz do projeto:
```bash
NPM_TOKEN=seu_github_token_aqui
```

### 4. Primeiro uso
O container executará automaticamente:
- ✅ Instalação das dependências
- ✅ Configuração do GitHub Packages
- ✅ Setup do Playwright
- ✅ Geração de tipos do tema
- ✅ Configurações do Git

## 📦 Scripts disponíveis

O setup cria aliases úteis:

```bash
dev         # npm run dev (Vite + Storybook)
build       # npm run build
test        # npm test
lint        # npm run lint
storybook   # npm run storybook
theme-gen   # npm run theme:typegen
```

## 🌐 URLs após iniciar

- **Aplicação**: http://localhost:5173
- **Storybook**: http://localhost:6006
- **API Local**: http://localhost:3000 (se configurada)

## 🔧 Customização

### Adicionar extensões
Edite `.devcontainer/devcontainer.json`:

```json
"extensions": [
  "seu.novo.extensao"
]
```

### Configurar portas
```json
"forwardPorts": [5173, 6006, 8080]
```

### Adicionar features
```json
"features": {
  "ghcr.io/devcontainers/features/python:1": {}
}
```

## 🐛 Troubleshooting

### Container não inicia
1. Verifique se Docker Desktop está rodando
2. Limpe containers antigos: `docker system prune`
3. Rebuild: `Ctrl+Shift+P` > `Dev Containers: Rebuild Container`

### NPM Token não funciona
1. Verifique se o token tem permissão `read:packages`
2. Configure via VS Code secrets
3. Ou adicione ao `.env` local

### Performance lenta
1. Verifique recursos do Docker Desktop
2. Use WSL 2 no Windows
3. Feche outros containers

### Extensões não funcionam
1. Rebuild container
2. Verifique se as extensões estão na lista
3. Instale manualmente se necessário

## 📁 Estrutura do Dev Container

```
.devcontainer/
├── devcontainer.json     # Configuração principal
├── setup.sh              # Script de configuração automática
└── README.md             # Esta documentação
```

## 🔒 Segurança

- **NPM Token**: Nunca commite tokens no código
- **Secrets**: Use VS Code secrets ou `.env` (gitignored)
- **Volumes**: Node modules em volume isolado

## ⚡ Performance

### Otimizações incluídas
- **Volume para node_modules**: Evita sync lento
- **Cache do npm**: Reutilizado entre rebuilds
- **Memory limit**: 4GB alocados
- **File watchers**: Configurados para projetos grandes

## 📚 Links úteis

- [Dev Containers Documentation](https://code.visualstudio.com/docs/devcontainers/containers)
- [Node.js Dev Container](https://github.com/devcontainers/images/tree/main/src/typescript-node)
- [VS Code Remote Development](https://code.visualstudio.com/docs/remote/remote-overview)

---

💡 **Dica**: Após o primeiro setup, os próximos usos serão muito mais rápidos graças ao cache do Docker!

🎉 **Aproveite o desenvolvimento padronizado e sem problemas de "funciona na minha máquina"!**