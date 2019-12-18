import * as Base from './base.schema-types.types';

export interface Options extends Base.Options {
  allowNull?: boolean;
  min?: number;
  max?: number;
  greater?: number;
  less?: number;
  integer?: boolean;
  positive?: boolean;
  negative?: boolean;
}
