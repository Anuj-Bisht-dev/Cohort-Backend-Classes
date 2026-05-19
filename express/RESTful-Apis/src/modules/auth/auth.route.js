import { Router } from "express";
import * as controller from "./auth.controller.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import { RegisterDto } from "./dto/register.dto.js"
import { authenticate } from "./auth.middleware.js";
import { LoginDto } from "./dto/login.dto.js";

const router = Router();

router.post("/register", validate(RegisterDto), controller.register);
// here we, createad a common generic class/ method [ validate in ./common/midldleware ] that validates the DTO. that can be used by mutiple services to check their DTOs. 
// we can use without that but we have to write more that and same again and again so, we created a common-validator.

router.post("/login", validate(LoginDto), controller.login); // here calling is imp.
router.post("logout", authenticate, controller.logout);

router.get("/me", authenticate, controller.getMe); // only passes ref for authenciate when needed passon to user

export { router }
