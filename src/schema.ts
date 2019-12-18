import BaseSchemaType from './schema-types/base.schema-type';
import SchemaTypes, { createTypes, CreateTypeValidators } from './schema-types/index.schema-types';
import InternalTypeRef from './types/internal.type-ref';
import ValidationError from './validation/error.validation';
import Helpers from './helpers';

const prepareSchemaWhiteAndBlacklistPaths = (
  paths: string[], currentPath: string,
): string[] => {
  const regex = new RegExp(`^${currentPath}`);
  return paths.map((path) => {
    if (!!path && regex.test(path)) {
      return path.replace(regex, '').replace(/^\./, '');
    }
    return '';
  }).filter((path): boolean => !!path);
};

const checkWhitelistAndBlacklist = (check: {
  whitelist: string[]; // just them
  blacklist: string[]; // all, but not them
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
  protected _original: InternalTypeRef.Schema.Definition<Data>;

  protected _parsedTree: InternalTypeRef.Schema.Definition<Data>;

  protected _paths: InternalTypeRef.Schema.Path<Data>[] = [];

  // -----------------------------------------------------------------------------------------------
  // constructor

  public constructor(definition: InternalTypeRef.Schema.Definition<Data>) {
    this._original = definition;

    this._parsedTree = this._parseSchemaDefinition(definition);
  }

  // -----------------------------------------------------------------------------------------------
  // public statics

  public static create = <Data>(
    definition: InternalTypeRef.Schema.Definition<Data>,
  ): ObjectSchema<Data> => new ObjectSchema<Data>(definition);

  public static helpers: InternalTypeRef.Helpers.Exposed = Helpers;

  public static Types = SchemaTypes;

  public static validators: CreateTypeValidators = createTypes;

  public static validationErrorCodes = {
    UNKNOWN: 'schema/unknown',
  };

  // -----------------------------------------------------------------------------------------------
  // public methods

  public validate = (
    value: any, options: InternalTypeRef.Schema.ValidationOptions = {},
  ): InternalTypeRef.Validation.Result<Data> => {
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

  public static isValidValidator = (validator: any): boolean => validator
    instanceof SchemaTypes.Base || validator instanceof ObjectSchema;

  public static isObjectSchema = <Data extends any>(
    value: any,
  ): value is ObjectSchema<Data> => value instanceof ObjectSchema;

  protected _parseSchemaDefinition = (
    schema: InternalTypeRef.Schema.Definition<Data>, path: string[] = [],
  ): InternalTypeRef.Schema.Definition<Data> => {
    if (ObjectSchema.isValidValidator(schema)) {
      this._paths.push({
        path: path.join('.'),
        validator: schema as InternalTypeRef.Schema.Validator<Data>,
      });
      return schema;
    }

    if (typeof schema === 'object') {
      const parsed: InternalTypeRef.Schema.DefinitionObject<Data> = {};
      Object.keys(schema).forEach((schemaKey) => {
        const nestedParsed = this._parseSchemaDefinition(
          (schema as InternalTypeRef.Schema
            .DefinitionObject<Data>)[schemaKey] as InternalTypeRef.Schema.Definition<Data>,
          [...path, schemaKey],
        );

        if (
          (typeof nestedParsed === 'object' && Object.keys(nestedParsed).length)
          || ObjectSchema.isValidValidator(nestedParsed)
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
    }: InternalTypeRef.Schema.ValidateInput<Data>,
  ): InternalTypeRef.Validation.InternalResult | null => {
    if (schema instanceof BaseSchemaType) {
      return schema.validate(value, data, path, {
        whitelist: prepareSchemaWhiteAndBlacklistPaths(check.whitelist, path.join('.')),
        blacklist: prepareSchemaWhiteAndBlacklistPaths(check.blacklist, path.join('.')),
      });
    }

    if (ObjectSchema.isObjectSchema<Data>(schema)) {
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
    result: InternalTypeRef.Validation.InternalResult,
  ): InternalTypeRef.Validation.Result<Data> => ({
    error: result.error,
    value: result.value,
    exec: (): Promise<Data> => (result.error
      ? Promise.reject(result.error) : Promise.resolve<Data>(result.value as Data)),
  });
}

export default ObjectSchema;
