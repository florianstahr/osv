import ObjectSchema from '../../schema';
import * as Base from './base.schema-types.types';

export interface Options<Data = any> extends Base.Options {
  schemas: ObjectSchema<Data>[];
  resolve?: (value: any) => number;
  allowNull?: boolean;
}
