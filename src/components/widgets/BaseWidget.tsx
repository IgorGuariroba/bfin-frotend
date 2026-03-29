import React from 'react';
import { Box, HStack, VStack, Heading, Text, Skeleton } from '@chakra-ui/react';
import { LucideIcon } from 'lucide-react';
import { Button } from '../atoms/Button';

export interface BaseWidgetAction {
  label: string;
  onClick: () => void;
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  colorPalette?: 'brand' | 'gray' | 'green' | 'blue' | 'yellow' | 'red';
  borderColor?: string;
  color?: string;
  _hover?: {
    borderColor?: string;
    color?: string;
  };
}

// Mapeamento de cores do sistema
function getColorPalette(colorPalette: string) {
  const colorMap = {
    // Cores primárias do sistema
    brand: { bg: 'var(--primary)', color: 'var(--primary-foreground)' },
    gray: { bg: 'var(--muted)', color: 'var(--muted-foreground)' },
    green: { bg: 'var(--success)', color: 'var(--success-foreground)' },
    blue: { bg: 'var(--info)', color: 'var(--info-foreground)' },
    yellow: { bg: 'var(--warning)', color: 'var(--warning-foreground)' },
    red: { bg: 'var(--destructive)', color: 'var(--destructive-foreground)' },

    // Aliases semânticos
    success: { bg: 'var(--success)', color: 'var(--success-foreground)' },
    warning: { bg: 'var(--warning)', color: 'var(--warning-foreground)' },
    error: { bg: 'var(--destructive)', color: 'var(--destructive-foreground)' },
    info: { bg: 'var(--info)', color: 'var(--info-foreground)' },
  } as const;

  return colorMap[colorPalette as keyof typeof colorMap] || colorMap.gray;
}

export interface BaseWidgetProps {
  // Header
  icon?: LucideIcon;
  iconColor?: string;
  title: string;
  subtitle?: string;
  badge?: {
    label: string;
    colorPalette: 'brand' | 'gray' | 'green' | 'blue' | 'yellow' | 'red' | 'success' | 'warning' | 'error' | 'info';
  };

  // Content
  children: React.ReactNode;

  // Actions
  actions?: BaseWidgetAction[];
  primaryAction?: BaseWidgetAction;

  // States
  isLoading?: boolean;
  error?: string | null;

  // Layout
  variant?: 'default' | 'compact' | 'full';
  minHeight?: string;

  // Customization
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
  className?: string;
  'data-testid'?: string;
}

export const BaseWidget: React.FC<BaseWidgetProps> = ({
  icon: Icon,
  iconColor = 'var(--muted-foreground)',
  title,
  subtitle,
  badge,
  children,
  actions = [],
  primaryAction,
  isLoading = false,
  error,
  variant = 'default',
  minHeight,
  headerContent,
  footerContent,
  className,
  'data-testid': dataTestId,
}) => {
  // Loading state
  if (isLoading) {
    return (
      <Box
        bg="var(--card)"
        borderRadius="xl"
        p={{ base: 4, md: 6 }}
        shadow="md"
        minHeight={minHeight}
        className={className}
        data-testid={dataTestId}
      >
        <VStack gap={4} align="stretch">
          <HStack>
            <Skeleton width="20px" height="20px" borderRadius="md" />
            <Skeleton height="20px" flex="1" />
          </HStack>
          <Skeleton height="60px" borderRadius="md" />
          <Skeleton height="40px" borderRadius="md" />
        </VStack>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box
        bg="var(--card)"
        borderRadius="xl"
        p={{ base: 4, md: 6 }}
        shadow="md"
        minHeight={minHeight}
        className={className}
        data-testid={dataTestId}
      >
        <VStack gap={4} align="center" justify="center" minH="150px">
          <Text color="var(--destructive)" fontSize="sm">
            {error}
          </Text>
          {primaryAction && (
            <Button
              size="sm"
              variant="outline"
              onClick={primaryAction.onClick}
            >
              Tentar novamente
            </Button>
          )}
        </VStack>
      </Box>
    );
  }

  // Main render
  return (
    <Box
      bg="var(--card)"
      borderRadius="xl"
      p={{ base: 4, md: 6 }}
      shadow="md"
      minHeight={minHeight}
      className={className}
      data-testid={dataTestId}
    >
      <VStack gap={variant === 'compact' ? 3 : 4} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="center">
          <HStack gap={variant === 'compact' ? 2 : 3}>
            {Icon && <Icon size={variant === 'compact' ? 16 : 20} color={iconColor} />}
            <VStack gap={0} align="flex-start">
              <Heading
                size={variant === 'compact' ? 'xs' : 'sm'}
                color="var(--muted-foreground)"
                fontWeight="medium"
              >
                {title}
              </Heading>
              {subtitle && (
                <Text
                  fontSize={variant === 'compact' ? 'xs' : 'sm'}
                  color="var(--muted-foreground)"
                >
                  {subtitle}
                </Text>
              )}
            </VStack>
          </HStack>

          {/* Header extras */}
          {badge && (
            <Box
              bg={getColorPalette(badge.colorPalette).bg}
              color={getColorPalette(badge.colorPalette).color}
              px={2}
              py={1}
              borderRadius="md"
              fontSize="xs"
              fontWeight="medium"
            >
              {badge.label}
            </Box>
          )}

          {headerContent}
        </HStack>

        {/* Content */}
        <Box flex="1">
          {children}
        </Box>

        {/* Actions */}
        {(actions.length > 0 || primaryAction) && (
          <HStack gap={2} justify={variant === 'compact' ? 'center' : 'flex-start'}>
            {/* Secondary actions */}
            {actions.map((action, index) => (
              <Button
                key={index}
                size={action.size || (variant === 'compact' ? 'sm' : 'md')}
                variant={action.variant || 'outline'}
                colorPalette={action.colorPalette || 'gray'}
                borderColor={action.borderColor}
                color={action.color}
                _hover={action._hover}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}

            {/* Primary action */}
            {primaryAction && (
              <Button
                size={primaryAction.size || (variant === 'compact' ? 'sm' : 'md')}
                variant={primaryAction.variant || 'solid'}
                colorPalette={primaryAction.colorPalette || 'brand'}
                onClick={primaryAction.onClick}
              >
                {primaryAction.label}
              </Button>
            )}
          </HStack>
        )}

        {/* Footer content */}
        {footerContent}
      </VStack>
    </Box>
  );
};