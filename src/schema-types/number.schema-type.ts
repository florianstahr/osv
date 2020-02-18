import BaseSchemaType from './base.schema-type';
import InternalTypeRef from '../types/internal.type-ref';

class NumberSchemaType extends BaseSchemaType<InternalTypeRef.SchemaTypes.Number.Options> {
  public static validationErrorCodes = {
    REQUIRED_BUT_MISSING: 'number/required-but-missing',
    NOT_OF_TYPE: 'number/not-of-type',
    NULL_NOT_ALLOWED: 'number/null-not-allowed',
    MIN: 'number/min',
    MAX: 'number/max',
    GREATER: 'number/greater',
    LESS: 'number/less',
    INTEGER: 'number/integer',
    POSITIVE: 'number/positive',
    NEGATIVE: 'number/negative',
  };

  public constructor(options: InternalTypeRef.SchemaTypes.Number.Options = {}) {
    super(options);
  }

  protected _validateWithOptions = (
    value: any,
    data: any,
    path: string[],
  ): InternalTypeRef.Validation.Result => {
    const {
      allowNull, min, max, greater, less, integer, positive, negative,
    } = this._options;

    // allowNull: allow value to be null
    // min: has to be ... at least
    // max: has to be ... at maximum
    // greater: has to be greater than ...
    // less: has to be less than ...
    // integer: has to be an integer
    // positive: has to be positive
    // negative: has to be negative

    if (this._checkRequired(value, data) && typeof value !== 'number') {
      return this._validateError(NumberSchemaType.validationErrorCodes.REQUIRED_BUT_MISSING, {
        value,
        path,
      });
    }

    if (value !== undefined) {
      if (allowNull && value === null) {
        return { value };
      }

      if (!allowNull && value === null) {
        return this._validateError(NumberSchemaType.validationErrorCodes.NULL_NOT_ALLOWED, {
          value,
          path,
        });
      }

      if (Number.isNaN(value)) {
        return this._validateError(NumberSchemaType.validationErrorCodes.NOT_OF_TYPE, {
          value,
          path,
        });
      }

      if (min !== undefined && !Number.isNaN(min) && value < min) {
        return this._validateError(NumberSchemaType.validationErrorCodes.MIN, {
          value,
          path,
        });
      }

      if (max !== undefined && !Number.isNaN(max) && value > max) {
        return this._validateError(NumberSchemaType.validationErrorCodes.MAX, {
          value,
          path,
        });
      }

      if (greater !== undefined && !Number.isNaN(greater) && value <= greater) {
        return this._validateError(NumberSchemaType.validationErrorCodes.GREATER, {
          value,
          path,
        });
      }

      if (less !== undefined && !Number.isNaN(less) && value >= less) {
        return this._validateError(NumberSchemaType.validationErrorCodes.LESS, {
          value,
          path,
        });
      }

      if (integer && !Number.isInteger(value)) {
        return this._validateError(NumberSchemaType.validationErrorCodes.INTEGER, {
          value,
          path,
        });
      }

      if (positive && value <= 0) {
        return this._validateError(NumberSchemaType.validationErrorCodes.POSITIVE, {
          value,
          path,
        });
      }

      if (negative && value >= 0) {
        return this._validateError(NumberSchemaType.validationErrorCodes.NEGATIVE, {
          value,
          path,
        });
      }
    }

    return { value };
  };
}

export default NumberSchemaType;
