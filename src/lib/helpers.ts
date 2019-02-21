import { validateOrReject, ValidatorOptions, validate } from 'class-validator';
import { plainToClass, ClassTransformOptions } from 'class-transformer';
import { BadRequest } from './errors';

export const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

export interface ClassType<T> {
  new (...args: any[]): T;
}

export interface TransformValidationOptions {
  validator?: ValidatorOptions;
  transformer?: ClassTransformOptions;
}
export async function transformAndValidate<T extends object>(
  classType: ClassType<T>,
  object: object,
  options: TransformValidationOptions = {},
): Promise<T> {
  if (typeof object !== 'object') {
    throw new Error('Incorrect object param type! Only plain object is valid.');
  }
  const validationOptions = options.validator || {};
  validationOptions.validationError = { target: false };
  const classObject = plainToClass(classType, object, options.transformer);
  const errors = await validate(classObject, validationOptions);
  if (errors.length !== 0) {
    throw new BadRequest('Validation error', errors);
  }
  return classObject;
}

export type ThenArg<T> = T extends Promise<infer U> ? U :
  T extends (...args: any[]) => Promise<infer U> ? U :
  T
