import { NumberInput } from '@chakra-ui/react';

interface MonetaryValueInputProps {
  value: string;
  onValueChange: (value: string, valueAsNumber: number) => void;
  placeholder?: string;
  min?: number;
  step?: number;
}

/**
 * Componente padrão para input de valores monetários no header dos formulários.
 * Usado nos formulários de despesa, transferência, pagamento e depósito.
 */
export function MonetaryValueInput({
  value,
  onValueChange,
  placeholder = "R$ 0,00",
  min = 0,
  step = 0.01,
}: MonetaryValueInputProps) {
  return (
    <NumberInput.Root
      locale="pt-BR"
      value={value}
      onValueChange={(details) => onValueChange(details.value, details.valueAsNumber)}
      formatOptions={{ style: 'currency', currency: 'BRL', currencyDisplay: 'symbol' }}
      allowMouseWheel
      step={step}
      min={min}
    >
      <NumberInput.Input
        placeholder={placeholder}
        fontSize="4xl"
        fontWeight="bold"
        color={{ _light: 'white', _dark: 'gray.900' }}
        textAlign="center"
        border="none"
        bg="transparent"
        _focus={{ boxShadow: 'none', border: 'none', outline: 'none' }}
        _placeholder={{ color: { _light: 'whiteAlpha.700', _dark: 'gray.600' } }}
      />
    </NumberInput.Root>
  );
}