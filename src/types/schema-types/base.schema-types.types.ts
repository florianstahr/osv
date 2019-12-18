import { DeepPartial } from '../../helpers.types';

export type RequiredSchemaTypeCallback = <Data = any>(
  value: any, data: DeepPartial<Data>,
) => boolean;

export interface Options {
  required?: boolean | RequiredSchemaTypeCallback;
  pre?: {
    validate?: <Data = any>(value: any, data: DeepPartial<Data>) => any;
  };
  post?: {
    validate?: <Data = any>(value: any, data: DeepPartial<Data>) => any;
  };
}
