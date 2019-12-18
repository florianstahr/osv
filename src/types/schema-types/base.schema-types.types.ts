
export type RequiredSchemaTypeCallback = (
  value: any, data: any,
) => boolean;

export interface Options {
  required?: boolean | RequiredSchemaTypeCallback;
  pre?: {
    validate?: <Data = any>(value: any, data: any) => any;
  };
  post?: {
    validate?: <Data = any>(value: any, data: any) => any;
  };
}
