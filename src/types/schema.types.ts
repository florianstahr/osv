import BaseSchemaType from '../schema-types/base.schema-type';
import ObjectSchema from '../schema';

export interface ValidationOptions {
  check?: {
    whitelist?: string[];
    blacklist?: string[];
  };
}

export type Validator<Data> = BaseSchemaType | ObjectSchema<Data>;

export interface DefinitionObject<Data> {
  [path: string]: DefinitionObject<Data> | Validator<Data>;
}

export type Definition<Data> = DefinitionObject<Data> | Validator<Data>;

export interface Path<Data> {
  path: string;
  validator: Validator<Data>;
}

export interface ValidateInput<Data> {
  value: any;
  data: any;
  schema: Definition<Data> | Validator<Data>;
  path: string[];
  check: {
    whitelist: string[];
    blacklist: string[];
  };
}
