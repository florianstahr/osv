
import BaseSchemaType from './base.schema-type';
import StringSchemaType from './string.schema-type';
import NumberSchemaType from './number.schema-type';
import BooleanSchemaType from './boolean.schema-type';
import ArraySchemaType from './array.schema-type';
import OptionalSchemaType from './optional.schema-type';

const SchemaTypes = {
  Array: ArraySchemaType,
  Base: BaseSchemaType,
  Boolean: BooleanSchemaType,
  Optional: OptionalSchemaType,
  Number: NumberSchemaType,
  String: StringSchemaType,
};

export default SchemaTypes;
