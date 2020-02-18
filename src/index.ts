import ObjectSchema from './schema';
import OSVTypeRef from './types/exposed.type-ref';
import Helpers from './helpers';
import ArraySchemaType from './schema-types/array.schema-type';
import BaseSchemaType from './schema-types/base.schema-type';
import BooleanSchemaType from './schema-types/boolean.schema-type';
import NumberSchemaType from './schema-types/number.schema-type';
import OptionalSchemaType from './schema-types/optional.schema-type';
import StringSchemaType from './schema-types/string.schema-type';
import UnionSchemaType from './schema-types/union.schema-type';
import ValidationError from './validation/error.validation';

const OSV: OSVTypeRef.Exposed = {
  schema: <Data>(
    definition: OSVTypeRef.Schema.Definition<Data>,
  ) => new ObjectSchema<Data>(definition),

  // schema types
  array: (options) => ObjectSchema.validators.createArrayTypeValidator(options),
  boolean: (options) => ObjectSchema.validators.createBooleanTypeValidator(options),
  number: (options) => ObjectSchema.validators.createNumberTypeValidator(options),
  optional: (options) => ObjectSchema.validators.createOptionalTypeValidator(options),
  string: (options) => ObjectSchema.validators.createStringTypeValidator(options),
  union: (options) => ObjectSchema.validators.createUnionTypeValidator(options),

  // other
  helpers: Helpers,
  validationErrorCodes: {
    ...ObjectSchema.validationErrorCodes,
    array: ArraySchemaType.validationErrorCodes,
    boolean: BooleanSchemaType.validationErrorCodes,
    number: NumberSchemaType.validationErrorCodes,
    optional: OptionalSchemaType.validationErrorCodes,
    string: StringSchemaType.validationErrorCodes,
    union: UnionSchemaType.validationErrorCodes,
  },
};

export {
  OSVTypeRef,
  ObjectSchema,

  // schema types
  ArraySchemaType,
  BaseSchemaType,
  BooleanSchemaType,
  NumberSchemaType,
  OptionalSchemaType,
  StringSchemaType,
  UnionSchemaType,

  // other
  ValidationError,
};

export default OSV;
