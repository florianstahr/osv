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
  min?: number;
  max?: number;
  length?: number;
}

export type BooleanSchemaTypeOptions = BaseSchemaTypeOptions;

export interface NumberSchemaTypeOptions extends BaseSchemaTypeOptions {
  min?: number;
  max?: number;
  greater?: number;
  less?: number;
  integer?: boolean;
  positive?: boolean;
  negative?: boolean;
}

export interface StringSchemaTypeOptions extends BaseSchemaTypeOptions {
  empty?: boolean;
  oneOf?: string[];
  regex?: RegExp;
  length?: number;
  minLength?: number;
  maxLength?: number;
}
