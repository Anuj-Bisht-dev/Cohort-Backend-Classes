import Joi from 'joi';
import BaseDto from '../../../common/dto/base.dto.js'

class RegisterDto extends BaseDto {
    static schema = Joi.object({
        name: Joi.string().min(2).max(50).trim().required(),
        email: Joi.string().max(266).trim().required().lowercase().email(),
        password: Joi.string().trim().min(8).max(20).message('Password must be more than 8 characters').required(),
        role: Joi.string().valid('customer', 'seller', 'admin').default('customer'),
    });
}

export default RegisterDto;