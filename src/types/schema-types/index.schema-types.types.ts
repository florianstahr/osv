import * as Array from './array.schema-types.types';
import * as Base from './base.schema-types.types';
import * as Boolean from './boolean.schema-types.types';
import * as Number from './number.schema-types.types';
import * as Optional from './optional.schema-types.types';
import * as String from './string.schema-types.types';
import * as Union from './union.schema-types.types';
import BaseSchemaType from '../../schema-types/base.schema-type';

export type CreateTypeValidator<Options extends Base.Options,
  TypeValidator extends BaseSchemaType<Options>> = (
    options: Options,
  ) => TypeValidator;

export {
  Array,
  Base,
  Boolean,
  Number,
  Optional,
  String,
  Union,
};
