import InternalTypeRef from '../types/internal.type-ref';
import ValidationError from '../validation/error.validation';

class BaseSchemaType<Options extends InternalTypeRef.SchemaTypes
  .Base.Options = InternalTypeRef.SchemaTypes.Base.Options> {
  protected _options: Options;

  public constructor(options: Options) {
    this._options = options;
  }

  public validate = (
    value: any, data: any, path: string[],
    check: { whitelist?: string[]; blacklist?: string[] },
  ): InternalTypeRef.Validation.InternalResult => {
    const val = this._preValidate(value, data);

    const result: InternalTypeRef.Validation.InternalResult = this
      ._validateWithOptions(val, data, path, check);

    if (result.error) {
      return result;
    }

    return {
      ...result,
      value: this._postValidate(result.value, data),
    };
  };

  protected _preValidate = (value: any, data: any) => {
    const {
      pre,
    } = this._options;

    if (pre && typeof pre.validate === 'function') {
      return pre.validate(value, data);
    }
    return value;
  };

  protected _validateWithOptions = (
    value: any, data: any, path: string[],
    check: { whitelist?: string[]; blacklist?: string[] },
  ): InternalTypeRef.Validation.InternalResult => ({ value });

  protected _postValidate = (value: any, data: any) => {
    const {
      post,
    } = this._options;

    if (post && typeof post.validate === 'function') {
      return post.validate(value, data);
    }
    return value;
  };

  protected _validateError = (
    code: string, options: InternalTypeRef.Validation.ErrorOptions,
  ): InternalTypeRef.Validation.InternalResult => ({
    error: new ValidationError({
      code,
      ...options,
    }),
  });

  protected _checkRequired = (
    value: any, data: any,
  ): boolean => {
    const { required } = this._options;

    return (
      typeof required === 'function' && required(value, data))
      || (typeof required === 'boolean' && required
      );
  };
}

export default BaseSchemaType;
