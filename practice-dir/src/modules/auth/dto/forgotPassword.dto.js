import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class ForgotPasswordDto extends BaseDto {
    static schema = Joi.object({
        email: Joi.string().email().lowercase().max(266).required().messages({
            "email.string":"please enter a valid email",
            "string.empty": "Email is required",
            "any.required": "Email is required",
        }),
    })
}

export default ForgotPasswordDto;