import React from 'react';
import { VStack, Grid } from '@chakra-ui/react';
import { BfincontaWidget } from './BfincontaWidget';
import { CashFlowChartWidget } from './CashFlowChartWidget';
import { CalendarWidget } from './CalendarWidget';
import { DailyLimitWidget } from './DailyLimitWidget';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface WidgetConfig {
  id: string;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
  priority: 'primary' | 'secondary' | 'tertiary';
  type: 'financial' | 'informational' | 'action' | 'analytics';
  enabled: boolean;
  order: number;
  minWidth?: string;
  maxWidth?: string;
}

import type { ExpandedFormType } from '../organisms';

interface WidgetManagerProps {
  onExpandForm: (form: ExpandedFormType) => void;
  layout?: 'auto' | 'single-column' | 'two-column';
  maxWidgetsPerColumn?: number;
}

export const WidgetManager: React.FC<WidgetManagerProps> = ({
  onExpandForm,
  layout = 'auto',
  maxWidgetsPerColumn = 3
}) => {
  // Configuração centralizada dos widgets
  const widgetConfigs: WidgetConfig[] = [
    {
      id: 'bfinconta',
      component: BfincontaWidget,
      props: {
        onAccessClick: () => onExpandForm('extrato')
      },
      priority: 'primary',
      type: 'financial',
      enabled: true,
      order: 1,
    },
    {
      id: 'cashflow-chart',
      component: CashFlowChartWidget,
      props: {
        onViewDetails: () => onExpandForm('hist-finan')
      },
      priority: 'secondary',
      type: 'analytics',
      enabled: true,
      order: 2,
    },
    {
      id: 'daily-limit',
      component: DailyLimitWidget,
      props: {
        onAdjustLimitClick: () => onExpandForm('ajustar-limite')
      },
      priority: 'primary',
      type: 'financial',
      enabled: true,
      order: 3,
    },
    {
      id: 'calendar',
      component: CalendarWidget,
      props: {
        onViewFullCalendar: () => onExpandForm('calendario')
      },
      priority: 'secondary',
      type: 'informational',
      enabled: true,
      order: 4,
    },
    // Espaço para novos widgets:
    // {
    //   id: 'transactions',
    //   component: TransactionsWidget,
    //   props: {
    //     onViewAll: () => onExpandForm('transacoes')
    //   },
    //   priority: 'secondary',
    //   type: 'informational',
    //   enabled: true,
    //   order: 3,
    // },
    // {
    //   id: 'goals',
    //   component: GoalsWidget,
    //   props: {
    //     onManageGoals: () => onExpandForm('metas')
    //   },
    //   priority: 'tertiary',
    //   type: 'analytics',
    //   enabled: true,
    //   order: 4,
    // }
  ];

  // Filtrar widgets ativos e ordenar
  const activeWidgets = widgetConfigs
    .filter(widget => widget.enabled)
    .sort((a, b) => a.order - b.order);

  // Sistema de balanceamento automático
  const distributeWidgets = () => {
    if (layout === 'single-column') {
      return {
        leftColumn: activeWidgets,
        rightColumn: []
      };
    }

    if (layout === 'two-column') {
      // Distribui alternadamente
      const leftColumn: WidgetConfig[] = [];
      const rightColumn: WidgetConfig[] = [];

      activeWidgets.forEach((widget, index) => {
        if (index % 2 === 0) {
          leftColumn.push(widget);
        } else {
          rightColumn.push(widget);
        }
      });

      return { leftColumn, rightColumn };
    }

    // Layout automático (padrão)
    const primaryWidgets = activeWidgets.filter(w => w.priority === 'primary');
    const secondaryWidgets = activeWidgets.filter(w => w.priority === 'secondary');
    const tertiaryWidgets = activeWidgets.filter(w => w.priority === 'tertiary');

    // Distribuição inteligente
    const leftColumn: WidgetConfig[] = [...primaryWidgets];
    const rightColumn: WidgetConfig[] = [...secondaryWidgets];

    // Se a coluna esquerda tem menos widgets, adiciona alguns secundários
    if (leftColumn.length < maxWidgetsPerColumn && secondaryWidgets.length > rightColumn.length) {
      const extraSecondary = secondaryWidgets.slice(0, maxWidgetsPerColumn - leftColumn.length);
      leftColumn.push(...extraSecondary);
      rightColumn.splice(0, extraSecondary.length);
    }

    // Distribui terciários balanceadamente
    tertiaryWidgets.forEach((widget) => {
      if (leftColumn.length <= rightColumn.length) {
        leftColumn.push(widget);
      } else {
        rightColumn.push(widget);
      }
    });

    return { leftColumn, rightColumn };
  };

  const { leftColumn, rightColumn } = distributeWidgets();

  // Renderizar widget
  const renderWidget = (config: WidgetConfig) => {
    const Component = config.component;
    return (
      <Component
        key={config.id}
        {...config.props}
      />
    );
  };

  // Layout responsivo
  if (layout === 'single-column') {
    return (
      <VStack gap={6} align="stretch">
        {activeWidgets.map(renderWidget)}
      </VStack>
    );
  }

  // Layout mobile: uma coluna com espaçamento reduzido
  return (
    <>
      {/* Mobile: Single Column Layout */}
      <VStack
        gap={3}
        align="stretch"
        p={{ base: 4, md: 8 }}
        pb={{ base: '180px', md: '140px' }}
        flex="1"
        display={{ base: 'flex', lg: 'none' }}
      >
        {activeWidgets.map(renderWidget)}
      </VStack>

      {/* Desktop: Two Column Layout */}
      <Grid
        templateColumns="440px 1fr"
        gap={6}
        p={8}
        pb="140px"
        flex="1"
        display={{ base: 'none', lg: 'grid' }}
      >
        {/* Left Column */}
        <VStack gap={4} align="stretch">
          {leftColumn.map(renderWidget)}
          {leftColumn.length === 0 && (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: 'var(--muted-foreground)',
              fontSize: '0.875rem'
            }}>
              {/* Coluna principal vazia */}
            </div>
          )}
        </VStack>

        {/* Right Column */}
        <VStack gap={6} align="stretch">
          {rightColumn.map(renderWidget)}
          {rightColumn.length === 0 && (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: 'var(--muted-foreground)',
              fontSize: '0.875rem'
            }}>
              {/* Área de widgets informativos */}
            </div>
          )}
        </VStack>
      </Grid>
    </>
  );
};

