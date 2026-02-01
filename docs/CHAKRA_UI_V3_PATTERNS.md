# 🎯 Chakra UI v3 Patterns for Loan Simulations

Este documento documenta os padrões corretos do Chakra UI v3 para componentes de simulação de empréstimos, incluindo formulários, modais e tabelas com foco em acessibilidade, responsividade e integração com React Hook Form.

---

## 📋 Índice

1. [Padrões de Formulário](#-padrões-de-formulário)
2. [Padrões de Dialog/Modal](#-padrões-de-dialogmodal)
3. [Padrões de Tabela](#-padrões-de-tabela)
4. [Design Responsivo](#-design-responsivo)
5. [Acessibilidade](#-acessibilidade)
6. [Integração com React Hook Form](#-integração-com-react-hook-form)
7. [Migração v2 → v3](#-migração-v2--v3)

---

## 🔧 Padrões de Formulário

### ✅ Estrutura Básica com Field.Root

```tsx
import { Field, Input, Button, Stack } from '@chakra-ui/react'

<Field.Root invalid={!!error} required={required}>
  <Field.Label>Nome do Campo</Field.Label>
  <Input
    placeholder="Digite aqui..."
    {...register('fieldName')}
  />
  {error && <Field.ErrorText>{error.message}</Field.ErrorText>}
  {helperText && !error && <Field.HelperText>{helperText}</Field.HelperText>}
</Field.Root>
```

### ✅ Formulário de Simulação de Empréstimo

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  VStack,
  Button,
  Stack,
  Field,
  Input,
  NativeSelect
} from '@chakra-ui/react'

const loanSchema = z.object({
  amount: z.number()
    .min(1000, 'Valor mínimo é R$ 1.000')
    .max(500000, 'Valor máximo é R$ 500.000'),
  installments: z.number()
    .min(6, 'Mínimo 6 parcelas')
    .max(120, 'Máximo 120 parcelas'),
  interestRate: z.number()
    .min(0.1, 'Taxa mínima é 0,1%')
    .max(15, 'Taxa máxima é 15%'),
  paymentDay: z.number()
    .min(1)
    .max(28),
})

type LoanFormData = z.infer<typeof loanSchema>

export function LoanSimulationForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<LoanFormData>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      amount: 10000,
      installments: 12,
      interestRate: 2.5,
      paymentDay: 10,
    }
  })

  const onSubmit = async (data: LoanFormData) => {
    // Lógica de simulação
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack gap={6} align="stretch">
        {/* Valor do Empréstimo */}
        <Field.Root invalid={!!errors.amount} required>
          <Field.Label>Valor do Empréstimo (R$)</Field.Label>
          <Input
            type="number"
            step="100"
            placeholder="Ex: 50000"
            {...register('amount', { valueAsNumber: true })}
            bg="var(--card)"
            borderColor="var(--border)"
            borderRadius="lg"
            _focus={{
              borderColor: 'var(--primary)',
              boxShadow: '0 0 0 1px var(--primary)'
            }}
          />
          {errors.amount && (
            <Field.ErrorText>{errors.amount.message}</Field.ErrorText>
          )}
          <Field.HelperText>
            Entre R$ 1.000 e R$ 500.000
          </Field.HelperText>
        </Field.Root>

        {/* Número de Parcelas */}
        <Field.Root invalid={!!errors.installments} required>
          <Field.Label>Número de Parcelas</Field.Label>
          <NativeSelect.Root>
            <NativeSelect.Field
              {...register('installments', { valueAsNumber: true })}
              bg="var(--card)"
              borderColor="var(--border)"
              borderRadius="lg"
              _focus={{
                borderColor: 'var(--primary)',
                boxShadow: '0 0 0 1px var(--primary)'
              }}
            >
              {Array.from({ length: 115 }, (_, i) => i + 6).map((num) => (
                <option key={num} value={num}>
                  {num}x parcelas
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          {errors.installments && (
            <Field.ErrorText>{errors.installments.message}</Field.ErrorText>
          )}
        </Field.Root>

        {/* Taxa de Juros */}
        <Field.Root invalid={!!errors.interestRate} required>
          <Field.Label>Taxa de Juros Mensal (%)</Field.Label>
          <Input
            type="number"
            step="0.1"
            placeholder="Ex: 2.5"
            {...register('interestRate', { valueAsNumber: true })}
            bg="var(--card)"
            borderColor="var(--border)"
            borderRadius="lg"
            _focus={{
              borderColor: 'var(--primary)',
              boxShadow: '0 0 0 1px var(--primary)'
            }}
          />
          {errors.interestRate && (
            <Field.ErrorText>{errors.interestRate.message}</Field.ErrorText>
          )}
          <Field.HelperText>
            Taxa entre 0,1% e 15% ao mês
          </Field.HelperText>
        </Field.Root>

        {/* Botão de Submissão */}
        <Button
          type="submit"
          colorPalette="orange"
          size="lg"
          loading={isSubmitting}
          width="100%"
        >
          Simular Empréstimo
        </Button>
      </VStack>
    </form>
  )
}
```

### ✅ Props Corretas (v3)

```tsx
// ❌ V2 (INCORRETO)
<Field.Root isInvalid isRequired isDisabled>
<Button isLoading colorScheme="blue" leftIcon={<Icon />}>
<Input isInvalid isRequired isDisabled />

// ✅ V3 (CORRETO)
<Field.Root invalid required disabled>
<Button loading colorPalette="orange"><Icon />Texto</Button>
<Input invalid required disabled />
```

---

## 🔧 Padrões de Dialog/Modal

### ✅ Estrutura Básica Dialog.Root

```tsx
import { Dialog, Button } from '@chakra-ui/react'

interface LoanDetailsDialogProps {
  open: boolean
  onOpenChange: (details: { open: boolean }) => void
  loanData: LoanSimulation
}

export function LoanDetailsDialog({
  open,
  onOpenChange,
  loanData
}: LoanDetailsDialogProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      placement="center"
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content
          bg="var(--card)"
          borderRadius="2xl"
          maxW={{ base: "90vw", md: "600px" }}
        >
          <Dialog.Header>
            <Dialog.Title>Detalhes da Simulação</Dialog.Title>
            <Dialog.CloseTrigger />
          </Dialog.Header>

          <Dialog.Body pb={6}>
            {/* Conteúdo do modal */}
          </Dialog.Body>

          <Dialog.Footer>
            <Button
              variant="outline"
              onClick={() => onOpenChange({ open: false })}
            >
              Fechar
            </Button>
            <Button colorPalette="orange">
              Contratar Empréstimo
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
```

### ✅ Modal de Confirmação

```tsx
import { Dialog, Text, Stack } from '@chakra-ui/react'

interface ConfirmLoanDialogProps {
  open: boolean
  onOpenChange: (details: { open: boolean }) => void
  onConfirm: () => void
  loanAmount: number
  monthlyPayment: number
  totalAmount: number
}

export function ConfirmLoanDialog({
  open,
  onOpenChange,
  onConfirm,
  loanAmount,
  monthlyPayment,
  totalAmount,
}: ConfirmLoanDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange({ open: false })
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      placement="center"
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content bg="var(--card)" borderRadius="2xl">
          <Dialog.Header>
            <Dialog.Title>Confirmar Contratação</Dialog.Title>
            <Dialog.CloseTrigger />
          </Dialog.Header>

          <Dialog.Body>
            <Stack gap={4}>
              <Text color="var(--muted-foreground)">
                Você está prestes a contratar um empréstimo com as seguintes condições:
              </Text>

              <Box
                bg="var(--secondary)"
                p={4}
                borderRadius="lg"
                borderLeft="4px solid var(--orange-500)"
              >
                <Stack gap={2}>
                  <Text><strong>Valor:</strong> {formatCurrency(loanAmount)}</Text>
                  <Text><strong>Parcela mensal:</strong> {formatCurrency(monthlyPayment)}</Text>
                  <Text><strong>Total a pagar:</strong> {formatCurrency(totalAmount)}</Text>
                </Stack>
              </Box>

              <Text fontSize="sm" color="var(--muted-foreground)">
                Esta ação não pode ser desfeita. Confirme apenas se estiver certo.
              </Text>
            </Stack>
          </Dialog.Body>

          <Dialog.Footer>
            <Button
              variant="outline"
              onClick={() => onOpenChange({ open: false })}
            >
              Cancelar
            </Button>
            <Button
              colorPalette="orange"
              onClick={handleConfirm}
            >
              Confirmar Contratação
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
```

### ✅ Migração Modal → Dialog

```tsx
// ❌ V2 (INCORRETO)
<Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Título</ModalHeader>
    <ModalCloseButton />
    <ModalBody>Conteúdo</ModalBody>
    <ModalFooter>
      <Button onClick={onClose}>Fechar</Button>
    </ModalFooter>
  </ModalContent>
</Modal>

// ✅ V3 (CORRETO)
<Dialog.Root open={isOpen} onOpenChange={onOpenChange} size="lg" placement="center">
  <Dialog.Backdrop />
  <Dialog.Positioner>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Título</Dialog.Title>
        <Dialog.CloseTrigger />
      </Dialog.Header>
      <Dialog.Body>Conteúdo</Dialog.Body>
      <Dialog.Footer>
        <Button onClick={() => onOpenChange({ open: false })}>Fechar</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Positioner>
</Dialog.Root>
```

---

## 🔧 Padrões de Tabela

### ✅ Estrutura Básica Table.Root

```tsx
import { Table, Text } from '@chakra-ui/react'

interface InstallmentTableProps {
  installments: LoanInstallment[]
}

export function InstallmentTable({ installments }: InstallmentTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <Table.Root
      variant="line"
      size="sm"
      striped
      width="100%"
      overflowX="auto"
    >
      <Table.Header>
        <Table.Row bg="var(--secondary)">
          <Table.ColumnHeader textAlign="center" width="80px">
            Parcela
          </Table.ColumnHeader>
          <Table.ColumnHeader textAlign="center" minW="120px">
            Vencimento
          </Table.ColumnHeader>
          <Table.ColumnHeader textAlign="right" minW="120px">
            Valor Principal
          </Table.ColumnHeader>
          <Table.ColumnHeader textAlign="right" minW="120px">
            Juros
          </Table.ColumnHeader>
          <Table.ColumnHeader textAlign="right" minW="120px">
            Valor Total
          </Table.ColumnHeader>
          <Table.ColumnHeader textAlign="right" minW="140px">
            Saldo Devedor
          </Table.ColumnHeader>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {installments.map((installment, index) => (
          <Table.Row
            key={installment.number}
            _hover={{ bg: 'var(--accent)' }}
            transition="all 0.2s"
          >
            <Table.Cell textAlign="center" fontWeight="medium">
              {installment.number}
            </Table.Cell>
            <Table.Cell textAlign="center" fontSize="sm">
              {format(new Date(installment.dueDate), 'dd/MM/yyyy')}
            </Table.Cell>
            <Table.Cell textAlign="right" fontWeight="medium">
              {formatCurrency(installment.principalAmount)}
            </Table.Cell>
            <Table.Cell
              textAlign="right"
              color="var(--orange-600)"
              fontWeight="medium"
            >
              {formatCurrency(installment.interestAmount)}
            </Table.Cell>
            <Table.Cell
              textAlign="right"
              fontWeight="bold"
              fontSize="md"
            >
              {formatCurrency(installment.totalAmount)}
            </Table.Cell>
            <Table.Cell
              textAlign="right"
              color="var(--muted-foreground)"
              fontSize="sm"
            >
              {formatCurrency(installment.remainingBalance)}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>

      {/* Rodapé com totais */}
      <Table.Footer>
        <Table.Row bg="var(--secondary)" fontWeight="bold">
          <Table.Cell colSpan={2} textAlign="center">
            TOTAIS
          </Table.Cell>
          <Table.Cell textAlign="right">
            {formatCurrency(installments.reduce((sum, i) => sum + i.principalAmount, 0))}
          </Table.Cell>
          <Table.Cell textAlign="right" color="var(--orange-600)">
            {formatCurrency(installments.reduce((sum, i) => sum + i.interestAmount, 0))}
          </Table.Cell>
          <Table.Cell textAlign="right" fontSize="lg">
            {formatCurrency(installments.reduce((sum, i) => sum + i.totalAmount, 0))}
          </Table.Cell>
          <Table.Cell textAlign="right">
            R$ 0,00
          </Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table.Root>
  )
}
```

### ✅ Tabela Responsiva

```tsx
import { Table, Box, Stack, Text, useBreakpointValue } from '@chakra-ui/react'

export function ResponsiveInstallmentTable({ installments }: InstallmentTableProps) {
  const isMobile = useBreakpointValue({ base: true, md: false })

  if (isMobile) {
    // Versão mobile - cards ao invés de tabela
    return (
      <Stack gap={3}>
        {installments.map((installment) => (
          <Box
            key={installment.number}
            bg="var(--card)"
            p={4}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="var(--border)"
          >
            <Stack gap={2}>
              <Flex justify="space-between" align="center">
                <Text fontWeight="bold" color="var(--primary)">
                  Parcela {installment.number}
                </Text>
                <Text fontSize="sm" color="var(--muted-foreground)">
                  {format(new Date(installment.dueDate), 'dd/MM/yyyy')}
                </Text>
              </Flex>

              <Flex justify="space-between">
                <Text fontSize="sm">Valor:</Text>
                <Text fontWeight="bold">
                  {formatCurrency(installment.totalAmount)}
                </Text>
              </Flex>

              <Flex justify="space-between">
                <Text fontSize="sm">Juros:</Text>
                <Text color="var(--orange-600)">
                  {formatCurrency(installment.interestAmount)}
                </Text>
              </Flex>

              <Flex justify="space-between">
                <Text fontSize="sm">Saldo:</Text>
                <Text fontSize="sm" color="var(--muted-foreground)">
                  {formatCurrency(installment.remainingBalance)}
                </Text>
              </Flex>
            </Stack>
          </Box>
        ))}
      </Stack>
    )
  }

  // Versão desktop - tabela completa
  return (
    <Box overflowX="auto">
      <Table.Root variant="line" size="sm" minW="700px">
        {/* Conteúdo da tabela desktop */}
      </Table.Root>
    </Box>
  )
}
```

### ✅ Migração Table v2 → v3

```tsx
// ❌ V2 (INCORRETO)
<Table variant="simple" size="sm">
  <Thead>
    <Tr>
      <Th>Header</Th>
    </Tr>
  </Thead>
  <Tbody>
    <Tr>
      <Td>Cell</Td>
    </Tr>
  </Tbody>
</Table>

// ✅ V3 (CORRETO)
<Table.Root variant="line" size="sm">
  <Table.Header>
    <Table.Row>
      <Table.ColumnHeader>Header</Table.ColumnHeader>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Cell</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>
```

---

## 📱 Design Responsivo

### ✅ Breakpoints do Chakra UI v3

```javascript
const breakpoints = {
  base: "0rem",    // 0px
  sm: "30rem",     // ~480px
  md: "48rem",     // ~768px
  lg: "62rem",     // ~992px
  xl: "80rem",     // ~1280px
  "2xl": "96rem",  // ~1536px
}
```

### ✅ Padrões Responsivos

```tsx
import { Box, VStack, SimpleGrid, useBreakpointValue } from '@chakra-ui/react'

export function LoanSimulationPage() {
  const columns = useBreakpointValue({ base: 1, lg: 2 })
  const spacing = useBreakpointValue({ base: 4, md: 6, lg: 8 })
  const fontSize = { base: "sm", md: "md", lg: "lg" }

  return (
    <VStack
      gap={spacing}
      padding={{ base: 4, md: 6, lg: 8 }}
      maxW={{ base: "100%", md: "800px", xl: "1200px" }}
      mx="auto"
    >
      {/* Grid responsivo */}
      <SimpleGrid columns={columns} gap={spacing} width="100%">
        <Box
          bg="var(--card)"
          p={{ base: 4, md: 6 }}
          borderRadius={{ base: "lg", md: "xl" }}
          borderWidth="1px"
          borderColor="var(--border)"
        >
          {/* Formulário de simulação */}
        </Box>

        <Box
          bg="var(--card)"
          p={{ base: 4, md: 6 }}
          borderRadius={{ base: "lg", md: "xl" }}
          borderWidth="1px"
          borderColor="var(--border)"
        >
          {/* Resultados */}
        </Box>
      </SimpleGrid>

      {/* Tabela de parcelas responsiva */}
      <Box
        width="100%"
        overflowX={{ base: "auto", lg: "visible" }}
      >
        <ResponsiveInstallmentTable installments={installments} />
      </Box>
    </VStack>
  )
}
```

### ✅ Layout Mobile-First

```tsx
// Sempre comece pelo mobile (base) e vá expandindo
<Box
  // Mobile primeiro
  padding={4}
  fontSize="sm"
  flexDirection="column"
  // Tablet
  md={{
    padding: 6,
    fontSize: "md",
    flexDirection: "row",
  }}
  // Desktop
  lg={{
    padding: 8,
    fontSize: "lg",
    maxW: "1200px",
  }}
>
  Content
</Box>

// Ou usando object syntax
<Box
  padding={{ base: 4, md: 6, lg: 8 }}
  fontSize={{ base: "sm", md: "md", lg: "lg" }}
  flexDirection={{ base: "column", md: "row" }}
  maxW={{ base: "100%", lg: "1200px" }}
>
  Content
</Box>
```

---

## ♿ Acessibilidade

### ✅ ARIA Labels e Roles

```tsx
import { Field, Input, Button, Table } from '@chakra-ui/react'

export function AccessibleLoanForm() {
  return (
    <form
      role="form"
      aria-label="Formulário de simulação de empréstimo"
    >
      <Field.Root invalid={!!errors.amount} required>
        <Field.Label id="amount-label">Valor do Empréstimo</Field.Label>
        <Input
          {...register('amount')}
          aria-labelledby="amount-label"
          aria-describedby={errors.amount ? "amount-error" : "amount-help"}
          aria-invalid={!!errors.amount}
          aria-required="true"
        />
        <Field.HelperText id="amount-help">
          Entre R$ 1.000 e R$ 500.000
        </Field.HelperText>
        {errors.amount && (
          <Field.ErrorText id="amount-error" role="alert">
            {errors.amount.message}
          </Field.ErrorText>
        )}
      </Field.Root>

      <Button
        type="submit"
        aria-label="Calcular simulação do empréstimo"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Calculando...' : 'Simular Empréstimo'}
      </Button>
    </form>
  )
}
```

### ✅ Tabela Acessível

```tsx
<Table.Root
  role="table"
  aria-label="Tabela de parcelas do empréstimo"
  variant="line"
>
  <Table.Header role="rowgroup">
    <Table.Row role="row">
      <Table.ColumnHeader
        role="columnheader"
        aria-sort="none"
        scope="col"
      >
        Parcela
      </Table.ColumnHeader>
      <Table.ColumnHeader
        role="columnheader"
        scope="col"
      >
        Vencimento
      </Table.ColumnHeader>
    </Table.Row>
  </Table.Header>

  <Table.Body role="rowgroup">
    {installments.map((installment, index) => (
      <Table.Row
        key={installment.number}
        role="row"
        aria-label={`Parcela ${installment.number} de ${installments.length}`}
      >
        <Table.Cell
          role="cell"
          aria-label={`Número da parcela: ${installment.number}`}
        >
          {installment.number}
        </Table.Cell>
        <Table.Cell
          role="cell"
          aria-label={`Data de vencimento: ${format(new Date(installment.dueDate), 'dd/MM/yyyy')}`}
        >
          {format(new Date(installment.dueDate), 'dd/MM/yyyy')}
        </Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table.Root>
```

### ✅ Modal Acessível

```tsx
<Dialog.Root
  open={open}
  onOpenChange={onOpenChange}
  role="dialog"
  aria-modal="true"
  aria-labelledby="loan-dialog-title"
  aria-describedby="loan-dialog-description"
>
  <Dialog.Backdrop />
  <Dialog.Positioner>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title id="loan-dialog-title">
          Confirmar Contratação do Empréstimo
        </Dialog.Title>
        <Dialog.CloseTrigger
          aria-label="Fechar modal de confirmação"
        />
      </Dialog.Header>

      <Dialog.Body>
        <Text id="loan-dialog-description">
          Você está prestes a contratar um empréstimo.
          Verifique os dados antes de confirmar.
        </Text>
      </Dialog.Body>

      <Dialog.Footer>
        <Button
          variant="outline"
          onClick={() => onOpenChange({ open: false })}
          aria-label="Cancelar contratação do empréstimo"
        >
          Cancelar
        </Button>
        <Button
          colorPalette="orange"
          onClick={handleConfirm}
          aria-label="Confirmar contratação do empréstimo"
        >
          Confirmar
        </Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Positioner>
</Dialog.Root>
```

### ✅ Focus Management

```tsx
import { useRef, useEffect } from 'react'

export function FocusManagement() {
  const firstFieldRef = useRef<HTMLInputElement>(null)
  const submitButtonRef = useRef<HTMLButtonElement>(null)

  // Foco automático no primeiro campo
  useEffect(() => {
    if (open && firstFieldRef.current) {
      firstFieldRef.current.focus()
    }
  }, [open])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        ref={firstFieldRef}
        {...register('amount')}
        tabIndex={1}
      />

      <Input
        {...register('installments')}
        tabIndex={2}
      />

      <Button
        ref={submitButtonRef}
        type="submit"
        tabIndex={3}
      >
        Simular
      </Button>
    </form>
  )
}
```

---

## 🔗 Integração com React Hook Form

### ✅ Padrão Completo com Zod

```tsx
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const loanSchema = z.object({
  amount: z.number()
    .min(1000, 'Valor mínimo é R$ 1.000')
    .max(500000, 'Valor máximo é R$ 500.000'),
  installments: z.number()
    .min(6, 'Mínimo 6 parcelas')
    .max(120, 'Máximo 120 parcelas'),
  paymentType: z.enum(['monthly', 'biweekly']),
  hasInsurance: z.boolean(),
})

type LoanFormData = z.infer<typeof loanSchema>

export function LoanFormWithValidation() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting, isValid }
  } = useForm<LoanFormData>({
    resolver: zodResolver(loanSchema),
    mode: 'onChange', // Validação em tempo real
    defaultValues: {
      amount: 10000,
      installments: 12,
      paymentType: 'monthly',
      hasInsurance: false,
    }
  })

  // Watch para reatividade
  const amount = watch('amount')
  const installments = watch('installments')

  // Submissão
  const onSubmit = async (data: LoanFormData) => {
    try {
      const result = await simulateLoan(data)
      console.log('Simulação:', result)
    } catch (error) {
      console.error('Erro na simulação:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack gap={6} align="stretch">
        {/* Campo numérico simples */}
        <Field.Root invalid={!!errors.amount} required>
          <Field.Label>Valor do Empréstimo (R$)</Field.Label>
          <Input
            type="number"
            step="100"
            {...register('amount', {
              valueAsNumber: true,
              onChange: () => trigger('amount') // Re-validar ao mudar
            })}
            bg="var(--card)"
            borderColor="var(--border)"
            borderRadius="lg"
          />
          {errors.amount && (
            <Field.ErrorText>{errors.amount.message}</Field.ErrorText>
          )}
        </Field.Root>

        {/* Select nativo */}
        <Field.Root invalid={!!errors.installments} required>
          <Field.Label>Número de Parcelas</Field.Label>
          <NativeSelect.Root>
            <NativeSelect.Field
              {...register('installments', { valueAsNumber: true })}
            >
              {[6, 12, 18, 24, 36, 48, 60].map((num) => (
                <option key={num} value={num}>
                  {num}x parcelas
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          {errors.installments && (
            <Field.ErrorText>{errors.installments.message}</Field.ErrorText>
          )}
        </Field.Root>

        {/* Radio buttons com Controller */}
        <Field.Root invalid={!!errors.paymentType} required>
          <Field.Label>Tipo de Pagamento</Field.Label>
          <Controller
            name="paymentType"
            control={control}
            render={({ field }) => (
              <RadioGroup.Root
                value={field.value}
                onValueChange={field.onChange}
              >
                <HStack gap={6}>
                  <RadioGroup.Item value="monthly">
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemControl />
                    <RadioGroup.ItemText>Mensal</RadioGroup.ItemText>
                  </RadioGroup.Item>
                  <RadioGroup.Item value="biweekly">
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemControl />
                    <RadioGroup.ItemText>Quinzenal</RadioGroup.ItemText>
                  </RadioGroup.Item>
                </HStack>
              </RadioGroup.Root>
            )}
          />
          {errors.paymentType && (
            <Field.ErrorText>{errors.paymentType.message}</Field.ErrorText>
          )}
        </Field.Root>

        {/* Checkbox com Controller */}
        <Field.Root>
          <Controller
            name="hasInsurance"
            control={control}
            render={({ field }) => (
              <Checkbox.Root
                checked={field.value}
                onCheckedChange={field.onChange}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>
                  Contratar seguro prestamista (+2% no valor)
                </Checkbox.Label>
              </Checkbox.Root>
            )}
          />
        </Field.Root>

        {/* Preview dos valores calculados */}
        {amount && installments && (
          <Box
            bg="var(--secondary)"
            p={4}
            borderRadius="lg"
            borderLeft="4px solid var(--orange-500)"
          >
            <Stack gap={2}>
              <Text><strong>Valor solicitado:</strong> {formatCurrency(amount)}</Text>
              <Text><strong>Parcelas:</strong> {installments}x</Text>
              <Text><strong>Valor estimado da parcela:</strong> {formatCurrency(amount / installments)}</Text>
            </Stack>
          </Box>
        )}

        {/* Botão de submissão */}
        <Button
          type="submit"
          colorPalette="orange"
          size="lg"
          loading={isSubmitting}
          disabled={!isValid || isSubmitting}
          width="100%"
        >
          {isSubmitting ? 'Simulando...' : 'Simular Empréstimo'}
        </Button>
      </VStack>
    </form>
  )
}
```

### ✅ Validação Dinâmica e Máscaras

```tsx
import { useForm } from 'react-hook-form'

export function AdvancedFormFields() {
  const { register, watch, setValue, formState: { errors } } = useForm()

  // Máscara para valor monetário
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    value = (Number(value) / 100).toFixed(2)
    value = value.replace('.', ',')
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    setValue('amount', value)
  }

  // Campo com máscara de CPF
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    setValue('cpf', value)
  }

  return (
    <VStack gap={4}>
      {/* Campo monetário com máscara */}
      <Field.Root invalid={!!errors.amount}>
        <Field.Label>Valor (R$)</Field.Label>
        <Input
          placeholder="0,00"
          onChange={handleAmountChange}
          maxLength={15}
        />
        {errors.amount && (
          <Field.ErrorText>{errors.amount.message}</Field.ErrorText>
        )}
      </Field.Root>

      {/* Campo CPF com máscara */}
      <Field.Root invalid={!!errors.cpf}>
        <Field.Label>CPF</Field.Label>
        <Input
          placeholder="000.000.000-00"
          onChange={handleCpfChange}
          maxLength={14}
        />
        {errors.cpf && (
          <Field.ErrorText>{errors.cpf.message}</Field.ErrorText>
        )}
      </Field.Root>
    </VStack>
  )
}
```

---

## 🔄 Migração v2 → v3

### ✅ Checklist Completo de Migração

#### Props Renomeadas (CRÍTICO!)
```tsx
// ❌ V2 → ✅ V3
isOpen → open
isDisabled → disabled
isInvalid → invalid
isRequired → required
isLoading → loading
colorScheme → colorPalette
spacing → gap
```

#### Componentes Reestruturados
```tsx
// ❌ V2 → ✅ V3
<FormControl> → <Field.Root>
<FormLabel> → <Field.Label>
<FormErrorMessage> → <Field.ErrorText>
<FormHelperText> → <Field.HelperText>

<Modal> → <Dialog.Root>
<ModalOverlay> → <Dialog.Backdrop>
<ModalContent> → <Dialog.Content>
<ModalHeader> → <Dialog.Header>
<ModalBody> → <Dialog.Body>

<Table> → <Table.Root>
<Thead> → <Table.Header>
<Th> → <Table.ColumnHeader>
<Tbody> → <Table.Body>
<Td> → <Table.Cell>
```

#### Ícones em Botões
```tsx
// ❌ V2
<Button leftIcon={<Icon />}>Texto</Button>
<Button rightIcon={<Icon />}>Texto</Button>

// ✅ V3
<Button><Icon />Texto</Button>
<Button>Texto<Icon /></Button>
```

#### Toast/Toaster
```tsx
// ❌ V2
import { useToast } from '@chakra-ui/react'
const toast = useToast()
toast({
  title: 'Success',
  status: 'success',
  position: 'top-right',
})

// ✅ V3
import { toaster } from '@/components/ui/toaster'
toaster.create({
  title: 'Success',
  type: 'success',
  placement: 'top-end',
})
```

### ✅ Script de Busca e Correção

```bash
# Buscar padrões v2 que precisam ser atualizados
grep -r "isOpen\|isDisabled\|isInvalid\|isRequired\|isLoading" src/
grep -r "colorScheme\|leftIcon\|rightIcon" src/
grep -r "FormControl\|FormLabel\|FormErrorMessage" src/
grep -r "Modal\|ModalOverlay\|ModalContent" src/
grep -r "Table.*variant\|Thead\|Tbody\|Th\|Td" src/
grep -r "useToast\|toast(" src/

# Buscar importações antigas
grep -r "import.*{.*Modal.*}" src/
grep -r "import.*{.*FormControl.*}" src/
grep -r "import.*{.*Table.*}" src/
```

### ✅ Padrões de Refatoração

```tsx
// Antes (V2)
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
} from '@chakra-ui/react'

// Depois (V3)
import {
  Dialog,
  Field,
  Input,
  Table,
} from '@chakra-ui/react'
import { toaster } from '@/components/ui/toaster'
```

---

## ⚡ Dicas de Performance

### ✅ Otimização de Re-renders

```tsx
import { memo, useCallback, useMemo } from 'react'

// Memorizar componente pesado
const InstallmentTable = memo(({ installments }: InstallmentTableProps) => {
  // Memorizar cálculos pesados
  const totals = useMemo(() => {
    return installments.reduce(
      (acc, installment) => ({
        principal: acc.principal + installment.principalAmount,
        interest: acc.interest + installment.interestAmount,
        total: acc.total + installment.totalAmount,
      }),
      { principal: 0, interest: 0, total: 0 }
    )
  }, [installments])

  return (
    <Table.Root>
      {/* Conteúdo da tabela */}
    </Table.Root>
  )
})

// Memorizar callbacks
export function LoanSimulationForm() {
  const handleAmountChange = useCallback((value: number) => {
    setValue('amount', value)
    trigger('amount')
  }, [setValue, trigger])

  const handleInstallmentChange = useCallback((value: number) => {
    setValue('installments', value)
    trigger('installments')
  }, [setValue, trigger])

  return (
    // JSX
  )
}
```

### ✅ Lazy Loading para Tabelas Grandes

```tsx
import { FixedSizeList as List } from 'react-window'

export function VirtualizedInstallmentTable({ installments }: InstallmentTableProps) {
  const Row = ({ index, style }: { index: number; style: any }) => {
    const installment = installments[index]

    return (
      <div style={style}>
        <Table.Row>
          <Table.Cell>{installment.number}</Table.Cell>
          <Table.Cell>{formatCurrency(installment.totalAmount)}</Table.Cell>
        </Table.Row>
      </div>
    )
  }

  return (
    <Box height="400px">
      <List
        height={400}
        itemCount={installments.length}
        itemSize={50}
        width="100%"
      >
        {Row}
      </List>
    </Box>
  )
}
```

---

## 🧪 Testes

### ✅ Testes de Componentes

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from '@/components/ui/provider'
import { LoanSimulationForm } from './LoanSimulationForm'

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <Provider>
      {component}
    </Provider>
  )
}

describe('LoanSimulationForm', () => {
  it('deve renderizar todos os campos obrigatórios', () => {
    renderWithProvider(<LoanSimulationForm />)

    expect(screen.getByLabelText(/valor do empréstimo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/número de parcelas/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/taxa de juros/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /simular/i })).toBeInTheDocument()
  })

  it('deve mostrar erro quando valor é inválido', async () => {
    renderWithProvider(<LoanSimulationForm />)

    const amountInput = screen.getByLabelText(/valor do empréstimo/i)
    const submitButton = screen.getByRole('button', { name: /simular/i })

    fireEvent.change(amountInput, { target: { value: '500' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/valor mínimo é r\$ 1\.000/i)).toBeInTheDocument()
    })
  })

  it('deve calcular simulação corretamente', async () => {
    const mockOnSimulate = jest.fn()

    renderWithProvider(
      <LoanSimulationForm onSimulate={mockOnSimulate} />
    )

    fireEvent.change(screen.getByLabelText(/valor/i), {
      target: { value: '10000' }
    })
    fireEvent.change(screen.getByLabelText(/parcelas/i), {
      target: { value: '12' }
    })
    fireEvent.click(screen.getByRole('button', { name: /simular/i }))

    await waitFor(() => {
      expect(mockOnSimulate).toHaveBeenCalledWith({
        amount: 10000,
        installments: 12,
        // ...
      })
    })
  })
})
```

### ✅ Testes de Acessibilidade

```tsx
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('Accessibility', () => {
  it('não deve ter violações de acessibilidade', async () => {
    const { container } = renderWithProvider(<LoanSimulationForm />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('deve ter navigation correta com teclado', () => {
    renderWithProvider(<LoanSimulationForm />)

    const firstInput = screen.getByLabelText(/valor/i)
    firstInput.focus()

    // Tab para próximo campo
    fireEvent.keyDown(firstInput, { key: 'Tab' })
    expect(screen.getByLabelText(/parcelas/i)).toHaveFocus()
  })
})
```

---

## ⚠️ Avisos Importantes

### ❌ Nunca Faça Isso (V3)
```tsx
// ❌ Props v2 em componentes v3
<Field.Root isInvalid isRequired>
<Button isLoading colorScheme="blue">
<Dialog.Root isOpen onClose={}>

// ❌ Estrutura v2 com componentes v3
<Modal><Dialog.Content></Modal>
<FormControl><Field.Root></FormControl>

// ❌ Importações mistas v2/v3
import { Modal, Field } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
```

### ✅ Sempre Faça Isso (V3)
```tsx
// ✅ Props v3 corretas
<Field.Root invalid required>
<Button loading colorPalette="orange">
<Dialog.Root open onOpenChange={}>

// ✅ Estrutura v3 completa
<Dialog.Root>
  <Dialog.Backdrop />
  <Dialog.Positioner>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title />
        <Dialog.CloseTrigger />
      </Dialog.Header>
      <Dialog.Body />
    </Dialog.Content>
  </Dialog.Positioner>
</Dialog.Root>

// ✅ Importações v3 corretas
import { Dialog, Field, Input, Table } from '@chakra-ui/react'
import { toaster } from '@/components/ui/toaster'
```

---

## 📚 Referências

- [Chakra UI v3 Official Docs](https://v3.chakra-ui.com/)
- [Migration Guide v2 → v3](https://chakra-ui.com/docs/get-started/migration)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Última atualização**: Janeiro 2026
**Versão**: 1.0.0