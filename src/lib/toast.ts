import { toaster } from '../components/ui/toaster';

/**
 * Helper functions para exibir toasts de forma simplificada
 */
export const toast = {
  success: (title: string, description?: string) => {
    toaster.create({
      title,
      description,
      type: 'success',
      meta: { closable: true },
    });
  },

  error: (title: string, description?: string) => {
    toaster.create({
      title,
      description,
      type: 'error',
      meta: { closable: true },
      duration: 5000,
    });
  },

  info: (title: string, description?: string) => {
    toaster.create({
      title,
      description,
      type: 'info',
      meta: { closable: true },
    });
  },

  warning: (title: string, description?: string) => {
    toaster.create({
      title,
      description,
      type: 'warning',
      meta: { closable: true },
    });
  },

  loading: (title: string, description?: string) => {
    return toaster.create({
      title,
      description,
      type: 'loading',
    });
  },
};
