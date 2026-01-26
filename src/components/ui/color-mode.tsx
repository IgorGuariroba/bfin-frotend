import { ThemeProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';

export function ColorModeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="chakra-ui-color-mode"
      {...props}
    >
      {children}
    </ThemeProvider>
  );
}
