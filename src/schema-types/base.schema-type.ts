import { BaseSchemaTypeOptions } from './types';
import { DeepPartial } from '../helpers.types';

export interface ValidationErrorArgs {
  code: string;
  value?: any;
  path?: string[];
}

class ValidationError extends Error {
  public code: string;

  public value: any;

  public path: string | undefined;

  public constructor({ code, value = undefined, path }: ValidationErrorArgs) {
    super(`There was an error while validating: ${code}`);
    this.code = code;
    this.value = value;
    this.path = path ? path.join('.') : undefined;
  }
}

export interface ValidationErrorOpts {
  value?: any;
  path: string[];
}

class BaseSchemaType<Data, Options extends BaseSchemaTypeOptions = BaseSchemaTypeOptions> {
  protected _options: Options;

  public static ValidationError = ValidationError;

  public constructor(options: Options) {
    this._options = options;
  }

  public validate = (value: any, data: DeepPartial<Data>, path: string[]): Promise<Data> => {
    const val = this._preValidate(value, data);

    return this._validateWithOptions(val, data, path)
      .then(result => Promise.resolve(this._postValidate(result, data)));
  };

  protected _preValidate = (value: any, data: DeepPartial<Data>) => {
    const {
      pre,
    } = this._options;

    if (pre && typeof pre.validate === 'function') {
      return pre.validate<DeepPartial<Data>>(value, data);
    }
    return value;
  };

  protected _validateWithOptions = (
    value: any, data: DeepPartial<Data>, path: string[],
  ) => Promise.resolve(value);

  protected _postValidate = (value: any, data: DeepPartial<Data>) => {
    const {
      post,
    } = this._options;

    if (post && typeof post.validate === 'function') {
      return post.validate<DeepPartial<Data>>(value, data);
    }
    return value;
  };

  protected _validateError = (
    code: string, opts: ValidationErrorOpts,
  ): Promise<never> => Promise.reject(new ValidationError({
    code,
    ...opts,
  }));

  protected _checkRequired = (
    value: any, data: DeepPartial<Data>,
  ): boolean => {
    const { required } = this._options;

    return (
      typeof required === 'function' && required(value, data))
      || (typeof required === 'boolean' && required
      );
  };
}

export {
  ValidationError,
};

export default BaseSchemaType;
