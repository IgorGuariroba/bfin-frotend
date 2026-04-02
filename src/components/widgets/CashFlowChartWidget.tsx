import { useCallback, useMemo, useState } from 'react';
import { Box, Text, HStack, IconButton } from '@chakra-ui/react';
import { Chart, useChart } from '@chakra-ui/charts';
import { Bar, BarChart, CartesianGrid, Rectangle, Tooltip, XAxis, YAxis } from 'recharts';
import { TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { BaseWidget } from './BaseWidget';
import { useAccounts } from '../../hooks/useAccounts';
import { useTransactions } from '../../hooks/useTransactions';

interface CashFlowChartWidgetProps {
  onViewDetails?: () => void;
}

function getMonthRange(offset: number) {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const start = new Date(target.getFullYear(), target.getMonth(), 1);
  const end = new Date(target.getFullYear(), target.getMonth() + 1, 0, 23, 59, 59);
  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
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

const formatCompact = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
  }).format(value);

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
      (t) => t.type === 'fixed' || t.type === 'variable'
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

    // Ordenar por valor decrescente e atribuir cores
    const sorted = [...byCategory.values()]
      .sort((a, b) => b.total - a.total)
      .map((item, i) => ({
        category: item.name,
        amount: Number(item.total.toFixed(2)),
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
            <Chart.Root height="220px" chart={chart}>
              <BarChart
                layout="vertical"
                data={chart.data}
                margin={{ left: 10, right: 10 }}
                responsive
              >
                <CartesianGrid stroke={chart.color('border.muted')} horizontal={false} />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  fontSize={10}
                  tickFormatter={(value: number) => formatCompact(value)}
                />
                <YAxis
                  type="category"
                  dataKey={chart.key('category')}
                  axisLine={false}
                  tickLine={false}
                  fontSize={11}
                  width={100}
                  tickFormatter={(value: string) =>
                    value.length > 12 ? value.slice(0, 12) + '…' : value
                  }
                />
                <Tooltip
                  cursor={{ fill: chart.color('bg.muted') }}
                  animationDuration={100}
                  content={<Chart.Tooltip />}
                />
                <Bar
                  isAnimationActive={false}
                  dataKey={chart.key('amount')}
                  radius={4}
                  barSize={20}
                  shape={(props: unknown) => {
                    const barProps = props as Record<string, unknown> & { payload: { color: string } };
                    return (
                      <Rectangle {...barProps} fill={chart.color(barProps.payload.color)} />
                    );
                  }}
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
