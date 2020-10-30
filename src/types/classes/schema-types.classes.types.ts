import ArraySchemaType from '../../schema-types/array.schema-type';
import BaseSchemaType from '../../schema-types/base.schema-type';
import * as SchemaTypes from '../schema-types/index.schema-types.types';
import BooleanSchemaType from '../../schema-types/boolean.schema-type';
import CustomSchemaType from '../../schema-types/custom.schema-type';
import NumberSchemaType from '../../schema-types/number.schema-type';
import OptionalSchemaType from '../../schema-types/optional.schema-type';
import RecordSchemaType from '../../schema-types/record.schema-type';
import StringSchemaType from '../../schema-types/string.schema-type';
import UnionSchemaType from '../../schema-types/union.schema-type';

export type Array = ArraySchemaType;
export type Base<Options extends SchemaTypes
  .Base.Options = SchemaTypes.Base.Options> = BaseSchemaType<Options>;
export type Boolean = BooleanSchemaType;
export type Custom = CustomSchemaType;
export type Number = NumberSchemaType;
export type Optional = OptionalSchemaType;
export type Record = RecordSchemaType;
export type String = StringSchemaType;
export type Union = UnionSchemaType;
