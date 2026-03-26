# 🧪 Testes E2E - BFIN Frontend

Testes End-to-End completos para a aplicação BFIN Frontend usando Playwright.

## 📁 Estrutura dos Testes

```
e2e/
├── auth/                  # Testes de autenticação
│   ├── login.spec.ts      # Login e logout
│   └── register.spec.ts   # Registro de usuários
├── dashboard/             # Testes do dashboard principal
│   ├── dashboard.spec.ts  # Funcionalidades do dashboard
│   └── complete-workflow.spec.ts # Fluxos completos de usuário
├── forms/                 # Testes de formulários
│   ├── create-account.spec.ts    # Formulário de criar conta
│   ├── income.spec.ts            # Formulário de receita
│   └── [outros formulários...]
└── utils/                 # Utilitários e helpers
    ├── test-config.ts     # Configurações centralizadas
    ├── auth-helpers.ts    # Helpers de autenticação
    └── form-helpers.ts    # Helpers de formulários
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js >=20.0.0
- npm >=10.0.0
- Aplicação rodando em `http://localhost:5173`

### Comandos Disponíveis

```bash
# Executar todos os testes E2E
npm run test:e2e

# Executar com interface visual
npm run test:e2e:ui

# Executar em modo debug
npm run test:e2e:debug

# Executar com browser visível
npm run test:e2e:headed

# Ver relatório dos testes
npm run test:e2e:report
```

### Execução por Categoria

```bash
# Apenas testes de autenticação
npx playwright test auth/

# Apenas testes de formulários
npx playwright test forms/

# Apenas testes do dashboard
npx playwright test dashboard/

# Teste específico
npx playwright test auth/login.spec.ts
```

## 🔧 Configuração

### Playwright Config
A configuração principal está em `playwright.config.ts`:

- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Base URL**: `http://localhost:5173`
- **Timeouts**: 30s para ações padrão, 15s para submissões de formulário
- **Screenshots**: Apenas em falhas
- **Videos**: Apenas em falhas
- **Traces**: No primeiro retry

### Variáveis de Ambiente

```bash
# Sobrescrever URL base
PLAYWRIGHT_BASE_URL=http://localhost:3000

# Executar apenas em Chrome
PLAYWRIGHT_BROWSER=chromium

# Modo headless/headed
PLAYWRIGHT_HEADED=true
```

## 📋 Cobertura dos Testes

### ✅ Funcionalidades Testadas

#### Autenticação
- [x] Login com credenciais válidas
- [x] Login com credenciais inválidas
- [x] Validação de campos obrigatórios
- [x] Validação de formato de email
- [x] Logout completo
- [x] Persistência de sessão
- [x] Redirecionamentos automáticos
- [x] Estados de carregamento

#### Registro
- [x] Registro com dados válidos
- [x] Validação de campos obrigatórios
- [x] Validação de formato de email
- [x] Validação de confirmação de senha
- [x] Verificação de email duplicado
- [x] Indicador de força da senha
- [x] Navegação entre páginas

#### Dashboard
- [x] Carregamento correto do dashboard
- [x] Exibição da sidebar com todos os menus
- [x] Abertura e fechamento de formulários
- [x] Exibição de widgets financeiros
- [x] Alternância entre formulários
- [x] Menu do usuário
- [x] Responsividade
- [x] Carregamento de dados
- [x] Navegação por teclado

#### Formulário - Criar Conta
- [x] Criação com dados válidos
- [x] Validação de campos obrigatórios
- [x] Validação de formato de valor
- [x] Aceitação de valores zero/negativos
- [x] Formatação automática de valores
- [x] Validação de tamanho máximo
- [x] Cancelamento de criação
- [x] Estados de carregamento
- [x] Tratamento de erros de rede
- [x] Validação de duplicação

#### Formulário - Receita
- [x] Criação com dados válidos
- [x] Validação de campos obrigatórios
- [x] Validação de formato de valor
- [x] Rejeição de valores zero/negativos
- [x] Formatação automática de valores
- [x] Carregamento de listas (contas/categorias)
- [x] Seleção de data
- [x] Receitas recorrentes
- [x] Validação de data fim
- [x] Adição de observações
- [x] Tratamento de erros

#### Fluxos Completos
- [x] Fluxo básico: login → contas → receitas → despesas → transferências → logout
- [x] Fluxo com empréstimo e limite diário
- [x] Gestão de múltiplas categorias e contas
- [x] Verificação de saldos e relatórios
- [x] Navegação entre diferentes funcionalidades

### 🚧 Próximas Implementações

- [ ] Testes para todos os formulários restantes
- [ ] Testes de performance e carregamento
- [ ] Testes de acessibilidade
- [ ] Testes em diferentes resoluções
- [ ] Testes de API mocking completo
- [ ] Testes de tema claro/escuro
- [ ] Testes de PWA/offline

## 🛠 Utilitários e Helpers

### Test Config (`test-config.ts`)
Configurações centralizadas incluindo:
- URLs da aplicação
- Timeouts padrão
- Dados de teste
- Seletores comuns
- Mensagens esperadas

### Auth Helpers (`auth-helpers.ts`)
Funções para autenticação:
- `login()` - Realizar login
- `logout()` - Realizar logout
- `register()` - Registrar usuário
- `isAuthenticated()` - Verificar autenticação
- `setAuthenticatedState()` - Simular estado autenticado
- `clearAuthState()` - Limpar estado

### Form Helpers (`form-helpers.ts`)
Funções para formulários:
- `openDashboardForm()` - Abrir formulário no dashboard
- `closeDashboardForm()` - Fechar formulário
- `fillField()` - Preencher campo
- `selectOption()` - Selecionar opção
- `submitForm()` - Submeter formulário
- `expectFieldError()` - Verificar erro de validação
- `waitForDataLoad()` - Aguardar carregamento

## 🐛 Troubleshooting

### Testes Falhando
1. Verifique se a aplicação está rodando em `http://localhost:5173`
2. Confirme que todas as dependências estão instaladas
3. Execute `npx playwright install` para baixar browsers

### Performance
1. Execute apenas em Chrome para testes mais rápidos: `npx playwright test --project=chromium`
2. Use mode headless para CI/CD
3. Configure workers conforme capacidade da máquina

### Debug
1. Use `npm run test:e2e:debug` para debug interativo
2. Adicione `await page.pause()` nos testes para pausar execução
3. Use `--headed` para ver o browser durante execução

## 📊 CI/CD

### GitHub Actions
```yaml
- name: Run E2E Tests
  run: |
    npm run build
    npm run test:e2e
  env:
    CI: true
```

### Docker
```dockerfile
# Para executar testes E2E em container
FROM mcr.microsoft.com/playwright:focal
COPY . .
RUN npm ci
RUN npm run test:e2e
```

## 📝 Convenções

### Nomenclatura
- Arquivos: `feature.spec.ts`
- Describes: Funcionalidade testada
- Tests: Descrição clara da ação

### Data TestIds
Use `data-testid` para seletores estáveis:
```html
<button data-testid="submit-button">Enviar</button>
```

### Organização
- Um arquivo por funcionalidade principal
- Helpers em pastas separadas
- Configurações centralizadas
- Dados de teste reutilizáveis