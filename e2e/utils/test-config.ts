/**
 * Configurações compartilhadas para testes E2E
 */

export const TEST_CONFIG = {
  // URLs
  BASE_URL: 'http://localhost:5173',
  LOGIN_URL: '/login',
  REGISTER_URL: '/register',
  DASHBOARD_URL: '/dashboard',

  // Timeouts
  DEFAULT_TIMEOUT: 30000,
  FORM_SUBMISSION_TIMEOUT: 15000,
  API_RESPONSE_TIMEOUT: 10000,

  // Usuário de teste
  TEST_USER: {
    email: 'teste@bfin.com.br',
    password: 'senha123',
    nome: 'Usuário Teste'
  },

  // Dados de teste para formulários
  TEST_DATA: {
    // Conta
    account: {
      nome: 'Conta Teste',
      saldo: '1000.00',
      descricao: 'Conta criada para testes'
    },

    // Categoria
    category: {
      nome: 'Categoria Teste',
      descricao: 'Categoria criada para testes'
    },

    // Receita
    income: {
      descricao: 'Salário Teste',
      valor: '5000.00',
      categoria: 'Salário'
    },

    // Despesa
    expense: {
      descricao: 'Mercado Teste',
      valor: '250.00',
      categoria: 'Alimentação'
    },

    // Transferência
    transfer: {
      descricao: 'Transferência Teste',
      valor: '500.00'
    },

    // Empréstimo
    loan: {
      descricao: 'Empréstimo Teste',
      valor: '10000.00',
      taxa: '1.5',
      parcelas: '12'
    }
  },

  // Seletores comuns
  SELECTORS: {
    // Elementos gerais
    submitButton: '[data-testid="submit-button"]',
    cancelButton: '[data-testid="cancel-button"]',
    loadingSpinner: '[data-testid="loading-spinner"]',
    errorMessage: '[data-testid="error-message"]',
    successMessage: '[data-testid="success-message"]',

    // Dashboard
    sidebar: '[data-testid="sidebar"]',
    menuItem: (item: string) => `[data-testid="menu-${item}"]`,
    expandedForm: '[data-testid="expanded-form"]',

    // Formulários
    formField: (field: string) => `[data-testid="field-${field}"]`,
    selectOption: (value: string) => `[data-value="${value}"]`,

    // Modais
    modal: '[data-testid="modal"]',
    modalClose: '[data-testid="modal-close"]',

    // Tabelas
    table: '[data-testid="table"]',
    tableRow: '[data-testid="table-row"]',
    tableCell: (row: number, col: number) => `[data-testid="table-cell-${row}-${col}"]`
  }
} as const;

/**
 * Mensagens de erro esperadas nos testes
 */
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Campo obrigatório',
  INVALID_EMAIL: 'Email inválido',
  INVALID_VALUE: 'Valor inválido',
  NETWORK_ERROR: 'Erro de conexão',
  UNAUTHORIZED: 'Acesso negado'
} as const;

/**
 * Mensagens de sucesso esperadas nos testes
 */
export const SUCCESS_MESSAGES = {
  ACCOUNT_CREATED: 'Conta criada com sucesso',
  TRANSACTION_CREATED: 'Transação criada com sucesso',
  CATEGORY_CREATED: 'Categoria criada com sucesso',
  DATA_SAVED: 'Dados salvos com sucesso'
} as const;