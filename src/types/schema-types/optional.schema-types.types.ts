import * as Base from './base.schema-types.types';
import ObjectSchema from '../../schema';

export interface Options<Data = any> extends Base.Options {
  item: ObjectSchema<Data>;
  allowNull?: boolean;
}
