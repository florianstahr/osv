import ValidationError from '../validation/error.validation';

export interface ValidationErrorArgs {
  code: string;
  value?: any;
  path: string[];
}

export interface ErrorOptions {
  value?: any;
  path: string[];
}

export interface Result<Value = any> {
  error?: ValidationError;
  value?: Value;
}
