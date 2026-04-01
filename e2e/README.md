# Testes E2E - Playwright

Este diretório contém os testes end-to-end (E2E) da aplicação usando Playwright.

## Estrutura de Arquivos

```
e2e/
├── auth/                    # Testes de autenticação
│   ├── login.spec.ts        # Testes de login (abordagem direta)
│   └── login-pom.spec.ts    # Testes de login (Page Object Model)
├── fixtures/                # Fixtures reutilizáveis
│   └── auth.fixture.ts      # Fixtures de autenticação
├── pages/                   # Page Objects
│   └── login.page.ts        # Page Object da página de login
├── setup/                   # Setup global
│   └── auth.setup.ts        # Setup de autenticação compartilhada
└── .auth/                   # Estado de autenticação (ignorado no git)
    └── user.json            # Storage state salvo
```

## Comandos Disponíveis

### Testes E2E Básicos (apenas frontend)

```bash
# Executar todos os testes
npm run test:e2e

# Executar com interface gráfica
npm run test:e2e:ui

# Executar em modo debug
npm run test:e2e:debug

# Executar apenas testes de login
npm run test:e2e:login

# Executar apenas testes de forms
npm run test:e2e:forms

# Executar testes mobile
npm run test:e2e:mobile

# Executar smoke tests (fluxo crítico)
npm run test:e2e:smoke

# Ver relatório HTML
npm run test:e2e:report

# Type check dos testes
npm run test:e2e:type-check

# Lint dos testes
npm run test:e2e:lint
```

### Testes E2E com Backend (recomendado)

⚠️ **IMPORTANTE**: Para testes que dependem de API (login, formulários), use os comandos com backend:

```bash
# Executar testes E2E com backend Docker
npm run test:e2e:backend

# Executar apenas testes de login com backend
npm run test:e2e:backend:auth

# Executar smoke tests com backend
npm run test:e2e:backend:smoke
```

**O que os comandos `test:e2e:backend` fazem:**

1. 📥 Clona o repositório do backend (se necessário)
2. 🐳 Inicia o backend com Docker Compose
3. ⏳ Aguarda o backend ficar disponível
4. 🧪 Executa os testes E2E
5. 🛑 Pergunta se deve manter o backend rodando

**Requisitos:**
- Docker instalado e rodando
- Acesso ao repositório: `https://github.com/IgorGuariroba/bfin-backend.git`

## Configuração de Variáveis de Ambiente

Copie `.env.test` para `.env.test.local` e ajuste as credenciais:

```bash
cp .env.test .env.test.local
```

Edite `.env.test.local`:

```env
TEST_USER_EMAIL=seu-email@bfin.com.br
TEST_USER_PASSWORD=sua-senha
```

## Seletores Robustos - Antifrágeis

Os testes usam **seletores baseados em comportamento** (o que o usuário vê), nunca implementação:

| Elemento | Seletor Antifrágil | Por que é Robusto |
|----------|-------------------|-------------------|
| Formulário | `getByRole('form', { name: /formulário de login/i })` | Papel ARIA + nome acessível |
| Campo email | `getByRole('textbox', { name: /email/i })` | Papel ARIA + label/placeholder |
| Campo senha | `getByLabel(/senha/i)` | Label associado (acessibilidade) |
| Botão entrar | `getByRole('button', { name: /^entrar$/i })` | Papel ARIA + texto exato |
| Mensagem de erro | `getByRole('alert').first()` | Role alert padrão de erro |
| Erro de campo | `getByText('Campo obrigatório')` | Texto de validação visível |
| Link de registro | `getByRole('button', { name: /registrar.*conta/i })` | Papel + regex flexível |
| Trocar usuário | `getByText('TROCAR DE USUÁRIO')` | Texto exato do link |

### Por que evitar `data-testid`, className, id?

- **Acoplamento de implementação**: Quebra quando o componente muda visualmente sem mudar comportamento
- **Não testa acessibilidade**: Usuários com leitores de tela dependem de roles/labels
- **Falsa segurança**: Seletores "estáveis" podem mascarar problemas de UX

### Estratégia de seletores (prioridade absoluta)

1. **`getByRole()`** - Papel ARIA (button, textbox, alert) + nome acessível
2. **`getByLabel()`** - Label associado (melhor para acessibilidade)
3. **`getByText()`** - Texto visível exato que o usuário vê
4. **`getByPlaceholder()`** - Placeholder quando não há label (não ideal)
5. `getByTestId()` - **Último recurso absoluto** (apenas elementos sem semântica)

**Princípio**: Se um usuário com deficiência visual consegue usar, o teste consegue selecionar.

Ver [Playwright Locators - Best Practices](https://playwright.dev/docs/locators#best-practices)

## Melhores Práticas Utilizadas

### 1. Page Object Model (POM)
- Encapsula seletores e ações em classes reutilizáveis
- Facilita manutenção quando o UI muda
- Ver `e2e/pages/login.page.ts`

### 2. Fixtures
- Reutiliza lógica de setup/teardown
- Fornece contexto de autenticação para testes
- Ver `e2e/fixtures/auth.fixture.ts`

### 3. Setup Global de Autenticação
- Autentica uma vez e reusa o estado em múltiplos testes
- Economiza tempo de execução
- Ver `e2e/setup/auth.setup.ts`

### 4. Seletores Antifrágeis
- Prioriza `getByRole()` e `getByLabel()` para acessibilidade
- Evita `data-testid`, className e seletores CSS frágeis
- Resistente a mudanças visuais, quebra apenas quando comportamento muda

### 5. Assertions Esperadas
- Usa `expect()` do Playwright
- Aguarda automaticamente por condições
- Mensagens de erro claras

### 6. Isolamento de Testes
- Cada teste é independente
- `beforeEach` para setup comum
- Estado limpo entre testes

## Exemplo de Teste

### Abordagem Direta (com seletores comportamentais)

```typescript
import { test, expect } from '@playwright/test';

test('deve fazer login com sucesso', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('Email').fill('teste@bfin.com.br');
  await page.getByLabel('Senha').fill('senha123');
  await page.getByRole('button', { name: /entrar|acessar/i }).click();

  await expect(page).toHaveURL('/dashboard');
});
```

### Com Page Object Model

```typescript
import { test } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test('deve fazer login com sucesso', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginWithDefaultCredentials();
  await loginPage.assertLoginSuccess();
});
```

## Debugging

### Modo Debug
```bash
npm run test:e2e:debug
```

### Headed (com interface)
```bash
npm run test:e2e:headed
```

### Trace Viewer
Após uma falha, visualize o trace:
```bash
npx playwright show-trace test-results/<teste-falhou>/trace.zip
```

### Screenshots e Vídeos
- Screenshots: salvos apenas em falhas (`screenshot: 'only-on-failure'`)
- Vídeos: gravados apenas em falhas (`video: 'retain-on-failure'`)
- Trace: coletado no primeiro retry (`trace: 'on-first-retry'`)

## Configuração de Projetos

O `playwright.config.ts` define:

- **setup**: Projeto que executa o setup de autenticação
- **chromium-auth**: Testes de autenticação (login, registro) sem auth prévia
- **chromium/firefox/webkit**: Testes que requerem autenticação
- **Mobile Chrome/Safari**: Testes em dispositivos móveis

## CI/CD

No CI, os testes são executados com:
- Browser em modo headless
- Retry automático (2 tentativas)
- Single worker para consistência
- Upload de artifacts (traces, screenshots, vídeos)

## Links Úteis

- [Documentação do Playwright](https://playwright.dev)
- [Test Runner](https://playwright.dev/docs/test-intro)
- [Auth Testing](https://playwright.dev/docs/auth)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright Test](https://playwright.dev/docs/test-annotations)
