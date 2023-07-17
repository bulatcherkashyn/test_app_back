import { Validator } from '@app/common/validator/Validator';
import { logger } from '@app/logger/LoggerFactory';
import { CreateUserDTO } from '@app/users/dto/UsersDTO';
import joi, { ValidationResult } from 'joi';

export class CreateUserValidator implements Validator<CreateUserDTO> {
  private joiValidator = joi.object<CreateUserDTO, true>({
    username: joi.string().email().required(),
    password: joi.string().max(128).required(),
    role: joi.string().valid('ADMIN', 'BOSS', 'REGULAR').optional(),
    bossId: joi.string().optional(),
  });

  validate(modelObject: CreateUserDTO): ValidationResult {
    logger.debug('user-auth-form.validate');
    return this.joiValidator.validate(modelObject);
  }
}
