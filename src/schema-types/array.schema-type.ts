/* eslint-disable no-await-in-loop,no-loop-func */
import BaseSchemaType, { ValidationError } from './base.schema-type';
import { ArraySchemaTypeOptions } from './types';
import { DeepPartial } from '../helpers.types';

class ArraySchemaType<Data> extends BaseSchemaType<Data, ArraySchemaTypeOptions> {
  public static validationErrorCodes = {
    REQUIRED_BUT_MISSING: 'array/required-but-missing',
    NOT_OF_TYPE: 'array/not-of-type',
    MIN: 'array/too-short',
    MAX: 'array/too-long',
    LENGTH_NOT_ALLOWED: 'array/length-not-allowed',
    ITEM_SCHEMA_MISSING: 'array/item-schema-missing',
  };

  protected _validateWithOptions = (
    value: any, data: DeepPartial<Data>, path: string[],
  ): Promise<any> => {
    const {
      min, max, length, item,
    } = this._options;

    // min: at least ... items
    // max: ... items at maximum
    // length: exact ... items
    // item: ObjectSchema for items

    if (this._checkRequired(value, data) && !Array.isArray(value)) {
      return this._validateError(ArraySchemaType.validationErrorCodes.REQUIRED_BUT_MISSING, {
        value,
        path,
      });
    }

    if (value !== undefined) {
      if (!Array.isArray(value)) {
        return this._validateError(ArraySchemaType.validationErrorCodes.NOT_OF_TYPE, {
          value,
          path,
        });
      }

      if (min && value.length < min) {
        return this._validateError(ArraySchemaType.validationErrorCodes.MIN, {
          value,
          path,
        });
      }

      if (max && value.length > max) {
        return this._validateError(ArraySchemaType.validationErrorCodes.MAX, {
          value,
          path,
        });
      }

      if (length && value.length !== length) {
        return this._validateError(ArraySchemaType.validationErrorCodes.LENGTH_NOT_ALLOWED, {
          value,
          path,
        });
      }

      if (!item) {
        return this._validateError(ArraySchemaType.validationErrorCodes.ITEM_SCHEMA_MISSING, {
          value,
          path,
        });
      }

      return this._validateArrayItems(value, path);
    }

    return Promise.resolve(value);
  };

  protected _validateArrayItems = async (arrayItems: any[], path: string[]): Promise<any[]> => {
    const { item } = this._options;
    const results: any[] = [];
    let error: ValidationError | undefined;
    for (let i = 0; i < arrayItems.length; i += 1) {
      await item.validate(arrayItems[i])
        .then((validatedItem) => {
          results.push(validatedItem);
          return Promise.resolve(true);
        })
        .catch((e) => {
          error = e;
          return Promise.resolve(false);
        });

      if (error) {
        return Promise.reject(new ValidationError({
          code: error.code,
          value: error.value,
          path: error.path ? [...path, i.toString(), ...error.path.split('.')] : undefined,
        }));
      }
    }

    return Promise.resolve(results);
  };
}

export default ArraySchemaType;
