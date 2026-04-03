import { useState, useCallback } from 'react';
import {
  Box,
  Flex,
  Text,
  VStack,
  Icon,
  HStack,
  Link as ChakraLink,
  Center,
  Spinner,
  Button,
  Input,
  Select,
  IconButton,
  Dialog,
  Field,
  Textarea,
  createListCollection,
} from '@chakra-ui/react';
import { toaster } from '../../ui/toaster';
import {
  Eye,
  EyeOff,
  TrendingUp,
  ArrowLeftRight,
  Banknote,
  QrCode,
  ShoppingCart,
  ArrowDownLeft,
  ArrowUpRight,
  Utensils,
  Zap,
  Receipt,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Tag as LucideTag,
} from 'lucide-react';
import { BaseForm } from '../../ui/BaseForm';
import { useAccounts } from '../../../hooks/useAccounts';
import { useTransactions, useUpdateTransaction, useDeleteTransaction } from '../../../hooks/useTransactions';
import { useCategories } from '../../../hooks/useCategories';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Transaction, TransactionType } from '../../../types/transaction';
import type { Category } from '@igorguariroba/bfin-sdk/client';

interface TransactionItemProps {
  title: string;
  date: string;
  amount: number;
  type: TransactionType;
  icon: React.ElementType;
  isIncome?: boolean;
  transactionId: string;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: string) => void;
}

function TransactionItem({ title, date, amount, type, icon, isIncome, transactionId, onEdit, onDelete }: TransactionItemProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Box bg="var(--card)" borderRadius="xl" p={4} shadow="sm" position="relative">
      <Flex align="center" justify="space-between">
        <HStack gap={4} flex={1}>
          <Center bg="green.50" boxSize="12" borderRadius="xl">
            <Icon as={icon} color="green.500" boxSize={6} />
          </Center>
          <VStack align="flex-start" gap={0} flex={1}>
            <Text fontWeight="bold" color="var(--foreground)" fontSize="md" lineClamp={1}>
              {title}
            </Text>
            <Text color="var(--muted-foreground)" fontSize="sm">
              {date}
            </Text>
          </VStack>
        </HStack>

        <HStack gap={2} align="center">
          <VStack align="flex-end" gap={0}>
            <Text
              fontWeight="bold"
              color={isIncome ? 'green.500' : 'var(--foreground)'}
              fontSize="lg"
            >
              {isIncome ? '+ ' : '- '}
              {formatCurrency(Math.abs(amount))}
            </Text>
            <Text color="var(--muted-foreground)" fontSize="xs">
              {type}
            </Text>
          </VStack>

          <VStack gap={1}>
            <IconButton
              aria-label="Editar transação"
              size="sm"
              variant="ghost"
              colorPalette="gray"
              onClick={(e) => {
                e.stopPropagation();
                // Criar objeto Transaction simples para o callback
                const transaction: Transaction = {
                  id: transactionId,
                  description: title,
                  amount: Math.abs(amount),
                  type: isIncome ? 'income' : 'variable',
                } as Transaction;
                onEdit(transaction);
              }}
              _hover={{ bg: 'gray.100' }}
            >
              <Edit3 size={14} />
            </IconButton>
            <IconButton
              aria-label="Deletar transação"
              size="sm"
              variant="ghost"
              colorPalette="red"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(transactionId);
              }}
              _hover={{ bg: 'red.50', color: 'red.500' }}
            >
              <Trash2 size={14} />
            </IconButton>
          </VStack>
        </HStack>
      </Flex>
    </Box>
  );
}

interface ExtratoFormProps {
  onBack?: () => void;
  onViewAll?: () => void;
  onCancel?: () => void;
}

export function ExtratoForm({ onBack, onViewAll, onCancel }: ExtratoFormProps) {
  const { data: accounts, isLoading: loadingAccounts } = useAccounts();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data: transactionsData, isLoading: loadingTransactions } = useTransactions({
    limit: pageSize,
    page: currentPage,
  });
  const { data: categoriesData } = useCategories(accounts?.[0]?.id);
  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();

  const [showBalance, setShowBalance] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  // Estados do modal de edição
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  // Estados do formulário de edição
  const [editFormData, setEditFormData] = useState({
    description: '',
    amount: '',
    categoryId: '',
    dueDate: '',
    tags: [] as string[],
    notes: '',
    isRecurring: false,
    recurrencePattern: '' as 'monthly' | 'weekly' | 'yearly' | '',
    recurrenceEndDate: '',
  });

  // Estado para input de nova tag
  const [newTag, setNewTag] = useState('');


  // Função para abrir modal de edição
  const handleEditTransaction = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setEditFormData({
      description: transaction.description,
      amount: transaction.amount.toString(),
      categoryId: transaction.category_id || '',
      dueDate: transaction.due_date || '',
      tags: transaction.tags || [],
      notes: transaction.notes || '',
      isRecurring: transaction.is_recurring || false,
      recurrencePattern: transaction.recurrence_pattern || '',
      recurrenceEndDate: transaction.recurrence_end_date || '',
    });
    setIsEditModalOpen(true);
  }, []);

  // Função para abrir confirmação de deleção
  const handleDeleteTransaction = useCallback((transactionId: string) => {
    setTransactionToDelete(transactionId);
    setIsDeleteAlertOpen(true);
  }, []);

  // Função para salvar edição
  const handleSaveEdit = useCallback(async () => {
    if (!selectedTransaction) return;

    try {
      await updateTransaction.mutateAsync({
        id: selectedTransaction.id,
        data: {
          description: editFormData.description,
          amount: parseFloat(editFormData.amount),
          categoryId: editFormData.categoryId || undefined,
          dueDate: editFormData.dueDate || undefined,
        },
      });

      toaster.create({
        title: 'Transação atualizada',
        description: 'A transação foi atualizada com sucesso.',
        type: 'success',
        duration: 3000,
      });

      setIsEditModalOpen(false);
    } catch (_error) {
      toaster.create({
        title: 'Erro ao atualizar',
        description: 'Não foi possível atualizar a transação.',
        type: 'error',
        duration: 5000,
      });
    }
  }, [selectedTransaction, editFormData, updateTransaction]);

  // Função para confirmar deleção
  const handleConfirmDelete = useCallback(async () => {
    if (!transactionToDelete) return;

    try {
      await deleteTransaction.mutateAsync(transactionToDelete);

      toaster.create({
        title: 'Transação deletada',
        description: 'A transação foi removida com sucesso.',
        type: 'success',
        duration: 3000,
      });

      setIsDeleteAlertOpen(false);
    } catch (_error) {
      toaster.create({
        title: 'Erro ao deletar',
        description: 'Não foi possível remover a transação.',
        type: 'error',
        duration: 5000,
      });
    }
  }, [transactionToDelete, deleteTransaction]);

  // Handlers para tags
  const handleAddTag = useCallback(() => {
    if (newTag.trim()) {
      setEditFormData((prev: typeof editFormData) => {
        if (!prev.tags.includes(newTag.trim())) {
          return {
            ...prev,
            tags: [...prev.tags, newTag.trim()],
          };
        }
        return prev;
      });
      setNewTag('');
    }
  }, [newTag]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setEditFormData((prev: typeof editFormData) => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  }, []);

  const handleKeyPressTag = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  }, [handleAddTag]);

  // Handlers para paginação
  const handleNextPage = useCallback(() => {
    if (transactionsData?.pagination && currentPage < transactionsData.pagination.total_pages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, transactionsData?.pagination]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  const totalPages = transactionsData?.pagination?.total_pages || 0;

  const totals = accounts?.reduce(
    (acc, account) => ({
      availableBalance: acc.availableBalance + Number(account.available_balance),
    }),
    { availableBalance: 0 }
  ) || { availableBalance: 0 };

  const formatCurrency = (value: number) => {
    if (!showBalance) return 'R$ ••••••';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getTransactionIcon = (description: string, type: TransactionType) => {
    const desc = description.toLowerCase();
    if (desc.includes('supermercado')) return ShoppingCart;
    if (desc.includes('restaurante') || desc.includes('sabor')) return Utensils;
    if (desc.includes('energia') || desc.includes('luz')) return Zap;
    if (type === 'income') return ArrowDownLeft;
    return ArrowUpRight;
  };

  const formatDateLabel = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      if (date.toDateString() === today.toDateString()) return 'Hoje';
      if (date.toDateString() === yesterday.toDateString()) return 'Ontem';

      return format(date, "dd MMM", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const viewAllColor = onViewAll ? 'var(--primary)' : 'green.500';

  return (
    <BaseForm
      variant="green-header"
      title="Extrato da Conta"
      icon={Receipt}
      isLoading={loadingAccounts}
      displayValue={{
        value: loadingAccounts ? '...' : formatCurrency(totals.availableBalance),
        label: 'Saldo em Conta',
        editable: true,
        onEdit: () => setShowBalance(!showBalance),
      }}
      headerContent={
        <Icon
          as={showBalance ? Eye : EyeOff}
          boxSize={6}
          color="var(--primary-foreground)"
          cursor="pointer"
          onClick={() => setShowBalance(!showBalance)}
          _hover={{ opacity: 0.8 }}
        />
      }
      onBack={onBack}
      onCancel={onCancel}
    >

      {/* Floating Action Card */}
      <Box px={4} mt="-10" mb={6}>
        <Box bg="var(--card)" borderRadius="2xl" p={6} shadow="xl">
          <Flex justify="space-between" align="center">
            <VStack gap={2} cursor="pointer">
              <Center bg="green.50" boxSize="14" borderRadius="2xl">
                <Icon as={TrendingUp} color="green.500" boxSize={6} />
              </Center>
              <Text fontSize="xs" fontWeight="bold" color="var(--muted-foreground)">Investimentos</Text>
            </VStack>

            <VStack gap={2} cursor="pointer">
              <Center bg="green.50" boxSize="14" borderRadius="2xl">
                <Icon as={ArrowLeftRight} color="green.500" boxSize={6} />
              </Center>
              <Text fontSize="xs" fontWeight="bold" color="var(--muted-foreground)">Transferir</Text>
            </VStack>

            <VStack gap={2} cursor="pointer">
              <Center bg="green.50" boxSize="14" borderRadius="2xl">
                <Icon as={Banknote} color="green.500" boxSize={6} />
              </Center>
              <Text fontSize="xs" fontWeight="bold" color="var(--muted-foreground)">Pagar</Text>
            </VStack>

            <VStack gap={2} cursor="pointer">
              <Center bg="green.50" boxSize="14" borderRadius="2xl">
                <Icon as={QrCode} color="green.500" boxSize={6} />
              </Center>
              <Text fontSize="xs" fontWeight="bold" color="var(--muted-foreground)">Pix</Text>
            </VStack>
          </Flex>
        </Box>
      </Box>

      {/* Recent Transactions Section */}
      <VStack align="stretch" gap={4} px={6} pb={24}>
        <Flex justify="space-between" align="center">
          <Text fontSize="xl" fontWeight="bold" color="var(--foreground)">
            Extrato Recente
          </Text>
          {onViewAll && (
            <ChakraLink color={viewAllColor} fontWeight="bold" fontSize="sm" onClick={onViewAll}>
              Ver tudo
            </ChakraLink>
          )}
        </Flex>

        <VStack gap={3} align="stretch">
          {loadingTransactions ? (
            <Center py={10}>
              <Spinner color="green.500" />
            </Center>
          ) : transactionsData?.transactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              title={transaction.description}
              date={transaction.due_date ? formatDateLabel(transaction.due_date) : '-'}
              amount={Number(transaction.amount)}
              type={transaction.type}
              icon={getTransactionIcon(transaction.description, transaction.type)}
              isIncome={transaction.type === 'income'}
              transactionId={transaction.id}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
            />
          ))}

          {!loadingTransactions && transactionsData?.transactions.length === 0 && (
            <Center py={10}>
              <Text color="var(--muted-foreground)">Nenhuma transação recente</Text>
            </Center>
          )}
        </VStack>

        {/* Controles de Paginação */}
        {!loadingTransactions && totalPages > 1 && (
          <Flex justify="space-between" align="center" mt={4}>
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} /> Anterior
            </Button>

            <Text fontSize="sm" color="var(--muted-foreground)">
              Página {currentPage} de {totalPages}
            </Text>

            <Button
              size="sm"
              variant="outline"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Próxima <ChevronRight size={16} />
            </Button>
          </Flex>
        )}
      </VStack>

      {/* Modal de Edição */}
      <Dialog.Root open={isEditModalOpen} onOpenChange={({ open }) => setIsEditModalOpen(open)} size="lg">
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="600px">
            <Dialog.Header>
              <Dialog.Title>Editar Transação</Dialog.Title>
              <Dialog.CloseTrigger />
            </Dialog.Header>

            <Dialog.Body>
              <VStack gap={5}>
                <Field.Root>
                  <Field.Label>Descrição</Field.Label>
                  <Input
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    placeholder="Digite a descrição"
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Valor (R$)</Field.Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editFormData.amount}
                    onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
                    placeholder="0.00"
                  />
                </Field.Root>

                {categoriesData && categoriesData.length > 0 && (
                  <Field.Root>
                    <Field.Label>Categoria</Field.Label>
                    {(() => {
                      const categoryCollection = createListCollection({
                        items: categoriesData.map((c: Category) => ({ label: c.name, value: c.id ?? '' })),
                      });
                      
                      return (
                        <Select.Root
                          collection={categoryCollection}
                          value={[editFormData.categoryId]}
                          onValueChange={({ value }) => setEditFormData({ ...editFormData, categoryId: value[0] || '' })}
                        >
                          <Select.HiddenSelect />
                          <Select.Control>
                            <Select.Trigger>
                              <Select.ValueText placeholder="Selecione uma categoria" />
                            </Select.Trigger>
                          </Select.Control>
                          <Select.Positioner>
                            <Select.Content>
                              {categoryCollection.items.map((item) => (
                                <Select.Item key={item.value} item={item}>
                                  <Select.ItemText>{item.label}</Select.ItemText>
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Positioner>
                        </Select.Root>
                      );
                    })()}
                  </Field.Root>
                )}

                <Field.Root>
                  <Field.Label>Data de Vencimento</Field.Label>
                  <Input
                    type="date"
                    value={editFormData.dueDate}
                    onChange={(e) => setEditFormData({ ...editFormData, dueDate: e.target.value })}
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Observações</Field.Label>
                  <Textarea
                    value={editFormData.notes}
                    onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                    placeholder="Adicione observações sobre esta transação..."
                    rows={3}
                  />
                </Field.Root>

                {/* Seção de Tags */}
                <Field.Root>
                  <Field.Label>Tags</Field.Label>
                  <VStack gap={3}>
                    <Flex gap={2} wrap="wrap">
                      {editFormData.tags.map((tag) => (
                        <Box
                          key={tag}
                          as="span"
                          px={2}
                          py={1}
                          bg="green.50"
                          color="green.700"
                          borderRadius="md"
                          fontSize="sm"
                          fontWeight="medium"
                          display="inline-flex"
                          alignItems="center"
                          gap={1}
                        >
                          {tag}
                          <Box
                            as="button"
                            onClick={() => handleRemoveTag(tag)}
                            cursor="pointer"
                            border="none"
                            bg="transparent"
                            padding={0}
                            display="flex"
                            alignItems="center"
                            _hover={{ opacity: 0.7 }}
                          >
                            <LucideTag size={12} />
                          </Box>
                        </Box>
                      ))}
                    </Flex>
                    <HStack gap={2}>
                      <Input
                        flex={1}
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={handleKeyPressTag}
                        placeholder="Nova tag"
                        size="sm"
                      />
                      <IconButton
                        size="sm"
                        aria-label="Adicionar tag"
                        onClick={handleAddTag}
                        disabled={!newTag.trim()}
                      >
                        <Plus size={16} />
                      </IconButton>
                    </HStack>
                  </VStack>
                </Field.Root>

                {/* Seção de Recorrência */}
                <Box borderTop="1px solid" borderColor="gray.200" pt={4}>
                  <VStack gap={4}>
                    <Field.Root>
                      <Field.Label>Transação Recorrente</Field.Label>
                      {(() => {
                        const recurringCollection = createListCollection({
                          items: [
                            { label: 'Sim', value: 'yes' },
                            { label: 'Não', value: 'no' },
                          ],
                        });
                        
                        return (
                          <Select.Root
                            collection={recurringCollection}
                            value={[editFormData.isRecurring ? 'yes' : 'no']}
                            onValueChange={({ value }) => {
                              const isRecurring = value[0] === 'yes';
                              setEditFormData({
                                ...editFormData,
                                isRecurring,
                                recurrencePattern: isRecurring ? editFormData.recurrencePattern : '',
                                recurrenceEndDate: isRecurring ? editFormData.recurrenceEndDate : '',
                              });
                            }}
                          >
                            <Select.HiddenSelect />
                            <Select.Control>
                              <Select.Trigger>
                                <Select.ValueText />
                              </Select.Trigger>
                            </Select.Control>
                            <Select.Positioner>
                              <Select.Content>
                                {recurringCollection.items.map((item) => (
                                  <Select.Item key={item.value} item={item}>
                                    <Select.ItemText>{item.label}</Select.ItemText>
                                  </Select.Item>
                                ))}
                              </Select.Content>
                            </Select.Positioner>
                          </Select.Root>
                        );
                      })()}
                    </Field.Root>

                    {editFormData.isRecurring && (
                      <>
                        <Field.Root>
                          <Field.Label>Padrão de Recorrência</Field.Label>
                          {(() => {
                            const patternCollection = createListCollection({
                              items: [
                                { label: 'Mensal', value: 'monthly' },
                                { label: 'Semanal', value: 'weekly' },
                                { label: 'Anual', value: 'yearly' },
                              ],
                            });
                            
                            return (
                              <Select.Root
                                collection={patternCollection}
                                value={[editFormData.recurrencePattern]}
                                onValueChange={({ value }) => setEditFormData({ ...editFormData, recurrencePattern: value[0] as 'monthly' | 'weekly' | 'yearly' })}
                              >
                                <Select.HiddenSelect />
                                <Select.Control>
                                  <Select.Trigger>
                                    <Select.ValueText placeholder="Selecione o padrão" />
                                  </Select.Trigger>
                                </Select.Control>
                                <Select.Positioner>
                                  <Select.Content>
                                    {patternCollection.items.map((item) => (
                                      <Select.Item key={item.value} item={item}>
                                        <Select.ItemText>{item.label}</Select.ItemText>
                                      </Select.Item>
                                    ))}
                                  </Select.Content>
                                </Select.Positioner>
                              </Select.Root>
                            );
                          })()}
                        </Field.Root>

                        <Field.Root>
                          <Field.Label>Data de Término da Recorrência</Field.Label>
                          <Input
                            type="date"
                            value={editFormData.recurrenceEndDate}
                            onChange={(e) => setEditFormData({ ...editFormData, recurrenceEndDate: e.target.value })}
                          />
                        </Field.Root>
                      </>
                    )}
                  </VStack>
                </Box>
              </VStack>
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <Button variant="outline">Cancelar</Button>
              </Dialog.CloseTrigger>
              <Button
                colorPalette="green"
                onClick={handleSaveEdit}
                loading={updateTransaction.isPending}
                disabled={!editFormData.description || !editFormData.amount}
              >
                Salvar Alterações
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      {/* Dialog de Confirmação de Deleção */}
      <Dialog.Root open={isDeleteAlertOpen} onOpenChange={({ open }) => setIsDeleteAlertOpen(open)} role="alertdialog">
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title fontSize="lg" fontWeight="bold">
                Deletar Transação
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <Text>Tem certeza que deseja deletar esta transação? Esta ação não pode ser desfeita.</Text>
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <Button variant="outline">Cancelar</Button>
              </Dialog.CloseTrigger>
              <Button
                colorPalette="red"
                onClick={handleConfirmDelete}
                loading={deleteTransaction.isPending}
              >
                Deletar
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </BaseForm>
  );
}