import * as Base from './base.schema-types.types';

export interface Options extends Base.Options {
  allowNull?: boolean;
  empty?: boolean;
  oneOf?: string[];
  regex?: RegExp;
  length?: number;
  minLength?: number;
  maxLength?: number;
}
