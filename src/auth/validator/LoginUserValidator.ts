import { Validator } from '@app/common/validator/Validator';
import { logger } from '@app/logger/LoggerFactory';
import joi, { ValidationResult } from 'joi';

import { LoginDto } from '../dto/LoginDto';

export class LoginUserValidator implements Validator<LoginDto> {
  private joiValidator = joi.object<LoginDto, true>({
    username: joi.string().email().required(),
    password: joi.string().max(128).required(),
  });

  validate(modelObject: LoginDto): ValidationResult {
    logger.debug('user-auth-form.validate');
    return this.joiValidator.validate(modelObject);
  }
}
