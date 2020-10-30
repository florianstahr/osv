import ObjectSchema from '../../schema';
import * as Base from './base.schema-types.types';
import CustomSchemaType from '../../schema-types/custom.schema-type';
import StringSchemaType from '../../schema-types/string.schema-type';

export interface Options<Data = any> extends Base.Options {
  keys?: CustomSchemaType | StringSchemaType | string[];
  values: ObjectSchema<Data>;
  allowNull?: boolean;
  allowNullValues?: boolean;
}
