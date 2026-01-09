import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';

interface ColorModeProviderProps {
  children: ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ColorModeProvider({
  children,
  attribute = 'class',
  defaultTheme = 'light',
  enableSystem = true,
  disableTransitionOnChange = true,
  ...props
}: ColorModeProviderProps) {
  return (
    <ThemeProvider
      attribute={attribute as any}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
      {...props}
    >
      {children}
    </ThemeProvider>
  );
}
