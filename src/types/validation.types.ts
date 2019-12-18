import { ValidationError } from '../schema-types/base.schema-type';

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
