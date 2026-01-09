import { ReactNode } from 'react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ColorModeProvider } from './color-mode';
import { AuthProvider } from '../../contexts/AuthContext';
import { ColorModeSync } from '../ColorModeSync';
import { Toaster } from './toaster';
import { ConfirmDialog } from './ConfirmDialog';

// Re-export defaultSystem for convenience
export { defaultSystem };

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

interface ProviderProps {
  children: ReactNode;
}

export function Provider({ children, ...props }: ProviderProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...props}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <ColorModeSync />
            <AuthProvider>
              {children}
            </AuthProvider>
            <Toaster />
            <ConfirmDialog />
          </BrowserRouter>
        </QueryClientProvider>
      </ColorModeProvider>
    </ChakraProvider>
  );
}
