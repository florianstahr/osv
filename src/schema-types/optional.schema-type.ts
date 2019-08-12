/* eslint-disable no-await-in-loop,no-loop-func */
import BaseSchemaType, { InternalValidationResult } from './base.schema-type';
import { OptionalSchemaTypeOptions } from './types';
import { DeepPartial } from '../helpers.types';

class OptionalSchemaType<Data> extends BaseSchemaType<Data, OptionalSchemaTypeOptions> {
  public static validationErrorCodes = {
    REQUIRED_BUT_MISSING: 'optional/required-but-missing',
    NULL_NOT_ALLOWED: 'optional/null-not-allowed',
    ITEM_SCHEMA_MISSING: 'optional/item-schema-missing',
  };

  protected _validateWithOptions = (
    value: any, data: DeepPartial<Data>, path: string[],
    check: { whitelist?: string[]; blacklist?: string[] },
  ): InternalValidationResult<any> => {
    const {
      allowNull, item,
    } = this._options;

    // allowNull: allow value to be null
    // item: ObjectSchema for item

    if (this._checkRequired(value, data) && !value) {
      return this._validateError(OptionalSchemaType.validationErrorCodes.REQUIRED_BUT_MISSING, {
        value,
        path,
      });
    }

    if (value !== undefined) {
      if (allowNull && value === null) {
        return { value };
      }

      if (!allowNull && value === null) {
        return this._validateError(OptionalSchemaType.validationErrorCodes.NULL_NOT_ALLOWED, {
          value,
          path,
        });
      }

      if (!item) {
        return this._validateError(OptionalSchemaType.validationErrorCodes.ITEM_SCHEMA_MISSING, {
          value,
          path,
        });
      }

      const validatedItem: InternalValidationResult<any> = item.validate(value, {
        check,
      });

      if (validatedItem.error) {
        return this._validateError(validatedItem.error.code, {
          value: validatedItem.error.value,
          path: validatedItem.error.path ? [
            ...path,
            ...validatedItem.error.path.split('.'),
          ] : [],
        });
      }

      return {
        value: validatedItem.value,
      };
    }

    return { value };
  };
}

export default OptionalSchemaType;
