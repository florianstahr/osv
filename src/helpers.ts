import InternalTypeRef from './types/internal.type-ref';
import ValidationError from './validation/error.validation';

const Helpers: InternalTypeRef.Helpers.Exposed = {
  createValidationError: (input) => new ValidationError(input),
};

export default Helpers;
