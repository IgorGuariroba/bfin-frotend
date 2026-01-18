import { forwardRef } from 'react';
import { Field, NativeSelect } from '@chakra-ui/react';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children?: React.ReactNode;
  // Permite passar props do Chakra
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; 
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, helperText, required, children, ...selectProps }, ref) => {
    return (
      <Field.Root invalid={!!error} required={required}>
        <Field.Label>{label}</Field.Label>
        <NativeSelect.Root>
          <NativeSelect.Field
            ref={ref}
            {...selectProps}
            px={4}
            py={2}
          >
            {children}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
        {error && <Field.ErrorText>{error}</Field.ErrorText>}
        {helperText && !error && <Field.HelperText>{helperText}</Field.HelperText>}
      </Field.Root>
    );
  }
);

FormSelect.displayName = 'FormSelect';
