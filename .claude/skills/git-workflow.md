# Git Workflow - BFIN Frontend

## ⚠️ Regra Absoluta

**NUNCA faça push direto na branch `main`!**

---

## 🔄 Workflow Padrão

### 1. Preparação
```bash
# Sempre comece atualizando a main
git checkout main
git pull origin main

# Crie nova branch A PARTIR da main atualizada
git checkout -b feature/minha-feature
```

### 2. Desenvolvimento
```bash
# Faça suas alterações
# ... código ...

# Adicione os arquivos
git add .

# Commit com mensagem descritiva
git commit -m "feat: adiciona nova funcionalidade"
```

### 3. Validação Local (OBRIGATÓRIO)
```bash
# Execute TODAS as validações antes de push
npm run type-check     # ✅ TypeScript
npm run lint           # ✅ ESLint
npm test -- --run      # ✅ Testes
npm run build          # ✅ Build
npm audit              # ✅ Segurança
```

### 4. Push da Branch
```bash
# Push da SUA BRANCH (não da main!)
git push origin feature/minha-feature
```

### 5. Pull Request
```bash
# Abra PR no GitHub
# https://github.com/IgorGuariroba/bfin-frontend/pulls

# Aguarde CI passar ✅
# Aguarde aprovação
# Merge via GitHub (não local!)
```

---

## 📋 Tipos de Branches

```bash
main                     # Produção (protegida)
develop                  # Desenvolvimento (se houver)
feature/nome-feature     # Novas funcionalidades
fix/nome-bug            # Correções de bugs
chore/nome-tarefa       # Manutenção
docs/nome-doc           # Documentação
```

---

## 🎯 Exemplos Práticos

### Adicionando Nova Feature
```bash
# Situação: Adicionar validação de email

# 1. Preparar
git checkout main
git pull origin main
git checkout -b feature/email-validation

# 2. Desenvolver
# ... código ...

# 3. Validar localmente
npm run type-check && npm run lint && npm test -- --run && npm run build

# 4. Commit
git add .
git commit -m "feat: adiciona validação de email no formulário de login"

# 5. Push
git push origin feature/email-validation

# 6. PR via GitHub
```

### Correção de Bug
```bash
git checkout main
git pull origin main
git checkout -b fix/button-hover

# ... correção ...

git add .
git commit -m "fix: corrige estilo de hover no botão primário"
git push origin fix/button-hover
```

### Atualização de Documentação
```bash
git checkout main
git pull origin main
git checkout -b docs/update-readme

# ... atualização ...

git add .
git commit -m "docs: atualiza instruções de instalação"
git push origin docs/update-readme
```

---

## ❌ Erros Comuns (NUNCA faça)

```bash
# ❌ ERRADO - Push direto na main
git checkout main
git add .
git commit -m "mudanças"
git push origin main

# ❌ ERRADO - Criar branch sem atualizar main
git checkout -b feature/nova-feature
# (sem fazer git pull da main antes)

# ❌ ERRADO - Merge local sem PR
git checkout main
git merge feature/minha-feature
git push origin main

# ❌ ERRADO - Push sem validação
git push origin feature/minha-feature
# (sem executar type-check, lint, test, build)
```

---

## ✅ Boas Práticas

```bash
# ✅ CORRETO - Sempre atualizar main primeiro
git checkout main
git pull origin main
git checkout -b feature/nova-feature

# ✅ CORRETO - Validar antes de push
npm run type-check && npm run lint && npm test -- --run && npm run build
git push origin feature/nova-feature

# ✅ CORRETO - PR via GitHub
# Criar PR → Aguardar CI → Aguardar aprovação → Merge via GitHub
```

---

## 🔍 Comandos Úteis

### Status e Informações
```bash
git status                    # Status atual
git branch                    # Listar branches
git branch -r                 # Branches remotas
git log --oneline -5          # Últimos 5 commits
```

### Limpeza
```bash
git branch -d feature/done    # Deletar branch local (após merge)
git remote prune origin       # Limpar branches remotas deletadas
```

### Sincronização
```bash
git fetch origin             # Buscar atualizações sem merge
git pull origin main         # Atualizar main local
```

---

## 🚨 Troubleshooting

### Conflitos de Merge
```bash
# Se sua branch estiver desatualizada
git checkout feature/minha-branch
git fetch origin
git rebase origin/main
# Resolver conflitos se houver
git push origin feature/minha-branch --force-with-lease
```

### Erro de CI
1. **Não ignore erros do CI**
2. Veja os logs no GitHub Actions
3. Corrija os problemas localmente
4. Faça novo commit e push
5. CI vai executar novamente

### Branch Incorreta
```bash
# Se commitou na branch errada
git log --oneline -3          # Ver últimos commits
git checkout main
git pull origin main
git checkout -b feature/nova-branch-correta
git cherry-pick <commit-hash> # Mover commit específico
```

---

## 📝 Mensagens de Commit

### Padrão Conventional Commits
```bash
feat: adiciona nova funcionalidade
fix: corrige bug no botão
docs: atualiza documentação
chore: atualiza dependências
test: adiciona testes para componente
style: corrige formatação
refactor: reorganiza código
```

### Exemplos Específicos
```bash
feat: implementa formulário de transações
fix: corrige validação de email no login
docs: atualiza guia de instalação do SDK
chore: atualiza Chakra UI para v3.30
test: adiciona testes para TransactionForm
```

---

**Lembre-se: O CI é seu amigo! Se falhar, sempre corrija antes do merge.**