/* eslint-disable no-param-reassign,@typescript-eslint/array-type */
import BaseSchemaType, {
  InternalValidationResult, ValidationError,
  ValidationResult,
} from './schema-types/base.schema-type';
import SchemaTypes from './schema-types';

export interface ObjectSchemaValidationOptions {
  check?: {
    whitelist?: string[];
    blacklist?: string[];
  };
}

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
  check: {
    whitelist: string[];
    blacklist: string[];
  };
}

const prepareSchemaWhiteAndBlacklistPaths = (
  paths: string[], currentPath: string,
): string[] => {
  const regex = new RegExp(`^${currentPath}`);
  return paths.map((path) => {
    if (!!path && regex.test(path)) {
      return path.replace(regex, '').replace(/^\./, '');
    }
    return '';
  }).filter(path => !!path);
};

const checkWhitelistAndBlacklist = (check: {
  whitelist: string[]; // nur die
  blacklist: string[]; // alles, aber nicht die
}, path: string): {
  check: boolean;
  next: {
    whitelist: string[];
    blacklist: string[];
  };
} => {
  const result: {
    check: boolean;
    next: {
      whitelist: string[];
      blacklist: string[];
    };
  } = {
    check: true,
    next: {
      whitelist: [],
      blacklist: [],
    },
  };

  const pathRegex = new RegExp(`^${path}`);

  if (check.whitelist.length) {
    let isOnWhitelist = false;
    check.whitelist.forEach((keepPath) => {
      if (!isOnWhitelist && pathRegex.test(keepPath)) {
        isOnWhitelist = true;
        if (keepPath !== path) {
          result.next.whitelist.push(keepPath);
        }
      }
    });

    if (!isOnWhitelist) {
      result.check = false;
    }
  } else if (check.blacklist.length) {
    check.blacklist.forEach((omitPath) => {
      if (result.check && pathRegex.test(omitPath)) {
        if (omitPath !== path) {
          result.next.blacklist.push(omitPath);
        } else {
          result.check = false;
        }
      }
    });
  }

  return result;
};

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

  public validate = (
    value: any, options: ObjectSchemaValidationOptions = {},
  ): ValidationResult<Data> => {
    const result = this._validate({
      value,
      data: value,
      schema: this._parsedTree,
      path: [],
      check: {
        whitelist: (options.check && options.check.whitelist
          && prepareSchemaWhiteAndBlacklistPaths(options.check.whitelist, '')) || [],
        blacklist: (options.check && options.check.blacklist
          && prepareSchemaWhiteAndBlacklistPaths(options.check.blacklist, '')) || [],
      },
    });

    if (result !== null) {
      return this._makeValidationResult(result);
    }

    return this._makeValidationResult({
      error: new ValidationError({
        code: ObjectSchema.validationErrorCodes.UNKNOWN,
        path: [],
      }),
    });
  };

  public isValidValidator = (validator: any): boolean => validator instanceof SchemaTypes.Base
    || validator instanceof ObjectSchema;

  public isObjectSchema = (
    value: any,
  ): value is ObjectSchema<Data> => value instanceof ObjectSchema;

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
      value, data, schema, path, check,
    }: SchemaValidateArgs<Data>,
  ): InternalValidationResult<any> | null => {
    if (schema instanceof BaseSchemaType) {
      return schema.validate(value, data, path, {
        whitelist: prepareSchemaWhiteAndBlacklistPaths(check.whitelist, path.join('.')),
        blacklist: prepareSchemaWhiteAndBlacklistPaths(check.blacklist, path.join('.')),
      });
    }

    if (this.isObjectSchema(schema)) {
      const validationResult = (schema as ObjectSchema<Data>).validate(value, {
        check: {
          whitelist: prepareSchemaWhiteAndBlacklistPaths(check.whitelist, path.join('.')),
          blacklist: prepareSchemaWhiteAndBlacklistPaths(check.blacklist, path.join('.')),
        },
      });
      return {
        value: validationResult.value,
        error: validationResult.error ? new ValidationError({
          code: validationResult.error.code,
          value: validationResult.error.value,
          path: validationResult.error.path.length ? [
            ...path,
            ...validationResult.error.path.split('.'),
          ] : path,
        }) : undefined,
      };
    }

    if (typeof schema === 'object') {
      const validated: { [key: string]: any } = {};

      const keys = Object.keys(schema);

      for (let i = 0; i < keys.length; i += 1) {
        const nextPath = [...path, keys[i]];
        const checkWhitelistAndBlacklistResult = checkWhitelistAndBlacklist(check, nextPath.join('.'));

        if (checkWhitelistAndBlacklistResult.check) {
          const result = this._validate({
            value: typeof value === 'object' && value[keys[i]] !== undefined ? value[keys[i]] : undefined,
            data,
            schema: schema[keys[i]],
            path: [...path, keys[i]],
            check: checkWhitelistAndBlacklistResult.next,
          });

          if (result === null || (result && result.error)) {
            return result;
          }

          if (result.value !== undefined) {
            validated[keys[i]] = result.value;
          }
        } else if (value[keys[i]] !== undefined) {
          validated[keys[i]] = value[keys[i]];
        }
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
