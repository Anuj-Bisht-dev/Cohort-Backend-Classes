import { Router } from "express";
import * as controller from "./auth.controller.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import { RegisterDto } from "./dto/register.dto.js"

const router = Router();

router.post("/register", validate(RegisterDto), controller.register);
// here we, createad a common generic class/ method [ validate in ./common/midldleware ] that validates the DTO. that can be used by mutiple services to check their DTOs. 
// we can use without that but we have to write more that and same again and again so, we created a common-validator.

export { router }