import ObjectSchema from '../schema';

export type RequiredSchemaTypeCallback = <D = any>(value: any, data: D) => boolean;

export interface BaseSchemaTypeOptions {
  required?: boolean | RequiredSchemaTypeCallback;
  pre?: {
    validate?: <D = any>(value: any, data: D) => any;
  };
  post?: {
    validate?: <D = any>(value: any, data: D) => any;
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
