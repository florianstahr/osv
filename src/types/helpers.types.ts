import * as Validation from './validation.types';
import ValidationError from '../validation/error.validation';

export interface Exposed {
  createValidationError: (input: Validation.ValidationErrorArgs) => ValidationError;
}
