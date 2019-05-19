import BaseSchemaType, { InternalValidationResult } from './base.schema-type';
import { StringSchemaTypeOptions } from './types';
import { DeepPartial } from '../helpers.types';

class StringSchemaType<Data> extends BaseSchemaType<Data, StringSchemaTypeOptions> {
  public static validationErrorCodes = {
    REQUIRED_BUT_MISSING: 'string/required-but-missing',
    NOT_OF_TYPE: 'string/not-of-type',
    NULL_NOT_ALLOWED: 'array/null-not-allowed',
    NOT_EMPTY: 'string/not-empty',
    NOT_ALLOWED: 'string/not-allowed',
    REGEX_FAILED: 'string/regex-failed',
    LENGTH_NOT_ALLOWED: 'string/length-not-allowed',
    TOO_SHORT: 'string/too-short',
    TOO_LONG: 'string/too-long',
  };

  public constructor(options: StringSchemaTypeOptions = {}) {
    super(options);
  }

  protected _validateWithOptions = (
    value: any, data: DeepPartial<Data>, path: string[],
  ): InternalValidationResult<any> => {
    const {
      allowNull, empty = true, oneOf, regex, length, minLength, maxLength,
    } = this._options;

    // allowNull: allow value to be null
    // empty: value is allowed to have a length of 0
    // oneOf: value is allowed to be one of values
    // regex: value has to match regex
    // length: value has to be of length
    // minLength: value has to be longer than minLength
    // maxLength: value has to be shorter than maxLength

    if (this._checkRequired(value, data) && typeof value !== 'string') {
      return this._validateError(StringSchemaType.validationErrorCodes.REQUIRED_BUT_MISSING, {
        value,
        path,
      });
    }

    if (value !== undefined) {
      if (allowNull && value === null) {
        return { value };
      }

      if (!allowNull && value === null) {
        return this._validateError(StringSchemaType.validationErrorCodes.NULL_NOT_ALLOWED, {
          value,
          path,
        });
      }

      if (typeof value !== 'string') {
        return this._validateError(StringSchemaType.validationErrorCodes.NOT_OF_TYPE, {
          value,
          path,
        });
      }

      if (!empty && value.length === 0) {
        return this._validateError(StringSchemaType.validationErrorCodes.NOT_EMPTY, {
          value,
          path,
        });
      }

      if (oneOf && Array.isArray(oneOf) && oneOf.indexOf(value) === -1) {
        return this._validateError(StringSchemaType.validationErrorCodes.NOT_ALLOWED, {
          value,
          path,
        });
      }

      if (regex && !regex.test(value)) {
        return this._validateError(StringSchemaType.validationErrorCodes.REGEX_FAILED, {
          value,
          path,
        });
      }

      if (length && !Number.isNaN(length) && value.length !== length) {
        return this._validateError(StringSchemaType.validationErrorCodes.LENGTH_NOT_ALLOWED, {
          value,
          path,
        });
      }

      if (minLength && !Number.isNaN(minLength) && value.length < minLength) {
        return this._validateError(StringSchemaType.validationErrorCodes.TOO_SHORT, {
          value,
          path,
        });
      }

      if (maxLength && !Number.isNaN(maxLength) && value.length > maxLength) {
        return this._validateError(StringSchemaType.validationErrorCodes.TOO_LONG, {
          value,
          path,
        });
      }
    }

    return { value };
  };
}

export default StringSchemaType;
