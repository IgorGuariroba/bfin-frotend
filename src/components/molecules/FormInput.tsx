import { ReactNode, forwardRef } from 'react';
import { Box, Input, InputProps, Field } from '@chakra-ui/react';

interface FormInputProps extends InputProps {
  icon?: ReactNode;
  error?: string;
  label?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ icon, error, label, ...inputProps }, ref) => {
    return (
      <Field.Root invalid={!!error}>
        {label && (
          <Field.Label fontSize="sm" color="var(--muted-foreground)" mb={2}>
            {label}
          </Field.Label>
        )}
        <Box position="relative">
          {icon && (
            <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" zIndex={1}>
              {icon}
            </Box>
          )}
          <Input
            ref={ref}
            pl={icon ? 10 : 4}
            borderColor="var(--border)"
            borderRadius="full"
            _focus={{
              borderColor: 'var(--primary)',
              boxShadow: '0 0 0 1px var(--primary)',
            }}
            {...inputProps}
          />
        </Box>
        {error && <Field.ErrorText>{error}</Field.ErrorText>}
      </Field.Root>
    );
  }
);