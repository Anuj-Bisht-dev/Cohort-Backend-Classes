import { Router } from "express";
import * as controller from "./auth.controller.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import { RegisterDto } from "./dto/register.dto.js"
import { authenticate } from "./auth.middleware.js";
import { LoginDto } from "./dto/login.dto.js";
import { ForgotPassword } from "./dto/forgot-password.dto.js"
import { ResetPassword } from "./dto/reset-password.dto.js"

const router = Router();

router.post("/register", validate(RegisterDto), controller.register);
// here we, createad a common generic class/ method [ validate in ./common/midldleware ] that validates the DTO. that can be used by mutiple services to check their DTOs. 
// we can use without that but we have to write more that and same again and again so, we created a common-validator.

router.post("/login", validate(LoginDto), controller.login); // here calling is imp.
router.post("/logout", authenticate, controller.logout);
router.post("/refresh-token", controller.refreshToken);
router.post("/forgot-password", validate(ForgotPassword), controller.forgetPassword);
router.post("/verify-email/:token", controller.verifyEmail);
router.post("/reset-password/:token", validate(ResetPassword), controller.resetPassword);
router.get("/getMe", authenticate, controller.getMe); // only passes ref for authenciate when needed pass-on to user

export default router;
