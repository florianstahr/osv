/* eslint-disable no-await-in-loop,no-loop-func */
import BaseSchemaType from './base.schema-type';
import InternalTypeRef from '../types/internal.type-ref';

class UnionSchemaType extends BaseSchemaType<InternalTypeRef.SchemaTypes.Union.Options> {
  public static validationErrorCodes = {
    REQUIRED_BUT_MISSING: 'union/required-but-missing',
    NULL_NOT_ALLOWED: 'union/null-not-allowed',
    SCHEMA_MISSING: 'union/schema-missing',
    ALL_SCHEMAS_INVALID: 'union/all-schemas-invalid',
  };

  protected _validateWithOptions = (
    value: any,
    data: any,
    path: string[],
    check: { whitelist?: string[]; blacklist?: string[] },
  ): InternalTypeRef.Validation.Result => {
    const {
      allowNull, schemas, resolve,
    } = this._options;

    // allowNull: allow value to be null
    // schemas: array of ObjectSchemas which to use for validation
    // resolve: get index of schema in schemas array to use for validation. otherwise all
    //          schemas are tried.

    if (this._checkRequired(value, data) && !value) {
      return this._validateError(UnionSchemaType.validationErrorCodes.REQUIRED_BUT_MISSING, {
        value,
        path,
      });
    }

    if (value !== undefined) {
      if (allowNull && value === null) {
        return { value };
      }

      if (!allowNull && value === null) {
        return this._validateError(UnionSchemaType.validationErrorCodes.NULL_NOT_ALLOWED, {
          value,
          path,
        });
      }

      if (!schemas.length) {
        return this._validateError(UnionSchemaType.validationErrorCodes.SCHEMA_MISSING, {
          value,
          path,
        });
      }

      if (resolve) {
        const index = resolve(value);

        if (index === -1 || index >= schemas.length) {
          return this._validateError(UnionSchemaType.validationErrorCodes.SCHEMA_MISSING, {
            value,
            path,
          });
        }

        const validatedItem: InternalTypeRef.Validation.Result = schemas[index]
          .validateSync(value, {
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

      for (let i = 0; i < schemas.length; i += 1) {
        const validatedItem: InternalTypeRef.Validation.Result = schemas[i]
          .validateSync(value, {
            check,
          });

        if (!validatedItem.error) {
          return {
            value: validatedItem.value,
          };
        }
      }

      return this._validateError(UnionSchemaType.validationErrorCodes.ALL_SCHEMAS_INVALID, {
        value,
        path,
      });
    }

    return { value };
  };
}

export default UnionSchemaType;
