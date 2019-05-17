import BaseSchemaType, { InternalValidationResult } from './base.schema-type';
import { BooleanSchemaTypeOptions } from './types';
import { DeepPartial } from '../helpers.types';

class BooleanSchemaType<Data> extends BaseSchemaType<Data, BooleanSchemaTypeOptions> {
  public static validationErrorCodes = {
    REQUIRED_BUT_MISSING: 'boolean/required-but-missing',
    NOT_OF_TYPE: 'boolean/not-of-type',
  };

  public constructor(options: BooleanSchemaTypeOptions = {}) {
    super(options);
  }

  protected _validateWithOptions = (
    value: any, data: DeepPartial<Data>, path: string[],
  ): InternalValidationResult<any> => {
    if (this._checkRequired(value, data) && typeof value !== 'boolean') {
      return this._validateError(BooleanSchemaType.validationErrorCodes.REQUIRED_BUT_MISSING, {
        value,
        path,
      });
    }

    if (value !== undefined) {
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
