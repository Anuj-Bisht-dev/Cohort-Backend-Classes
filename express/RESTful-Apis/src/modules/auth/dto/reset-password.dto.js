import Joi from "joi";
import { BaseDto } from "../../../common/dto/base.dto.js";

class ResetPassword extends BaseDto {
    static schema = Joi.object({
        password: Joi.string()
            .required()
            .max(50)
            .min(8)
            .pattern(/(?=.*[A-Z])(?=.*\d)/)
            .message("The password contain atleast one uppercase letter and digit"),
    });
}

export { ResetPassword }