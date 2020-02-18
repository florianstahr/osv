import BaseSchemaType from './base.schema-type';
import StringSchemaType from './string.schema-type';
import NumberSchemaType from './number.schema-type';
import BooleanSchemaType from './boolean.schema-type';
import ArraySchemaType from './array.schema-type';
import OptionalSchemaType from './optional.schema-type';
import UnionSchemaType from './union.schema-type';
import InternalTypeRef from '../types/internal.type-ref';

const SchemaTypes = {
  Array: ArraySchemaType,
  Base: BaseSchemaType,
  Boolean: BooleanSchemaType,
  Optional: OptionalSchemaType,
  Number: NumberSchemaType,
  String: StringSchemaType,
  Union: UnionSchemaType,
};

export interface CreateTypeValidators {
  createArrayTypeValidator: InternalTypeRef.SchemaTypes
    .CreateTypeValidator<InternalTypeRef.SchemaTypes.Array.Options, ArraySchemaType>;
  createBaseTypeValidator: InternalTypeRef.SchemaTypes
    .CreateTypeValidator<InternalTypeRef.SchemaTypes.Base.Options, BaseSchemaType, true>;
  createBooleanTypeValidator: InternalTypeRef.SchemaTypes
    .CreateTypeValidator<InternalTypeRef.SchemaTypes.Boolean.Options, BooleanSchemaType, true>;
  createNumberTypeValidator: InternalTypeRef.SchemaTypes
    .CreateTypeValidator<InternalTypeRef.SchemaTypes.Number.Options, NumberSchemaType, true>;
  createOptionalTypeValidator: InternalTypeRef.SchemaTypes
    .CreateTypeValidator<InternalTypeRef.SchemaTypes.Optional.Options, OptionalSchemaType>;
  createStringTypeValidator: InternalTypeRef.SchemaTypes
    .CreateTypeValidator<InternalTypeRef.SchemaTypes.String.Options, StringSchemaType, true>;
  createUnionTypeValidator: InternalTypeRef.SchemaTypes
    .CreateTypeValidator<InternalTypeRef.SchemaTypes.Union.Options, UnionSchemaType>;
}

const createTypes: CreateTypeValidators = {
  createArrayTypeValidator: (options) => new ArraySchemaType(options),
  createBaseTypeValidator: (options = {}) => new BaseSchemaType(options),
  createBooleanTypeValidator: (options = {}) => new BooleanSchemaType(options),
  createNumberTypeValidator: (options = {}) => new NumberSchemaType(options),
  createOptionalTypeValidator: (options) => new OptionalSchemaType(options),
  createStringTypeValidator: (options = {}) => new StringSchemaType(options),
  createUnionTypeValidator: (options) => new UnionSchemaType(options),
};

export {
  createTypes,
};

export default SchemaTypes;
