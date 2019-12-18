import InternalTypeRef from '../types/internal.type-ref';

class ValidationError extends Error {
  public code: string;

  public value: any;

  public path: string;

  public constructor(
    { code, value = undefined, path }: InternalTypeRef
      .Validation.ValidationErrorArgs,
  ) {
    super(`There was an error while validating: ${code} [${path.join('.')}]`);
    this.code = code;
    this.value = value;
    this.path = path.join('.');
  }
}

export default ValidationError;
