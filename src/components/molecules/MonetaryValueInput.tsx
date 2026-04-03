import { Input } from '@chakra-ui/react';
import { useState, useCallback } from 'react';

interface MonetaryValueInputProps {
  value: string;
  onValueChange: (value: string, valueAsNumber: number) => void;
  placeholder?: string;
  min?: number;
  step?: number;
}

/**
 * Formata valor monetário em tempo real
 */
const formatCurrency = (value: string): string => {
  // Remove tudo exceto números
  const numbersOnly = value.replace(/\D/g, '');

  if (!numbersOnly) return '';

  // Converte para centavos e depois para reais
  const cents = parseInt(numbersOnly, 10);
  const reais = cents / 100;

  return reais.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  });
};

/**
 * Converte valor formatado para número
 */
const parseValue = (formattedValue: string): number => {
  const numbersOnly = formattedValue.replace(/\D/g, '');
  if (!numbersOnly) return 0;
  return parseInt(numbersOnly, 10) / 100;
};

/**
 * Componente padrão para input de valores monetários no header dos formulários.
 * Usado nos formulários de despesa, transferência, pagamento e depósito.
 *
 * Funcionalidades:
 * - Formatação automática em tempo real (R$ 0,00)
 * - Aceita apenas números
 * - Posição do cursor preservada
 * - Formatação brasileira (vírgula para decimais)
 */
export function MonetaryValueInput({
  value,
  onValueChange,
  placeholder = "R$ 0,00",
  min = 0,
}: MonetaryValueInputProps) {
  const [displayValue, setDisplayValue] = useState(value || '');

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Se o usuário deletou tudo, limpa o valor
    if (!inputValue || inputValue === 'R$ ') {
      setDisplayValue('');
      onValueChange('', 0);
      return;
    }

    // Aplica formatação
    const formatted = formatCurrency(inputValue);
    const numericValue = parseValue(formatted);

    // Valida valor mínimo
    if (numericValue >= min) {
      setDisplayValue(formatted);
      onValueChange(formatted, numericValue);
    }
  }, [min, onValueChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // Permite: backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].includes(e.keyCode)) {
      return;
    }

    // Permite: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (e.ctrlKey && [65, 67, 86, 88].includes(e.keyCode)) {
      return;
    }

    // Permite apenas números
    if (e.keyCode < 48 || (e.keyCode > 57 && e.keyCode < 96) || e.keyCode > 105) {
      e.preventDefault();
    }
  }, []);

  return (
    <Input
      value={displayValue}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      fontSize="4xl"
      fontWeight="bold"
      color={{ _light: 'white', _dark: 'gray.900' }}
      textAlign="center"
      border="none"
      bg="transparent"
      _focus={{ boxShadow: 'none', border: 'none', outline: 'none' }}
      _placeholder={{ color: { _light: 'whiteAlpha.700', _dark: 'gray.600' } }}
      data-testid="field-valor"
      autoComplete="off"
      inputMode="numeric"
    />
  );
}