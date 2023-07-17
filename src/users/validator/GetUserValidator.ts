import { Validator } from '@app/common/validator/Validator';
import { logger } from '@app/logger/LoggerFactory';
import joi, { ValidationResult } from 'joi';

import { GetProfileRequest } from '../models/User';

export class GetUserValidator implements Validator<GetProfileRequest> {
  private joiValidator = joi.object<GetProfileRequest, true>({
    token: joi.string().required(),
  });

  validate(modelObject: GetProfileRequest): ValidationResult {
    logger.debug('user-auth-form.validate');
    return this.joiValidator.validate(modelObject);
  }
}
