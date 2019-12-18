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

type CreateTypeValidator<Options extends InternalTypeRef.SchemaTypes.Base.Options,
  TypeValidator extends BaseSchemaType<Options>> = <Data = any>(
    options: Options,
  ) => TypeValidator;

export interface CreateTypeValidators {
  createArrayTypeValidator: CreateTypeValidator<InternalTypeRef.SchemaTypes
    .Array.Options, ArraySchemaType>;
  createBaseTypeValidator: CreateTypeValidator<InternalTypeRef.SchemaTypes
    .Base.Options, BaseSchemaType>;
  createBooleanTypeValidator: CreateTypeValidator<InternalTypeRef.SchemaTypes
    .Boolean.Options, BooleanSchemaType>;
  createNumberTypeValidator: CreateTypeValidator<InternalTypeRef.SchemaTypes
    .Number.Options, NumberSchemaType>;
  createOptionalTypeValidator: CreateTypeValidator<InternalTypeRef.SchemaTypes
    .Optional.Options, OptionalSchemaType>;
  createStringTypeValidator: CreateTypeValidator<InternalTypeRef.SchemaTypes
    .String.Options, StringSchemaType>;
  createUnionTypeValidator: CreateTypeValidator<InternalTypeRef.SchemaTypes
    .Union.Options, UnionSchemaType>;
}

const createTypes: CreateTypeValidators = {
  createArrayTypeValidator: (options) => new ArraySchemaType(options),
  createBaseTypeValidator: (options) => new BaseSchemaType(options),
  createBooleanTypeValidator: (options) => new BooleanSchemaType(options),
  createNumberTypeValidator: (options) => new NumberSchemaType(options),
  createOptionalTypeValidator: (options) => new OptionalSchemaType(options),
  createStringTypeValidator: (options) => new StringSchemaType(options),
  createUnionTypeValidator: (options) => new UnionSchemaType(options),
};

export {
  createTypes,
};

export default SchemaTypes;
