import { forwardRef } from 'react';
import { Field, Input } from '@chakra-ui/react';

export interface MoleculeTemplateProps {
  label: string;
  error?: string;
  placeholder?: string;
}

/**
 * MoleculeTemplate - Combination of atoms, presentation logic only
 */
export const MoleculeTemplate = forwardRef<HTMLInputElement, MoleculeTemplateProps>(
  ({ label, error, placeholder, ...props }, ref) => (
    <Field.Root invalid={!!error}>
      <Field.Label>{label}</Field.Label>
      <Input ref={ref} placeholder={placeholder} {...props} />
      {error && <Field.ErrorText>{error}</Field.ErrorText>}
    </Field.Root>
  )
);

MoleculeTemplate.displayName = 'MoleculeTemplate';
