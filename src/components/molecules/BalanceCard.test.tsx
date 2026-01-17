import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BalanceCard } from './BalanceCard';
import { ChakraProvider } from '@chakra-ui/react';
import { system } from '../../theme/theme';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ChakraProvider value={system}>
      {ui}
    </ChakraProvider>
  );
};

describe('BalanceCard', () => {
  it('should render label and formatted amount correctly', () => {
    renderWithTheme(<BalanceCard label="Saldo Total" amount={1250.50} variant="total" />);
    
    expect(screen.getByText('Saldo Total')).toBeDefined();
    // Check for formatted currency. Note: The exact space/format might depend on locale.
    // Assuming pt-BR from the component code.
    // "R$ 1.250,50"
    // Using regex or partial match is safer.
    expect(screen.getByText(/1\.250,50/)).toBeDefined();
  });
});
