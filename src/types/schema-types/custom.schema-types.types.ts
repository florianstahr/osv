import * as Base from './base.schema-types.types';
import * as Schema from '../schema.types';

export interface Options extends Base.Options {
  validate: Schema.ValidateWithOptionsCallback;
}
