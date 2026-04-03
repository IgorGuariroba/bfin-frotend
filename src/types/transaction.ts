export type TransactionType = 'income' | 'fixed' | 'variable' | 'fixed_expense' | 'variable_expense';
export type TransactionStatus = 'pending' | 'executed' | 'cancelled' | 'locked';
export type RecurrencePattern = 'monthly' | 'weekly' | 'yearly';

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color?: string;
  icon?: string;
}

export interface Account {
  id: string;
  account_name: string;
  account_type: string;
  total_balance: number;
  available_balance: number;
  locked_balance: number;
  emergency_reserve: number;
  currency: string;
  is_default: boolean;
  user_role?: 'owner' | 'member';
  is_shared?: boolean;
}

export interface AccountMember {
  id: string;
  account_id: string;
  user_id: string;
  role: 'owner' | 'member' | 'viewer';
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    email: string;
    full_name: string;
  };
}

export interface Transaction {
  id: string;
  account_id: string;
  category_id: string;
  type: TransactionType;
  amount: number;
  description: string;
  due_date?: string;
  executed_date?: string;
  status: TransactionStatus;
  is_recurring: boolean;
  recurrence_pattern?: RecurrencePattern;
  recurrence_end_date?: string;
  tags: string[];
  attachment_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  category?: Category;
  account?: Account;
}

/**
 * DTO para criar despesa (fixa ou variável)
 * Nova estrutura unificada para POST /api/v1/transactions/expense
 */
export interface CreateExpenseDTO {
  accountId: string;
  amount: number;
  description: string;
  categoryId: string;
  type: 'fixed' | 'variable';
  dueDate?: string; // Obrigatório para type='fixed', não usado para type='variable'
  isRecurring?: boolean; // Para despesas recorrentes
  recurrencePattern?: RecurrencePattern; // monthly, weekly, yearly
  recurrenceInterval?: number; // Repetir a cada X unidades (ex: 3 = trimestral)
  indefinite?: boolean; // true = sem data fim
  recurrenceCount?: number; // Quantidade de recorrências (ex: 5 meses)
  recurrenceEndDate?: string; // Data fim da recorrência (alternativa ao recurrenceCount)
}

/**
 * DTO para criar receita
 */
export interface CreateIncomeDTO {
  accountId: string;
  amount: number;
  description: string;
  categoryId: string;
  dueDate?: string;
  isRecurring?: boolean;
  recurrencePattern?: RecurrencePattern;
}

/**
 * @deprecated Use CreateExpenseDTO com type='fixed'
 */
export interface CreateFixedExpenseDTO {
  accountId: string;
  amount: number;
  description: string;
  categoryId: string;
  dueDate: string;
  createdAt: string;
  isRecurring?: boolean;
  recurrencePattern?: RecurrencePattern;
}

/**
 * @deprecated Use CreateExpenseDTO com type='variable'
 */
export interface CreateVariableExpenseDTO {
  accountId: string;
  amount: number;
  description: string;
  categoryId: string;
  createdAt: string;
}

/**
 * DTO unificado para criar transação (receita ou despesa)
 */
export type CreateTransactionDTO = CreateIncomeDTO | CreateExpenseDTO;

export interface TransactionBreakdown {
  total_received: number;
  emergency_reserve: number;
  available: number;
}

export interface AccountBalances {
  total_balance: number;
  available_balance: number;
  locked_balance: number;
  emergency_reserve?: number;
}

export interface CreateTransactionResponse {
  transaction: Transaction;
  breakdown?: TransactionBreakdown;
  account_balances: AccountBalances;
}

export interface ListTransactionsParams {
  accountId?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  };
}

/**
 * DTO para criar transferência
 * POST /api/v1/transactions/transfer
 */
export interface CreateTransferDTO {
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
  description?: string;
}

/**
 * Resposta da transferência
 */
export interface TransferResponse {
  transfer: {
    id: string;
    amount: number;
    description: string;
    sourceAccount: {
      id: string;
      account_name: string;
    };
    destinationAccount: {
      id: string;
      account_name: string;
    };
    createdAt: string;
  };
  debitTransaction: Transaction;
  creditTransaction: Transaction;
}
