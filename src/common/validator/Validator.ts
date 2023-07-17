import { ValidationResult } from 'joi';

export interface Validator<T> {
  validate(modelObject: T): ValidationResult;
}
