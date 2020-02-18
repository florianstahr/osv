import BaseSchemaType from './base.schema-type';
import InternalTypeRef from '../types/internal.type-ref';

class CustomSchemaType extends BaseSchemaType<InternalTypeRef.SchemaTypes.Custom.Options> {
  public static validationErrorCodes = {
    REQUIRED_BUT_MISSING: 'custom/required-but-missing',
    FAILED: 'custom/failed',
  };

  public constructor(options: InternalTypeRef.SchemaTypes.Custom.Options) {
    super(options);
  }

  protected _validateWithOptions = (
    value: any,
    data: any,
    path: string[],
    check: InternalTypeRef.Schema.ValidationCheckOptions,
  ): InternalTypeRef.Validation.Result => {
    const { validate } = this._options;

    if (this._checkRequired(value, data) && value === undefined) {
      return this._validateError(CustomSchemaType.validationErrorCodes.REQUIRED_BUT_MISSING, {
        value,
        path,
      });
    }

    if (value !== undefined) {
      return validate(value, data, path, check);
    }

    return { value };
  };
}

export default CustomSchemaType;
