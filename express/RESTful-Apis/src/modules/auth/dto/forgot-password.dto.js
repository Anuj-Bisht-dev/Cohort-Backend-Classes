import Joi from "joi";
import { BaseDto } from "../../../common/dto/base.dto.js";

class ForgotPassword extends BaseDto {
    static schema = Joi.object({
        email: Joi.string().lowercase().required().email()
    });
}
export { ForgotPassword }