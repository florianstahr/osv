import ObjectSchema from '../../schema';
import * as Base from './base.schema-types.types';

export interface Options<Data = any> extends Base.Options {
  item: ObjectSchema<Data>;
  allowNull?: boolean;
  min?: number;
  max?: number;
  length?: number;
}
