/* eslint-disable no-param-reassign */
import BaseSchemaType from './schema-types/base.schema-type';
import SchemaTypes from './schema-types';

export type Validator<Data> = BaseSchemaType<Data>;

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

  public static types = SchemaTypes;

  public constructor(definition: SchemaDefinition<Data>) {
    this._original = definition;

    this._parsedTree = this._parseSchemaDefinition(definition);
  }

  public validate = (value: any): Promise<Data> => this._validate({
    value,
    data: value,
    schema: this._parsedTree,
    path: [],
  });

  public isValidValidator = (validator: any): boolean => validator instanceof SchemaTypes.Base;

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
  ): Promise<any> => new Promise((resolve, reject) => {
    if (schema instanceof BaseSchemaType) {
      schema.validate(value, data, path)
        .then((val) => {
          resolve(val);
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    } else if (typeof schema === 'object') {
      const validated: { [key: string]: any } = {};
      Promise.all(Object.keys(schema).map(schemaKey => this._validate({
        value: value && value[schemaKey] ? value[schemaKey] : undefined,
        data,
        schema: schema[schemaKey],
        path: [...path, schemaKey],
      }).then((val) => {
        if (val !== undefined) {
          validated[schemaKey] = val;
        }
      })))
        .then(() => {
          resolve(validated);
        })
        .catch((e) => {
          reject(e);
        });
    }
  });
}

export default ObjectSchema;
