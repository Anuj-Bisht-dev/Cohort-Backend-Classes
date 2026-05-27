import { ApiResponse } from "../../common/utils/api-response.js";
import * as authService from "./auth.service.js";
import User from "./auth.model.js";
import cookie from "cookie-parser";

const register = async (req, res) => {                                                      
    const user = await authService.register(req.body);  
    ApiResponse.created(res, "Registration success", user);
}

const login = async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    res.cookie("accessToken", accessToken, {
        httpOnly: true, // secure
        secure: true,
        maxAge: 15 * 60 * 1000 // 15min 
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // secure
        secure: true,
        maxAge: 24 * 60 * 60 * 1000 // 24hours
    });

    ApiResponse.ok(res, "LoggedIn successfully", { user, accessToken, refreshToken });
};

const refreshToken = async (req, res) => {
    const { accessToken } = await authService.refresh(req.cookies?.refreshToken);
    ApiResponse.ok(res, "Token refreshed successfully", accessToken);
}

const verifyEmail = async (req, res) => {
    await authService.verifyEmail(req.params.token);
    ApiResponse.ok(res, "email verification success");
}

const forgetPassword = async (req, res) => {
    authService.forgetPassword(req.body.email);
    ApiResponse.ok(res, "reset password success");
}

const resetPassword = async (req, res) => {
    await authService.resetPasswords(req.body.token, req.body.newPassword);
    ApiResponse.ok(res, "password reset successfully");
}

const logout = async (req, res) => {
    const userId = await authService.logout(req.user.id);
    res.clearCookie("accessToken", "refreshToken");

    ApiResponse.ok(res, "LogOut Success", userId);
}

const getMe = async (req, res) => {
    const user = await authService.getMe(req.user.id);
    ApiResponse.ok(res, "user profile", user);
}


export { register, login, logout, forgetPassword, resetPassword, getMe, refreshToken, verifyEmail }
