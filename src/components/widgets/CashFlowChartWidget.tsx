import { useCallback, useMemo, useState } from 'react';
import { Box, Text, HStack, IconButton } from '@chakra-ui/react';
import { Chart, useChart } from '@chakra-ui/charts';
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis, YAxis } from 'recharts';
import { TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { BaseWidget } from './BaseWidget';
import { useAccounts } from '../../hooks/useAccounts';
import { useTransactions } from '../../hooks/useTransactions';
import { getMonthStart, getMonthEnd } from '../../utils/dateUtils';

interface CashFlowChartWidgetProps {
  onViewDetails?: () => void;
}

function getMonthRange(offset: number) {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  return {
    startDate: getMonthStart(target),
    endDate: getMonthEnd(target),
    label: target.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
  };
}

const CATEGORY_COLORS = [
  'teal.solid', 'purple.solid', 'blue.solid', 'orange.solid',
  'red.solid', 'green.solid', 'yellow.solid', 'pink.solid',
  'cyan.solid',
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);


export const CashFlowChartWidget = ({ onViewDetails }: CashFlowChartWidgetProps) => {
  const [monthOffset, setMonthOffset] = useState(0);
  const goBack = useCallback(() => setMonthOffset((o) => o - 1), []);
  const goForward = useCallback(() => setMonthOffset((o) => o + 1), []);

  const { startDate, endDate, label } = useMemo(() => getMonthRange(monthOffset), [monthOffset]);
  const { data: accounts, isLoading: loadingAccounts } = useAccounts();
  const defaultAccount = accounts?.find((a) => a.is_default) ?? accounts?.[0];

  const { data: txData, isLoading: loadingTx, error } = useTransactions({
    accountId: defaultAccount?.id,
    startDate,
    endDate,
    limit: 100,
  });

  const isLoading = loadingAccounts || loadingTx;

  const { chartData, totalExpenses, totalIncome } = useMemo(() => {
    if (!txData?.transactions) return { chartData: [], totalExpenses: 0, totalIncome: 0 };

    const expenses = txData.transactions.filter(
      (t) => t.type === 'fixed_expense' || t.type === 'variable_expense' || t.type === 'fixed' || t.type === 'variable'
    );

    const income = txData.transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExp = expenses.reduce((sum, t) => sum + Number(t.amount), 0);

    // Agrupar por categoria
    const byCategory = new Map<string, { name: string; total: number }>();
    for (const tx of expenses) {
      const catName = tx.category?.name ?? 'Sem categoria';
      const existing = byCategory.get(catName);
      if (existing) {
        existing.total += Number(tx.amount);
      } else {
        byCategory.set(catName, { name: catName, total: Number(tx.amount) });
      }
    }

    // Ordenar por valor decrescente e atribuir cores com porcentagem
    const sorted = [...byCategory.values()]
      .sort((a, b) => b.total - a.total)
      .map((item, i) => ({
        category: item.name,
        amount: Number(item.total.toFixed(2)),
        percentage: totalExp > 0 ? Number(((item.total / totalExp) * 100).toFixed(1)) : 0,
        color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
      }));

    return { chartData: sorted, totalExpenses: totalExp, totalIncome: income };
  }, [txData]);

  const chart = useChart({
    data: chartData,
    series: [{ name: 'amount', color: 'teal.solid' }],
  });

  return (
    <BaseWidget
      icon={TrendingUp}
      iconColor="var(--info)"
      title="Resumo do Mês"
      subtitle={label}
      isLoading={isLoading}
      error={error ? 'Erro ao carregar resumo mensal' : null}
      headerContent={
        <HStack gap={1}>
          <IconButton
            aria-label="Mês anterior"
            size="xs"
            variant="ghost"
            onClick={goBack}
          >
            <ChevronLeft size={16} />
          </IconButton>
          <IconButton
            aria-label="Próximo mês"
            size="xs"
            variant="ghost"
            onClick={goForward}
            disabled={monthOffset >= 0}
          >
            <ChevronRight size={16} />
          </IconButton>
        </HStack>
      }
      primaryAction={
        onViewDetails
          ? { label: 'Ver detalhes', onClick: onViewDetails, colorPalette: 'brand' }
          : undefined
      }
      data-testid="cashflow-chart-widget"
    >
      {txData && (
        <Box>
          {/* Resumo de totais */}
          <HStack gap={4} mb={4} flexWrap="wrap">
            <Box>
              <Text fontSize="xs" color="var(--muted-foreground)">Receitas</Text>
              <Text fontSize="sm" fontWeight="bold" color="var(--success)">
                {formatCurrency(totalIncome)}
              </Text>
            </Box>
            <Box>
              <Text fontSize="xs" color="var(--muted-foreground)">Despesas</Text>
              <Text fontSize="sm" fontWeight="bold" color="var(--destructive)">
                {formatCurrency(totalExpenses)}
              </Text>
            </Box>
            <Box>
              <Text fontSize="xs" color="var(--muted-foreground)">Saldo</Text>
              <Text
                fontSize="sm"
                fontWeight="bold"
                color={totalIncome - totalExpenses >= 0 ? 'var(--success)' : 'var(--destructive)'}
              >
                {formatCurrency(totalIncome - totalExpenses)}
              </Text>
            </Box>
          </HStack>

          {/* Gráfico de gastos por categoria */}
          {chartData.length > 0 ? (
            <Chart.Root height="280px" chart={chart}>
              <BarChart data={chart.data} responsive margin={{ left: 10, right: 10, top: 10, bottom: 60 }}>
                <CartesianGrid stroke={chart.color('border.muted')} vertical={false} />
                <XAxis
                  axisLine={false}
                  tickLine={false}
                  dataKey={chart.key('category')}
                  fontSize={10}
                  height={30}
                  tickFormatter={(value: string) =>
                    value.length > 10 ? value.slice(0, 10) + '…' : value
                  }
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  fontSize={10}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Bar
                  isAnimationActive={false}
                  dataKey={chart.key('percentage')}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  shape={(props: any) => (
                    <Rectangle {...props} fill={chart.color((props.payload as { color: string }).color)} />
                  )}
                />
              </BarChart>
            </Chart.Root>
          ) : (
            <Text fontSize="sm" color="var(--muted-foreground)" textAlign="center" py={8}>
              Nenhuma despesa registrada neste mês
            </Text>
          )}
        </Box>
      )}
    </BaseWidget>
  );
};
