import ApiResponse from '../../common/utils/Api-response.js';
import * as authService from './auth.service.js';
import User from './auth.model.js';
import cookie from 'cookie-parser';

const registerController = async (req, res) => {
    const user = await authService.register(req.body);
    return ApiResponse.created(res, 'user has been created', user);
}

const loginController = async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.login(req.body);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 15 * 60 * 1000,
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
    });

    return ApiResponse.ok(res, 'logged in successfully', { user, accessToken, refreshToken });
}

const logoutController = async (req, res) => {
    const userId = await authService.logOut(req.user.id);
    res.clearCookie("accessToken", "refreshToken");

    ApiResponse.ok(res, "logged out successfully");
}

const refreshController = async (req, res) => {
    const { user, accessToken, hashedRefreshToken } = await authService.refresh(req.cookies?.accessToken);

    res.cookie("accessToken", accessToken, {
        secure: true,
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", hashedRefreshToken, {
        secure: true,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
    });

    ApiResponse.ok(res, "successfully generated access token", { user, accessToken, hashedRefreshToken });
}

const forgotPasswordController = async (req, res) => {
    const user = await authService.forgotPassword(req.body.email);
    ApiResponse.ok(res, "verification token sent");
}

const resetPasswordController = async (req, res) => {
    await authService.resetPassword(req.body.token, req.body.newPassword);
    ApiResponse.ok(res, "reset password success");
}

const verifyEmailController = async (req, res) => {
    await authService.verifyEmail(req.params.token);
    ApiResponse.ok(res, "email is verified");
}

export { registerController, loginController, logoutController, refreshController, forgotPasswordController, resetPasswordController, verifyEmailController };
