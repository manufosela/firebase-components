import { LitElement, TemplateResult } from 'lit';

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldSchema {
  type: string;
  label?: string;
  required?: boolean;
  default?: unknown;
  placeholder?: string;
  help?: string;
  options?: FieldOption[];
  min?: number;
  max?: number;
  step?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  disabled?: boolean;
  readonly?: boolean;
  group?: string;
}

export type FormSchema = Record<string, FieldSchema>;

export interface FormSubmitDetail {
  data: Record<string, unknown>;
  key: string;
  path: string;
}

export interface FormErrorDetail {
  message: string;
}

export declare class FirebaseAutoform extends LitElement {
  path: string;
  schema: FormSchema;
  submitLabel: string;
  resetLabel: string;
  resetOnSubmit: boolean;
  showSuccess: boolean;
  successMessage: string;
  data: Record<string, unknown> | null;
  dataKey: string;
  disabled: boolean;

  get values(): Record<string, unknown>;
  get isValid(): boolean;

  render(): TemplateResult;
}

declare global {
  interface HTMLElementTagNameMap {
    'firebase-autoform': FirebaseAutoform;
  }

  interface HTMLElementEventMap {
    'form-submit': CustomEvent<FormSubmitDetail>;
    'form-error': CustomEvent<FormErrorDetail>;
    'form-reset': CustomEvent<Record<string, unknown>>;
  }
}
