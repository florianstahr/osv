import * as Classes from './classes/index.classes.types';

import {
  Helpers,
  Schema,
  SchemaTypes,
  Validation,
} from './index.types';
import ObjectSchema from '../schema';
import ArraySchemaType from '../schema-types/array.schema-type';
import BooleanSchemaType from '../schema-types/boolean.schema-type';
import CustomSchemaType from '../schema-types/custom.schema-type';
import NumberSchemaType from '../schema-types/number.schema-type';
import OptionalSchemaType from '../schema-types/optional.schema-type';
import StringSchemaType from '../schema-types/string.schema-type';
import UnionSchemaType from '../schema-types/union.schema-type';

export interface Exposed {
  schema: <Data>(definition: Schema.Definition<Data>) => Classes.ObjectSchema<Data>;

  // schema types
  array: SchemaTypes.CreateTypeValidator<SchemaTypes.Array.Options, Classes.SchemaTypes.Array>;
  boolean: SchemaTypes.CreateTypeValidator<SchemaTypes.Boolean.Options, Classes
    .SchemaTypes.Boolean, true>;
  custom: SchemaTypes.CreateTypeValidator<SchemaTypes.Custom.Options, Classes.SchemaTypes.Custom>;
  number: SchemaTypes.CreateTypeValidator<SchemaTypes.Number.Options, Classes
    .SchemaTypes.Number, true>;
  optional: SchemaTypes
    .CreateTypeValidator<SchemaTypes.Optional.Options, Classes.SchemaTypes.Optional>;
  string: SchemaTypes.CreateTypeValidator<SchemaTypes.String.Options, Classes
    .SchemaTypes.String, true>;
  union: SchemaTypes.CreateTypeValidator<SchemaTypes.Union.Options, Classes.SchemaTypes.Union>;

  // other
  helpers: Helpers.Exposed;
  validationErrorCodes: typeof ObjectSchema.validationErrorCodes & {
    array: typeof ArraySchemaType.validationErrorCodes;
    boolean: typeof BooleanSchemaType.validationErrorCodes;
    custom: typeof CustomSchemaType.validationErrorCodes;
    number: typeof NumberSchemaType.validationErrorCodes;
    optional: typeof OptionalSchemaType.validationErrorCodes;
    string: typeof StringSchemaType.validationErrorCodes;
    union: typeof UnionSchemaType.validationErrorCodes;
  };
}

export {
  Classes,
  Helpers,
  Schema,
  SchemaTypes,
  Validation,
};
