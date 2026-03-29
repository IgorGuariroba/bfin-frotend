# BFIN Frontend - Plano Completo de Testes E2E

## Visão Geral

Aplicação React/TypeScript de gestão financeira pessoal com arquitetura Dashboard-First. Todas as funcionalidades são implementadas como formulários dentro do Dashboard principal.

**Stack Tecnológica:**
- React 18.2 + TypeScript 5.3 + Vite 7.3
- Chakra UI v3.30 (sintaxe V3)
- React Query 5.17 (server state)
- React Hook Form + Zod (validação)
- API privada: @igorguariroba/bfin-sdk

**Credenciais de Teste:**
- Usuário: usertest
- Email: usertest@gmail.com
- Senha: 123456

---

## Suites de Teste

### 1. AUTENTICAÇÃO E GESTÃO DE USUÁRIOS

**Prioridade:** CRÍTICA
**Seed File:** `e2e/auth/setup-seed.spec.ts`

#### 1.1 Fluxo de Registro de Usuário
**Arquivo:** `e2e/auth/user-registration.spec.ts`

**Cenário:** Usuário cria nova conta no sistema
1. **Ação:** Navegar para página de registro
   - **Esperado:** Formulário de registro exibido com campos obrigatórios (nome, email, senha, confirmar senha)

2. **Ação:** Preencher formulário com dados válidos (nome: 'usertest', email: 'usertest@gmail.com', senha: '123456')
   - **Esperado:** Formulário aceita entrada sem erros, indicador de força da senha apropriado

3. **Ação:** Submeter formulário de registro
   - **Esperado:** Registro bem-sucedido, redirecionamento para dashboard, mensagem de boas-vindas

4. **Ação:** Verificar persistência da sessão após recarregar página
   - **Esperado:** Usuário permanece autenticado, dashboard carrega corretamente

#### 1.2 Fluxo de Login de Usuário
**Arquivo:** `e2e/auth/user-login.spec.ts`

**Cenário:** Autenticação com credenciais existentes
1. **Ação:** Navegar para página de login
   - **Esperado:** Formulário de login exibido com campos email e senha

2. **Ação:** Tentar login com credenciais inválidas
   - **Esperado:** Mensagem de erro exibida, usuário não autenticado, permanece na página de login

3. **Ação:** Login com credenciais válidas (usertest@gmail.com / 123456)
   - **Esperado:** Login bem-sucedido, redirecionamento para dashboard, sessão estabelecida

4. **Ação:** Verificar carregamento do dashboard com dados do usuário
   - **Esperado:** Cabeçalho do dashboard mostra info do usuário, sidebar disponível, widgets exibidos

#### 1.3 Logout e Gestão de Sessão
**Arquivo:** `e2e/auth/logout-session.spec.ts`

**Cenário:** Encerramento seguro de sessão
1. **Ação:** Login com credenciais válidas
   - **Esperado:** Autenticado com sucesso no dashboard

2. **Ação:** Clicar no botão logout no cabeçalho do dashboard
   - **Esperado:** Usuário deslogado, redirecionado para login, sessão limpa

3. **Ação:** Tentar acessar URL do dashboard diretamente após logout
   - **Esperado:** Redirecionado para página de login, autenticação obrigatória

### 2. FUNCIONALIDADES CENTRAIS DO DASHBOARD

**Prioridade:** CRÍTICA
**Seed File:** `e2e/dashboard/dashboard-setup.spec.ts`

#### 2.1 Layout e Navegação do Dashboard
**Arquivo:** `e2e/dashboard/dashboard-layout.spec.ts`

**Cenário:** Interface principal e navegação
1. **Ação:** Carregar dashboard após autenticação
   - **Esperado:** Cabeçalho visível, navegação lateral disponível, área principal exibida, ações no rodapé

2. **Ação:** Testar funcionalidade de navegação da sidebar
   - **Esperado:** Sidebar expande/recolhe no toggle, itens do menu são clicáveis, estado de navegação persiste

3. **Ação:** Verificar layout responsivo em diferentes tamanhos de tela
   - **Esperado:** Visualização mobile mostra sidebar recolhida, desktop mostra expandida, ações do rodapé adaptam ao tamanho

#### 2.2 Sistema de Widgets e Exibição de Dados
**Arquivo:** `e2e/dashboard/widgets.spec.ts`

**Cenário:** Funcionalidade dos widgets financeiros
1. **Ação:** Carregar dashboard e verificar layout dos widgets
   - **Esperado:** BfincontaWidget, MonthlySummaryWidget, RecentTransactionsWidget, CalendarWidget visíveis

2. **Ação:** Testar interações e ações de clique dos widgets
   - **Esperado:** Widgets respondem a cliques, formulários apropriados abrem, dados atualizam dinamicamente

3. **Ação:** Verificar comportamento responsivo dos widgets
   - **Esperado:** Layout de coluna única no mobile, duas colunas no desktop, widgets empilham apropriadamente

### 3. FORMULÁRIOS DE TRANSAÇÕES FINANCEIRAS

**Prioridade:** CRÍTICA
**Seed File:** `e2e/forms/transaction-setup.spec.ts`

#### 3.1 Registro de Receitas (Depositar)
**Arquivo:** `e2e/forms/income-form.spec.ts`

**Cenário:** Cadastro de entradas de dinheiro
1. **Ação:** Abrir formulário Depositar nas ações do rodapé
   - **Esperado:** Formulário de receita exibido, campos obrigatórios visíveis (descrição, valor), seletor de conta disponível

2. **Ação:** Preencher formulário com dados válidos (descrição: 'Salário Março', valor: '5000.00')
   - **Esperado:** Formulário aceita entrada, valor monetário formata corretamente, sem erros de validação

3. **Ação:** Submeter transação de receita
   - **Esperado:** Transação criada com sucesso, formulário fecha, dashboard atualiza com novo saldo, transação aparece nas recentes

4. **Ação:** Testar validação de entrada (campos vazios, valores inválidos)
   - **Esperado:** Validação de campo obrigatório funciona, valor monetário inválido rejeitado, mensagens de erro claras

#### 3.2 Registro de Despesas (Pagar)
**Arquivo:** `e2e/forms/expense-form.spec.ts`

**Cenário:** Cadastro de gastos e despesas
1. **Ação:** Abrir formulário Pagar nas ações do rodapé
   - **Esperado:** Formulário de despesa exibido, seletor de tipo de despesa disponível, opções de categoria presentes

2. **Ação:** Criar despesa fixa (descrição: 'Aluguel Mensal', valor: '1800.00', tipo: 'fixa')
   - **Esperado:** Despesa fixa criada, opções de agendamento recorrente disponíveis, transação salva com tipo correto

3. **Ação:** Criar despesa variável (descrição: 'Mercado', valor: '350.00', tipo: 'variável')
   - **Esperado:** Despesa variável criada, atribuição de categoria funciona, transação única registrada

#### 3.3 Operações de Transferência
**Arquivo:** `e2e/forms/transfer-form.spec.ts`

**Cenário:** Movimentação entre contas
1. **Ação:** Abrir formulário Transferir nas ações do rodapé
   - **Esperado:** Formulário de transferência exibido, seletor de conta origem, seletor de conta destino, campo valor

2. **Ação:** Executar transferência entre contas (Reserva de Emergência para Corrente: $1000)
   - **Esperado:** Formulário valida seleção de conta, valor validado contra saldo origem, descrição obrigatória

3. **Ação:** Submeter transação de transferência
   - **Esperado:** Transferência executada com sucesso, saldo da conta origem diminuído, saldo destino aumentado, registro criado

#### 3.4 Gestão de Empréstimos
**Arquivo:** `e2e/forms/loan-form.spec.ts`

**Cenário:** Registro e controle de empréstimos
1. **Ação:** Abrir formulário Empréstimos nas ações do rodapé
   - **Esperado:** Formulário de empréstimo exibido, campos para valor, taxa, parcelas

2. **Ação:** Criar empréstimo (descrição: 'Financiamento Carro', valor: '50000.00', taxa: '2.5%', parcelas: '48')
   - **Esperado:** Empréstimo registrado, cálculo de parcelas automático, cronograma de pagamento gerado

3. **Ação:** Verificar impacto no fluxo de caixa
   - **Esperado:** Parcelas refletem no histórico financeiro, projeção de gastos atualizada

### 4. GESTÃO DE CONTAS E CATEGORIAS

**Prioridade:** ALTA
**Seed File:** `e2e/account-category/setup.spec.ts`

#### 4.1 Criação e Gestão de Contas
**Arquivo:** `e2e/account-category/account-management.spec.ts`

**Cenário:** Gerenciamento de contas bancárias e cartões
1. **Ação:** Acessar criação de conta através dos dialogs do dashboard
   - **Esperado:** Dialog de criação de conta abre, campos do formulário disponíveis, seleção de tipo de conta presente

2. **Ação:** Criar múltiplas contas (Corrente: $2000, Poupança: $10000, Investimento: $5000)
   - **Esperado:** Múltiplas contas criadas com sucesso, cada conta tem identificador único, saldos iniciais definidos corretamente

3. **Ação:** Testar edição e atualização de contas
   - **Esperado:** Detalhes da conta podem ser modificados, ajustes de saldo rastreados, nomes e descrições atualizáveis

#### 4.2 Sistema de Categorias e Organização
**Arquivo:** `e2e/account-category/category-management.spec.ts`

**Cenário:** Criação e gestão de categorias financeiras
1. **Ação:** Acessar funcionalidade de gestão de categorias
   - **Esperado:** Interface de criação de categoria disponível, categorias padrão pré-carregadas, hierarquia visível

2. **Ação:** Criar categorias personalizadas (Transporte, Entretenimento, Renda Freelance)
   - **Esperado:** Categorias personalizadas criadas, tipos de categoria apropriadamente atribuídos, disponíveis nos formulários

### 5. RELATÓRIOS E ANÁLISES FINANCEIRAS

**Prioridade:** ALTA
**Seed File:** `e2e/reports/reports-setup.spec.ts`

#### 5.1 Histórico de Transações e Extratos
**Arquivo:** `e2e/reports/transaction-history.spec.ts`

**Cenário:** Visualização e análise de movimentações
1. **Ação:** Abrir formulário Extrato do dashboard
   - **Esperado:** Histórico de transações exibido, todas as transações recentes visíveis, detalhes completos

2. **Ação:** Testar filtragem e busca de transações
   - **Esperado:** Filtro por conta funciona, filtro por categoria funcional, filtragem por período precisa, busca por descrição funciona

3. **Ação:** Verificar paginação e ordenação de transações
   - **Esperado:** Listas grandes paginadas, ordenação por data/valor/categoria funciona, performance aceitável

#### 5.2 Resumo Financeiro Mensal
**Arquivo:** `e2e/reports/monthly-summary.spec.ts`

**Cenário:** Análise financeira por período
1. **Ação:** Acessar resumo mensal através de widgets ou formulários
   - **Esperado:** Resumo do mês atual exibido, receitas/despesas/saldo líquido visíveis, comparação com mês anterior disponível

2. **Ação:** Navegar entre diferentes meses
   - **Esperado:** Navegação entre meses suave, dados atualizados para mês selecionado, dados históricos precisos

3. **Ação:** Verificar cálculos do resumo
   - **Esperado:** Total de receitas calculado corretamente, total de despesas preciso, saldo líquido correto, detalhamentos por categoria corretos

#### 5.3 Histórico Financeiro Detalhado
**Arquivo:** `e2e/reports/financial-history.spec.ts`

**Cenário:** Análise histórica com projeções
1. **Ação:** Abrir formulário Histórico Financeiro (HistFinan)
   - **Esperado:** Interface de histórico exibida, navegação mensal disponível, saldos diários visíveis

2. **Ação:** Navegar entre diferentes meses e anos
   - **Esperado:** Dados históricos carregados corretamente, projeções futuras visíveis, integração com dívidas flutuantes

3. **Ação:** Verificar precisão dos cálculos históricos
   - **Esperado:** Saldos diários precisos, projeções baseadas em despesas fixas, impacto de empréstimos calculado

### 6. RECURSOS AVANÇADOS E CASOS LIMITE

**Prioridade:** MÉDIA
**Seed File:** `e2e/advanced/setup.spec.ts`

#### 6.1 Limites de Gastos Diários
**Arquivo:** `e2e/advanced/daily-limits.spec.ts`

**Cenário:** Controle de gastos por categoria
1. **Ação:** Configurar limite diário de gastos ($200 para categoria Alimentação)
   - **Esperado:** Configuração de limite salva, limite aplicado à categoria selecionada, limites de aviso configuráveis

2. **Ação:** Criar despesa dentro do limite ($50 almoço)
   - **Esperado:** Despesa processada normalmente, limite restante atualizado, sem avisos exibidos

3. **Ação:** Tentar despesa que excede limite diário ($180 jantar)
   - **Esperado:** Mensagem de aviso exibida, despesa ainda pode ser processada com confirmação, notificação de limite excedido

#### 6.2 Integração de Calendário e Agendamento
**Arquivo:** `e2e/advanced/calendar-integration.spec.ts`

**Cenário:** Visualização temporal de transações
1. **Ação:** Abrir visualização de Calendário do dashboard
   - **Esperado:** Interface de calendário exibida, mês atual mostrado, controles de navegação disponíveis

2. **Ação:** Navegar por diferentes meses e anos
   - **Esperado:** Navegação do calendário suave, dados de transação carregam para períodos selecionados, performance aceitável

3. **Ação:** Visualizar detalhes diários clicando em datas
   - **Esperado:** Visualização de detalhes diários abre, todas as transações da data selecionada visíveis, informações de saldo precisas

### 7. DESIGN RESPONSIVO E ACESSIBILIDADE

**Prioridade:** MÉDIA
**Seed File:** `e2e/responsive/setup.spec.ts`

#### 7.1 Compatibilidade com Dispositivos Móveis
**Arquivo:** `e2e/responsive/mobile-compatibility.spec.ts`

**Cenário:** Funcionalidade em smartphones
1. **Ação:** Carregar aplicação em viewport mobile (390x844)
   - **Esperado:** Aplicação carrega corretamente, layout específico para mobile ativado, alvos de toque apropriadamente dimensionados

2. **Ação:** Testar navegação e interação com formulários no mobile
   - **Esperado:** Navegação da sidebar funciona no mobile, formulários são usáveis com toque, integração de teclado funcional

3. **Ação:** Verificar adaptações específicas para mobile
   - **Esperado:** Layout de coluna única para widgets, alvos de toque maiores, padrões de navegação simplificados

#### 7.2 Acessibilidade e Conformidade WCAG
**Arquivo:** `e2e/responsive/accessibility.spec.ts`

**Cenário:** Usabilidade para todos os usuários
1. **Ação:** Testar navegação por teclado em toda aplicação
   - **Esperado:** Todos elementos interativos acessíveis via teclado, ordem de tabulação lógica e intuitiva, indicadores de foco visíveis

2. **Ação:** Verificar compatibilidade com leitores de tela
   - **Esperado:** Todo conteúdo legível por leitores de tela, rótulos de formulário apropriadamente associados, atributos ARIA implementados corretamente

3. **Ação:** Testar contraste de cores e acessibilidade visual
   - **Esperado:** Proporções de contraste de cores suficientes, informações não transmitidas apenas por cor, texto legível em zoom de 200%

### 8. PERFORMANCE E TRATAMENTO DE ERROS

**Prioridade:** MÉDIA
**Seed File:** `e2e/performance/setup.spec.ts`

#### 8.1 Performance e Carregamento da Aplicação
**Arquivo:** `e2e/performance/loading-performance.spec.ts`

**Cenário:** Otimização de velocidade e experiência
1. **Ação:** Medir tempo de carregamento inicial da aplicação
   - **Esperado:** Aplicação carrega em menos de 3 segundos, caminho crítico de renderização otimizado, carregamento progressivo de recursos não críticos

2. **Ação:** Testar carregamento do dashboard com dados existentes
   - **Esperado:** Dashboard renderiza rapidamente com dados, carregamento de widgets escalonado apropriadamente, usuário pode interagir antes de todos os dados carregarem

#### 8.2 Tratamento de Erros de Rede e Resiliência
**Arquivo:** `e2e/performance/error-handling.spec.ts`

**Cenário:** Comportamento em condições adversas
1. **Ação:** Simular perda de conectividade durante transação
   - **Esperado:** Tratamento gracioso de erros, dados da transação preservados, mecanismo de retry disponível, usuário notificado do status da conexão

2. **Ação:** Testar respostas de erro da API (500, 503, timeout)
   - **Esperado:** Erros da API tratados graciosamente, mensagens de erro amigáveis, retry automático para erros transitórios, opção de retry manual disponível

#### 8.3 Validação de Dados e Segurança
**Arquivo:** `e2e/performance/data-security.spec.ts`

**Cenário:** Integridade e segurança dos dados
1. **Ação:** Testar validação de entrada em todos os formulários
   - **Esperado:** Validação client-side imediata, validação server-side aplicada, entrada maliciosa rejeitada, tentativas XSS bloqueadas

2. **Ação:** Verificar autenticação e autorização
   - **Esperado:** Usuários não autenticados bloqueados, tokens de sessão seguros, operações sensíveis requerem confirmação, permissões de usuário aplicadas

3. **Ação:** Validar precisão de cálculos financeiros
   - **Esperado:** Cálculos monetários precisos, regras de arredondamento consistentes, sem erros de ponto flutuante no manuseio de dinheiro, cálculos de saldo sempre precisos

---

## Estratégia de Execução

### Priorização dos Testes

1. **CRÍTICA** - Autenticação, Dashboard Core, Transações Financeiras
2. **ALTA** - Gestão de Contas/Categorias, Relatórios
3. **MÉDIA** - Recursos Avançados, Responsividade, Performance

### Ambientes de Teste

- **Local**: `http://localhost:5173`
- **Browsers**: Chrome, Firefox, Safari
- **Dispositivos**: Desktop, Tablet, Mobile

### Critérios de Aprovação

- ✅ 100% dos testes CRÍTICOS passando
- ✅ 95% dos testes ALTA passando
- ✅ 85% dos testes MÉDIA passando
- ✅ Performance < 3s carregamento inicial
- ✅ Compatibilidade com assistive technologies

---

## Mapeamento de Formulários Dashboard-First

### Ações do Rodapé (FooterActions)
- `depositar` → IncomeForm (Registro de receitas)
- `pagar` → ExpenseForm (Registro de despesas fixas e variáveis)
- `transferir` → TransferForm (Transferências entre contas)
- `emprestimos` → LoanForm (Gestão de empréstimos)

### Navegação da Sidebar (Menu)
- `calendar` → CalendarWidget
- `help` → HelpDialog
- `profile` → ProfileForm
- `configure-account` → AccountForm
- `configure-card` → CardForm
- `business-account` → BusinessAccountForm
- `notifications` → NotificationCenter

### Widgets Interativos
- `BfincontaWidget` → Saldo geral e ações rápidas
- `MonthlySummaryWidget` → Resumo mensal detalhado
- `RecentTransactionsWidget` → Extrato de transações
- `CalendarWidget` → Visualização temporal

---

**Este plano de teste oferece cobertura abrangente para validar a funcionalidade completa, performance, acessibilidade e confiabilidade da aplicação BFIN Frontend.**

---

## Credenciais e Configuração

**Usuário de Teste Padrão:**
- Nome: usertest
- Email: usertest@gmail.com
- Senha: 123456

**URLs de Teste:**
- Base: http://localhost:5173
- Login: /login
- Registro: /register
- Dashboard: /dashboard

**Configuração do Playwright:**
- Timeouts: 30s padrão, 15s formulários, 10s API
- Browsers: Chromium, Firefox, Safari
- Mobile: Pixel 5, iPhone 12
- Reports: HTML com screenshots e traces