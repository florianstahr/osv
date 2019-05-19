/* eslint-disable no-param-reassign,@typescript-eslint/array-type */
import BaseSchemaType, {
  InternalValidationResult, ValidationError,
  ValidationResult,
} from './schema-types/base.schema-type';
import SchemaTypes from './schema-types';

export type Validator<Data> = BaseSchemaType<Data> | ObjectSchema<Data>;

export interface SchemaDefinitionObject<Data> {
  [path: string]: SchemaDefinitionObject<Data> | Validator<Data>;
}

export type SchemaDefinition<Data> = SchemaDefinitionObject<Data> | Validator<Data>;

export interface SchemaPath<Data> {
  path: string;
  validator: Validator<Data>;
}

export interface SchemaValidateArgs<Data> {
  value: any;
  data: any;
  schema: SchemaDefinition<Data> | Validator<Data>;
  path: string[];
}

class ObjectSchema<Data> {
  protected _original: SchemaDefinition<Data>;

  protected _parsedTree: SchemaDefinition<Data>;

  protected _paths: SchemaPath<Data>[] = [];

  public static Types = SchemaTypes;

  public static validationErrorCodes = {
    UNKNOWN: 'schema/unknown',
  };

  public constructor(definition: SchemaDefinition<Data>) {
    this._original = definition;

    this._parsedTree = this._parseSchemaDefinition(definition);
  }

  public validate = (value: any): ValidationResult<Data> => {
    const result = this._validate({
      value,
      data: value,
      schema: this._parsedTree,
      path: [],
    });

    if (result !== null) {
      return this._makeValidationResult(result);
    }

    return this._makeValidationResult({
      error: new ValidationError({
        code: ObjectSchema.validationErrorCodes.UNKNOWN,
      }),
    });
  };

  public isValidValidator = (validator: any): boolean => validator instanceof SchemaTypes.Base
    || validator instanceof ObjectSchema;

  public getParsedTree = (): SchemaDefinition<Data> => this._parsedTree;

  protected _parseSchemaDefinition = (
    schema: SchemaDefinition<Data>, path: string[] = [],
  ): SchemaDefinition<Data> => {
    if (this.isValidValidator(schema)) {
      this._paths.push({
        path: path.join('.'),
        validator: schema as Validator<Data>,
      });
      return schema;
    }

    if (typeof schema === 'object') {
      const parsed: SchemaDefinitionObject<Data> = {};
      Object.keys(schema).forEach((schemaKey) => {
        const nestedParsed = this._parseSchemaDefinition(
          (schema as SchemaDefinitionObject<Data>)[schemaKey] as SchemaDefinition<Data>,
          [...path, schemaKey],
        );

        if (
          (typeof nestedParsed === 'object' && Object.keys(nestedParsed).length)
          || this.isValidValidator(nestedParsed)
        ) {
          parsed[schemaKey] = nestedParsed;
        }
      });
      return parsed;
    }

    return {};
  };

  protected _validate = (
    {
      value, data, schema, path,
    }: SchemaValidateArgs<Data>,
  ): InternalValidationResult<any> | null => {
    if (schema instanceof BaseSchemaType) {
      return schema.validate(value, data, path);
    }

    if (schema instanceof ObjectSchema) {
      const validationResult = schema.validate(value);
      return {
        value: validationResult.value,
        error: validationResult.error,
      };
    }

    if (typeof schema === 'object') {
      const validated: { [key: string]: any } = {};

      const keys = Object.keys(schema);

      for (let i = 0; i < keys.length; i += 1) {
        const result = this._validate({
          value: value && value[keys[i]] ? value[keys[i]] : undefined,
          data,
          schema: schema[keys[i]],
          path: [...path, keys[i]],
        });

        if (result === null || (result && result.error)) {
          return result;
        }

        validated[keys[i]] = result.value;
      }

      return { value: validated };
    }

    return null;
  };

  protected _makeValidationResult = (
    result: InternalValidationResult<Data>,
  ): ValidationResult<Data> => ({
    error: result.error,
    value: result.value,
    exec: (): Promise<Data> => (result.error
      ? Promise.reject(result.error) : Promise.resolve<Data>(result.value as Data)),
  });
}

export default ObjectSchema;
