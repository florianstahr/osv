import BaseSchemaType from './base.schema-type';
import InternalTypeRef from '../types/internal.type-ref';

class BooleanSchemaType extends BaseSchemaType<InternalTypeRef.SchemaTypes.Boolean.Options> {
  public static validationErrorCodes = {
    REQUIRED_BUT_MISSING: 'boolean/required-but-missing',
    NOT_OF_TYPE: 'boolean/not-of-type',
    NULL_NOT_ALLOWED: 'array/null-not-allowed',
  };

  public constructor(options: InternalTypeRef.SchemaTypes.Boolean.Options = {}) {
    super(options);
  }

  protected _validateWithOptions = (
    value: any, data: any, path: string[],
  ): InternalTypeRef.Validation.InternalResult => {
    const { allowNull } = this._options;

    // allowNull: allow value to be null

    if (this._checkRequired(value, data) && typeof value !== 'boolean') {
      return this._validateError(BooleanSchemaType.validationErrorCodes.REQUIRED_BUT_MISSING, {
        value,
        path,
      });
    }

    if (value !== undefined) {
      if (allowNull && value === null) {
        return { value };
      }

      if (!allowNull && value === null) {
        return this._validateError(BooleanSchemaType.validationErrorCodes.NULL_NOT_ALLOWED, {
          value,
          path,
        });
      }

      if (typeof value !== 'boolean') {
        return this._validateError(BooleanSchemaType.validationErrorCodes.NOT_OF_TYPE, {
          value,
          path,
        });
      }
    }

    return { value };
  };
}

export default BooleanSchemaType;
