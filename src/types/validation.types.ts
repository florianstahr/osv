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

export interface InternalResult<Data = any> {
  error?: ValidationError;
  value?: Data;
}

export interface Result<Data> {
  error: ValidationError | undefined;
  value: Data | undefined;
  exec: () => Promise<Data>;
}
