import Joi from 'joi'
import BaseDto from '../../../common/dto/base.dto.js'

class LoginDto extends BaseDto {
    static schema = Joi.object({
        email: Joi.string().lowercase().max(266).trim().message('email is required'),
        password: Joi.string().min(8).max(50).trim().message('password is required'),
    });
}

export default LoginDto;