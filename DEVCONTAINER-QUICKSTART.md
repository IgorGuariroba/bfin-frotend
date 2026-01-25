# 🚀 BFIN Frontend - Dev Container Quick Start

## 🎯 O que é um Dev Container?

O Dev Container garante que **todos na equipe tenham exatamente o mesmo ambiente de desenvolvimento**, eliminando problemas de "funciona na minha máquina".

## ⚡ Setup em 3 passos

### 1. **Pré-requisitos (só uma vez)**
- ✅ **VS Code** com [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- ✅ **Docker Desktop** instalado e rodando

### 2. **Configurar NPM Token**
Crie um arquivo `.env` na raiz do projeto:
```bash
NPM_TOKEN=seu_github_personal_access_token_aqui
```

> 💡 **Como obter o token**: GitHub → Settings → Developer settings → Personal access tokens → Generate new token → Marcar `read:packages`

### 3. **Abrir no container**
```bash
# Abra o projeto no VS Code
code .

# Pressione Ctrl+Shift+P e digite:
Dev Containers: Reopen in Container

# Aguarde o setup automático (3-5 minutos na primeira vez)
```

## 🎉 Pronto!

Após o setup você terá:

- ✅ **Node.js 20** configurado
- ✅ **Dependências instaladas** automaticamente
- ✅ **GitHub Packages** configurado
- ✅ **VS Code extensions** otimizadas para React/TypeScript
- ✅ **Portas expostas**: Vite (5173), Storybook (6006)
- ✅ **Aliases úteis**: `dev`, `build`, `test`, `lint`

## 🔧 Comandos úteis

```bash
# Iniciar desenvolvimento (Vite + Storybook)
npm run dev
# ou use o alias:
dev

# Outros aliases disponíveis:
build       # npm run build
test        # npm test
lint        # npm run lint
storybook   # npm run storybook
theme-gen   # npm run theme:typegen
```

## 🌐 URLs após iniciar

- **App**: http://localhost:5173
- **Storybook**: http://localhost:6006

## ❓ Troubleshooting

### Container não inicia
```bash
# Verifique se Docker está rodando
docker ps

# Limpe containers antigos
docker system prune

# Rebuild do zero
Ctrl+Shift+P → "Dev Containers: Rebuild Container"
```

### NPM Token não funciona
1. Verifique se o token tem permissão `read:packages`
2. Confira se está no arquivo `.env` na raiz do projeto
3. Rebuild o container

### Performance lenta
- **Windows**: Use WSL 2
- **Mac/Linux**: Aumente recursos do Docker Desktop
- Feche outros containers desnecessários

## 📚 Documentação completa

Para configurações avançadas: `.devcontainer/README.md`

---

**🎯 O objetivo é você focar no código, não na configuração do ambiente!**

**⏰ Setup inicial**: 3-5 minutos | **Próximos usos**: 30 segundos