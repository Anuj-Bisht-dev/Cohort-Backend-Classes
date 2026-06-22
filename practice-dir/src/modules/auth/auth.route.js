import { Router } from 'express';
import * as controller from './auth.controller.js'
import validate from '../../common/middleware/validate.middleware.js'
import RegisterDto from './dto/register.dto.js';
import LoginDto from './dto/login.dto.js'
import ForgotPasswordDto from './dto/forgotPassword.dto.js';
import ResetPasswordDto from './dto/resetPassword.dto.js';
import { authenticate } from './auth.middleware.js';

const router = Router();

router.post("/register", validate(RegisterDto), controller.registerController);
router.post("/login", validate(LoginDto), controller.loginController);
router.post("/logout", authenticate, controller.logoutController);
router.post("/refresh", controller.refreshController);
router.post("/forgotPassword", validate(ForgotPasswordDto), controller.forgotPasswordController);
router.post("/resetPassword/:token", validate(ResetPasswordDto), controller.resetPasswordController);
router.post("/verifyEmail/:token", controller.verifyEmailController);

export default router;