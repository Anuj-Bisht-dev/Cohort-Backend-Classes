import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class ResetPasswordDto extends BaseDto {
    static schema = Joi.object({
        token: Joi.string().required(),
        newPassword: Joi.string().min(8).max(50).required().pattern(/(?=.*[A-Z])(?=.*\d)/).message("password contain atleast a uppercase letter and digit")
    });
}

export default ResetPasswordDto;