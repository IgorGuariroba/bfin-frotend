import { HStack, Text, Checkbox } from '@chakra-ui/react';
import { Clock } from 'lucide-react';

interface ExpenseTypeToggleProps {
  isFixed: boolean;
  onToggle: (isFixed: boolean) => void;
}

export function ExpenseTypeToggle({ isFixed, onToggle }: ExpenseTypeToggleProps) {
  return (
    <HStack justify="space-between" p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg">
      <HStack gap={2}>
        <Clock size={18} color="var(--muted-foreground)" />
        <Text fontSize="sm" fontWeight="medium" color="var(--muted-foreground)">
          É despesa fixa?
        </Text>
      </HStack>
      <Checkbox.Root
        checked={isFixed}
        onCheckedChange={(e) => onToggle(!!e.checked)}
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control />
      </Checkbox.Root>
    </HStack>
  );
}