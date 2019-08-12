import ObjectSchema from '../schema';
import { DeepPartial } from '../helpers.types';

export type RequiredSchemaTypeCallback = <Data = any>(
  value: any, data: DeepPartial<Data>,
) => boolean;

export interface BaseSchemaTypeOptions {
  required?: boolean | RequiredSchemaTypeCallback;
  pre?: {
    validate?: <Data = any>(value: any, data: DeepPartial<Data>) => any;
  };
  post?: {
    validate?: <Data = any>(value: any, data: DeepPartial<Data>) => any;
  };
}

export interface ArraySchemaTypeOptions<Data = any> extends BaseSchemaTypeOptions {
  item: ObjectSchema<Data>;
  allowNull?: boolean;
  min?: number;
  max?: number;
  length?: number;
}

export interface BooleanSchemaTypeOptions extends BaseSchemaTypeOptions {
  allowNull?: boolean;
}

export interface NumberSchemaTypeOptions extends BaseSchemaTypeOptions {
  allowNull?: boolean;
  min?: number;
  max?: number;
  greater?: number;
  less?: number;
  integer?: boolean;
  positive?: boolean;
  negative?: boolean;
}

export interface OptionalSchemaTypeOptions<Data = any> extends BaseSchemaTypeOptions {
  item: ObjectSchema<Data>;
  allowNull?: boolean;
}

export interface StringSchemaTypeOptions extends BaseSchemaTypeOptions {
  allowNull?: boolean;
  empty?: boolean;
  oneOf?: string[];
  regex?: RegExp;
  length?: number;
  minLength?: number;
  maxLength?: number;
}

export interface UnionSchemaTypeOptions<Data = any> extends BaseSchemaTypeOptions {
  schemas: ObjectSchema<Data>[];
  resolve?: (value: any) => number;
  allowNull?: boolean;
}
