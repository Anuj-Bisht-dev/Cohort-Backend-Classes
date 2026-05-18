import Joi, { string } from "joi";
import { BaseDto } from "../../../common/dto/base.dto.js";

class RegisterDto extends BaseDto {
    static schema = Joi.object({
        name: Joi.string().min(2).max(20).trim().required(),
        email: Joi.string().email().trim().lowercase().required().max(50),
        password: Joi.string().trim().
            message("Password must contains 8 chars minimun"). // can use message if want to send any customize message
            required().min(8).max(20),
        role: Joi.string().valid("customer", "seller") // to checking enums use valid() 
            .default("customer"),
    });
}

export { RegisterDto } 
