import { Validator } from '@app/common/validator/Validator';
import { logger } from '@app/logger/LoggerFactory';
import { UpdateUserDTO } from '@app/users/dto/UsersDTO';
import joi, { ValidationResult } from 'joi';

export class UpdateUserValidator implements Validator<UpdateUserDTO> {
  private joiValidator = joi.object<UpdateUserDTO, true>({
    token: joi.string().required(),
    updateUserUID: joi.string().required(),
    newBossUID: joi.string().required(),
  });

  validate(modelObject: UpdateUserDTO): ValidationResult {
    logger.debug('user-auth-form.validate');
    return this.joiValidator.validate(modelObject);
  }
}
