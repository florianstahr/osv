import ObjectSchemaClass from '../../schema';
import ValidationErrorClass from '../../validation/error.validation';
import * as SchemaTypes from './schema-types.classes.types';

export type ObjectSchema<Data> = ObjectSchemaClass<Data>;
export type ValidationError = ValidationErrorClass;

export {
  SchemaTypes,
};
