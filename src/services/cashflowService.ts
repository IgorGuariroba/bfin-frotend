import { customInstance } from '@igorguariroba/bfin-sdk';
import type {
  MonthlyCashFlowParams,
  MonthlyCashFlowResponse,
} from '../types/cashflow';

export const cashflowService = {
  /**
   * Get monthly cash flow projection day by day
   * GET /api/v1/cash-flow/monthly
   */
  async getMonthlyProjection(params: MonthlyCashFlowParams): Promise<MonthlyCashFlowResponse> {
    return customInstance({
      url: '/api/v1/cash-flow/monthly',
      method: 'GET',
      params,
    });
  },
};