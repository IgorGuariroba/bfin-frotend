// Enhanced form management system
export { FORM_REGISTRY, isValidFormType, getFormConfig } from './FormRegistry';
export { ExpandedFormRenderer } from './ExpandedFormRenderer';

// Re-export types for convenience (não re-exporta ExpandedFormType para evitar conflito)
export type { FormConfig } from '../../types/ExpandedForms';
export { EXPANDED_FORMS } from '../../types/ExpandedForms';