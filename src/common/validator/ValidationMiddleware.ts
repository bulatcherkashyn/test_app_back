import { NextFunction, Request, Response } from 'express';

import { ModelConstructor } from '../ModelConstructor';
import { Validator } from './Validator';

export const validate = <T, K>(
  modelConstructor: ModelConstructor<T, K>,
  validator: Validator<T>,
) => {
  return (request: Request, response: Response, next: NextFunction): void => {
    const { error } = validator.validate(modelConstructor.constructRawForm(request));

    if (error) {
      response.status(400).json({ message: error.message });
    } else {
      next();
    }
  };
};
