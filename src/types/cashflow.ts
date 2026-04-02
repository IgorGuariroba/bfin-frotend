export interface MonthlyCashFlowParams {
  accountId: string;
  year: number;
  month: number;
}

export interface DailyCashFlowTransaction {
  // Estrutura básica da transação - pode ser expandida conforme necessário
  id?: string;
  type: 'income' | 'expense';
  amount: number;
  description?: string;
}

export interface DailyCashFlow {
  date: string; // formato "2026-12-15"
  balance: number; // saldo ao final do dia (negativo = endividado)
  remainingFloatingDebt: number;
  isNegative: boolean;
  dailyIncome: number;
  dailyExpenses: number;
  floatingDebtPayment: number; // valor abatido na dívida flutuante neste dia
  transactions: DailyCashFlowTransaction[];
}

export interface MonthlyCashFlowResponse {
  accountId: string;
  year: number;
  month: number;
  startBalance: number; // saldo no início do mês
  endBalance: number; // saldo no fim do mês
  totalFloatingDebt: number; // total de dívidas sem data de vencimento
  remainingFloatingDebtAtEnd: number; // dívida flutuante restante ao final do mês
  debtFreeDate: string | null; // data em que todas as dívidas flutuantes serão quitadas (null se não ocorrer neste mês)
  isHistorical: boolean; // indica se é dados históricos ou projeção
  days: DailyCashFlow[];
}