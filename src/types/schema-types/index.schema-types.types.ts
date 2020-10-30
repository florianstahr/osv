import * as Array from './array.schema-types.types';
import * as Base from './base.schema-types.types';
import * as Boolean from './boolean.schema-types.types';
import * as Custom from './custom.schema-types.types';
import * as Number from './number.schema-types.types';
import * as Optional from './optional.schema-types.types';
import * as Record from './record.schema-types.types';
import * as String from './string.schema-types.types';
import * as Union from './union.schema-types.types';
import BaseSchemaType from '../../schema-types/base.schema-type';

type CreateTypeValidatorWithOptions<Options extends Base.Options,
  TypeValidator extends BaseSchemaType<Options>> = (
    options: Options,
  ) => TypeValidator;

type CreateTypeValidatorWithOptionalOptions<Options extends Base.Options,
  TypeValidator extends BaseSchemaType<Options>> = (
    options?: Options,
  ) => TypeValidator;

export type CreateTypeValidator<Options extends Base.Options,
  TypeValidator extends BaseSchemaType<Options>,
  OptionalOptions extends boolean = false> = OptionalOptions extends true
    ? CreateTypeValidatorWithOptionalOptions<Options, TypeValidator>
    : CreateTypeValidatorWithOptions<Options, TypeValidator>;

export {
  Array,
  Base,
  Boolean,
  Custom,
  Number,
  Optional,
  Record,
  String,
  Union,
};
