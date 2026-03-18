import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  IconButton,
  Flex,
  Skeleton,
  Center,
} from '@chakra-ui/react';
import { ArrowLeft, X, LucideIcon } from 'lucide-react';
import { Button } from '../atoms/Button';

export interface BaseFormAction {
  label: string;
  onClick: () => void;
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  colorPalette?: 'orange' | 'gray' | 'green' | 'blue' | 'red';
  loading?: boolean;
  disabled?: boolean;
}

export interface BaseFormProps {
  // Header
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;

  // Value display (comum em formulários financeiros)
  displayValue?: {
    value?: string;
    label?: string;
    editable?: boolean;
    onEdit?: () => void;
    inputContent?: React.ReactNode;
  };

  // Navigation
  onBack?: () => void;
  onCancel?: () => void;
  showBackButton?: boolean;
  backButtonVariant?: 'arrow' | 'x'; // arrow para formulários com header verde, x para brancos

  // Content
  children?: React.ReactNode;

  // Actions
  actions?: BaseFormAction[];
  primaryAction?: BaseFormAction;

  // States
  isLoading?: boolean;
  error?: string | null;

  // Layout variants
  variant?: 'green-header' | 'white-container' | 'fullscreen';

  // Customization
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
  contentPb?: number | string | Record<string, number | string>;
  className?: string;

  // Form specific
  formId?: string;
  onSubmit?: (e: React.FormEvent) => void;
}

export const BaseForm: React.FC<BaseFormProps> = ({
  title,
  subtitle,
  icon: Icon,
  displayValue,
  onBack,
  onCancel,
  showBackButton = true,
  backButtonVariant = 'arrow',
  children,
  actions = [],
  primaryAction,
  isLoading = false,
  error,
  variant = 'green-header',
  headerContent,
  footerContent,
  contentPb,
  className,
  formId,
  onSubmit,
}) => {
  const handleBackClick = onBack || onCancel;

  // Loading state
  if (isLoading) {
    return (
      <VStack gap={0} align="stretch" minH="100vh" className={className}>
        <Box
          bg={variant === 'green-header' ? 'var(--primary)' : 'var(--card)'}
          px={{ base: 4, md: 6 }}
          py={{ base: 4, md: 6 }}
          pb={{ base: 6, md: 8 }}
        >
          <VStack gap={4} align="stretch">
            <HStack>
              <Skeleton width="24px" height="24px" borderRadius="md" />
              <Skeleton height="24px" flex="1" />
            </HStack>
            {displayValue && (
              <Skeleton height="60px" borderRadius="md" />
            )}
          </VStack>
        </Box>

        <Box flex="1" px={{ base: 4, md: 6 }} py={6}>
          <VStack gap={4} align="stretch">
            <Skeleton height="48px" borderRadius="md" />
            <Skeleton height="48px" borderRadius="md" />
            <Skeleton height="48px" borderRadius="md" />
          </VStack>
        </Box>
      </VStack>
    );
  }

  // Error state
  if (error) {
    return (
      <VStack gap={0} align="stretch" minH="100vh" className={className}>
        <Box
          bg={variant === 'green-header' ? 'var(--primary)' : 'var(--card)'}
          px={{ base: 4, md: 6 }}
          py={{ base: 4, md: 6 }}
          pb={{ base: 6, md: 8 }}
        >
          {showBackButton && handleBackClick && (
            <IconButton
              aria-label="Voltar"
              variant="ghost"
              onClick={handleBackClick}
              size="sm"
              color={variant === 'green-header' ? 'var(--primary-foreground)' : 'var(--card-foreground)'}
              mb={4}
              _hover={{
                bg: variant === 'green-header' ? 'whiteAlpha.100' : 'var(--muted)',
              }}
            >
              {backButtonVariant === 'arrow' ? <ArrowLeft size={20} /> : <X size={20} />}
            </IconButton>
          )}

          {title && (
            <Heading
              size={{ base: 'md', md: 'lg' }}
              color={variant === 'green-header' ? 'var(--primary-foreground)' : 'var(--card-foreground)'}
              mb={2}
            >
              {title}
            </Heading>
          )}
        </Box>

        <Center flex="1" px={{ base: 4, md: 6 }}>
          <VStack gap={4} align="center">
            <Text color="var(--destructive)" fontSize="sm" textAlign="center">
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
        </Center>
      </VStack>
    );
  }

  // Green header variant (common for financial forms)
  if (variant === 'green-header') {
    return (
      <VStack gap={0} align="stretch" minH="100vh" className={className}>
        {/* Header Verde */}
        <Box
          bg="var(--primary)"
          px={{ base: 4, md: 6 }}
          py={{ base: 4, md: 6 }}
          pb={{ base: 6, md: 8 }}
        >
          {/* Navigation + Title */}
          {(showBackButton || title || Icon) && (
            <Flex align="center" gap={4} mb={displayValue ? 6 : 0}>
              {showBackButton && handleBackClick && (
                <IconButton
                  aria-label="Voltar"
                  variant="ghost"
                  onClick={handleBackClick}
                  size="sm"
                  color="var(--primary-foreground)"
                  _hover={{ bg: 'whiteAlpha.100' }}
                >
                  <ArrowLeft size={20} />
                </IconButton>
              )}

              <HStack flex="1" gap={3}>
                {Icon && <Icon size={20} color="var(--primary-foreground)" />}
                {title && (
                  <VStack align="flex-start" gap={0}>
                    <Heading
                      size={{ base: 'md', md: 'lg' }}
                      color="var(--primary-foreground)"
                    >
                      {title}
                    </Heading>
                    {subtitle && (
                      <Text
                        fontSize="sm"
                        color="var(--primary-foreground)"
                        opacity={0.88}
                      >
                        {subtitle}
                      </Text>
                    )}
                  </VStack>
                )}
              </HStack>

              {headerContent}
            </Flex>
          )}

          {/* Display Value */}
          {displayValue && (
            <Box mb={6}>
              {displayValue.label && (
                <Text
                  fontSize="sm"
                  color="var(--primary-foreground)"
                  opacity={0.88}
                  mb={2}
                  textAlign="center"
                >
                  {displayValue.label}
                </Text>
              )}
              {displayValue.inputContent ? (
                displayValue.inputContent
              ) : (
                <Text
                  fontSize="4xl"
                  fontWeight="bold"
                  color="var(--primary-foreground)"
                  textAlign="center"
                  cursor={displayValue.editable ? 'pointer' : 'default'}
                  onClick={displayValue.editable ? displayValue.onEdit : undefined}
                  _hover={displayValue.editable ? { opacity: 0.8 } : {}}
                >
                  {displayValue.value}
                </Text>
              )}
            </Box>
          )}
        </Box>

        {/* Form Content */}
        <Box flex="1" pb={contentPb ?? 8}>
          {formId || onSubmit ? (
            <form id={formId} onSubmit={onSubmit}>
              {children}
            </form>
          ) : (
            children
          )}
        </Box>

        {/* Footer Actions */}
        {(actions.length > 0 || primaryAction || footerContent) && (
          <Box
            position="fixed"
            bottom={0}
            left={0}
            right={0}
            bg="var(--card)"
            borderTopWidth="1px"
            borderColor="var(--border)"
            p={{ base: 4, md: 6 }}
            zIndex={10}
          >
            <Flex
              maxW={{ base: '100%', md: '2xl' }}
              mx="auto"
              gap={3}
              justify="space-between"
              align="center"
            >
              {footerContent}

              <HStack gap={2} ml="auto">
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    size={action.size || 'md'}
                    variant={action.variant || 'outline'}
                    colorPalette={action.colorPalette || 'gray'}
                    onClick={action.onClick}
                    loading={action.loading}
                    disabled={action.disabled}
                  >
                    {action.label}
                  </Button>
                ))}

                {primaryAction && (
                  <Button
                    size={primaryAction.size || 'md'}
                    variant={primaryAction.variant || 'solid'}
                    colorPalette={primaryAction.colorPalette || 'orange'}
                    onClick={primaryAction.onClick}
                    loading={primaryAction.loading}
                    disabled={primaryAction.disabled}
                    type={formId ? 'submit' : 'button'}
                  >
                    {primaryAction.label}
                  </Button>
                )}
              </HStack>
            </Flex>
          </Box>
        )}
      </VStack>
    );
  }

  // White container variant (for simpler forms)
  if (variant === 'white-container') {
    return (
      <Box p={{ base: 4, md: 8 }} maxW={{ base: '100%', md: '2xl' }} mx="auto" pb={{ base: '180px', md: '140px' }} className={className}>
        {/* Header */}
        {(showBackButton || title) && (
          <Flex align="center" gap={4} mb={6}>
            {showBackButton && handleBackClick && (
              <IconButton
                aria-label="Fechar"
                variant="ghost"
                onClick={handleBackClick}
                size="sm"
                color="var(--card-foreground)"
              >
                <X size={20} />
              </IconButton>
            )}
            {title && (
              <Heading size="lg" color="var(--card-foreground)">
                {title}
              </Heading>
            )}
            {headerContent}
          </Flex>
        )}

        {/* Content Container */}
        <Box
          bg="var(--card)"
          borderRadius="xl"
          p={{ base: 4, md: 6 }}
          shadow="md"
        >
          {formId || onSubmit ? (
            <form id={formId} onSubmit={onSubmit}>
              {children}
            </form>
          ) : (
            children
          )}

          {/* Inline Actions */}
          {(actions.length > 0 || primaryAction) && (
            <HStack gap={2} justify="flex-end" mt={6}>
              {actions.map((action, index) => (
                <Button
                  key={index}
                  size={action.size || 'md'}
                  variant={action.variant || 'outline'}
                  colorPalette={action.colorPalette || 'gray'}
                  onClick={action.onClick}
                  loading={action.loading}
                  disabled={action.disabled}
                >
                  {action.label}
                </Button>
              ))}

              {primaryAction && (
                <Button
                  size={primaryAction.size || 'md'}
                  variant={primaryAction.variant || 'solid'}
                  colorPalette={primaryAction.colorPalette || 'orange'}
                  onClick={primaryAction.onClick}
                  loading={primaryAction.loading}
                  disabled={primaryAction.disabled}
                  type={formId ? 'submit' : 'button'}
                >
                  {primaryAction.label}
                </Button>
              )}
            </HStack>
          )}
        </Box>

        {footerContent}
      </Box>
    );
  }

  // Fullscreen variant (for special cases like extrato)
  return (
    <VStack gap={0} align="stretch" minH="100vh" className={className}>
      {formId || onSubmit ? (
        <form id={formId} onSubmit={onSubmit} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {children}
        </form>
      ) : (
        children
      )}

      {footerContent}
    </VStack>
  );
};