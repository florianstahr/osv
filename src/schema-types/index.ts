
import BaseSchemaType from './base.schema-type';
import StringSchemaType from './string.schema-type';
import NumberSchemaType from './number.schema-type';
import BooleanSchemaType from './boolean.schema-type';
import ArraySchemaType from './array.schema-type';

const SchemaTypes = {
  Array: ArraySchemaType,
  Base: BaseSchemaType,
  Boolean: BooleanSchemaType,
  Number: NumberSchemaType,
  String: StringSchemaType,
};

export default SchemaTypes;
