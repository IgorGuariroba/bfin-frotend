import { forwardRef } from 'react';
import { Field, NativeSelect } from '@chakra-ui/react';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  helperText?: string;
  isRequired?: boolean;
  children?: React.ReactNode;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, helperText, isRequired, children, ...selectProps }, ref) => {
    return (
      <Field.Root invalid={!!error} required={isRequired}>
        <Field.Label>{label}</Field.Label>
        <NativeSelect.Root>
          <NativeSelect.Field
            ref={ref}
            {...selectProps}
            bg="brand.500"
            borderColor="brand.500"
            borderWidth="1px"
            borderRadius="lg"
            color="white"
            px={4}
            py={2}
            _hover={{ bg: "brand.600" }}
            _focus={{ borderColor: "brand.600", boxShadow: "none" }}
          >
            {children}
          </NativeSelect.Field>
          <NativeSelect.Indicator color="white" />
        </NativeSelect.Root>
        {error && <Field.ErrorText>{error}</Field.ErrorText>}
        {helperText && !error && <Field.HelperText>{helperText}</Field.HelperText>}
      </Field.Root>
    );
  }
);

FormSelect.displayName = 'FormSelect';
