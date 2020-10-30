import BaseSchemaType from './base.schema-type';
import InternalTypeRef from '../types/internal.type-ref';

class RecordSchemaType extends BaseSchemaType<InternalTypeRef.SchemaTypes.Record.Options> {
  public static validationErrorCodes = {
    REQUIRED_BUT_MISSING: 'record/required-but-missing',
    NOT_OF_TYPE: 'record/not-of-type',
    NULL_NOT_ALLOWED: 'record/null-not-allowed',
    INVALID_KEY: 'record/invalid-key',
    NULL_KEY_VALUE_NOT_ALLOWED: 'record/null-key-value-not-allowed',
  };

  public constructor(options: InternalTypeRef.SchemaTypes.Record.Options) {
    super(options);
  }

  protected _validateWithOptions = (
    value: any,
    data: any,
    path: string[],
    check: InternalTypeRef.Schema.ValidationCheckOptions,
  ): InternalTypeRef.Validation.Result => {
    const {
      keys: keysValidator, values: valuesValidator, allowNull, allowNullValues,
    } = this._options;

    if (this._checkRequired(value, data) && value === undefined) {
      return this._validateError(RecordSchemaType.validationErrorCodes.REQUIRED_BUT_MISSING, {
        value,
        path,
      });
    }

    if (value !== undefined) {
      if (allowNull && value === null) {
        return { value };
      }

      if (!allowNull && value === null) {
        return this._validateError(RecordSchemaType.validationErrorCodes.NULL_NOT_ALLOWED, {
          value,
          path,
        });
      }

      if (typeof value !== 'object') {
        return this._validateError(RecordSchemaType.validationErrorCodes.NOT_OF_TYPE, {
          value,
          path,
        });
      }

      const keys = Object.keys(value);

      let validationResult: InternalTypeRef.Validation.Result;

      const result: Record<string, any> = {};

      for (let i = 0; i < keys.length; i += 1) {
        if (Array.isArray(keysValidator)) {
          if (keysValidator.indexOf(keys[i]) === -1) {
            return this._validateError(RecordSchemaType.validationErrorCodes.INVALID_KEY, {
              value,
              path: [...path, keys[i]],
            });
          }
        } else if (keysValidator) {
          validationResult = keysValidator.validate(
            keys[i],
            data,
            [...path, keys[i]],
            {},
          );

          if (validationResult.error) {
            return this._validateError(RecordSchemaType.validationErrorCodes.INVALID_KEY, {
              value,
              path: [...path, keys[i]],
            });
          }
        }

        if (value[keys[i]] === null) {
          if (!allowNullValues) {
            return this._validateError(
              RecordSchemaType.validationErrorCodes.NULL_KEY_VALUE_NOT_ALLOWED,
              {
                value,
                path: [...path, keys[i]],
              },
            );
          }

          result[keys[i]] = null;
        } else {
          validationResult = valuesValidator.validateSync(value[keys[i]], { check });

          if (validationResult.error) {
            return this._validateError(validationResult.error.code, {
              value: validationResult.error.value,
              path: validationResult.error.path ? [
                ...path,
                keys[i],
                ...validationResult.error.path.split('.'),
              ] : [
                ...path,
                keys[i],
              ],
            });
          }

          result[keys[i]] = validationResult.value;
        }
      }

      return {
        value: result,
      };
    }

    return { value };
  };
}

export default RecordSchemaType;
