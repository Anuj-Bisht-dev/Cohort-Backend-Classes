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

const logout = async (req, res) => {
    const userId = await authService.logout(req.user.id);
    res.clearCookie("accessToken", "refreshToken");

    ApiResponse.ok(res, "LogOut Success", userId);
}

const getMe = async (req, res) => {
    const user = await authService.getMe(req.user.id);
    ApiResponse.ok(res, "user profile", user);
}


export { register, login, logout, getMe }
