import { any } from "joi";
import { ApiError } from "../../common/utils/api-error.js"
import { generateAccessToken, generateRefreshToken, verifyAccessToken, generateResetToken, verifyRefreshToken } from "../../common/utils/jwt.utils.js";
import User from "./auth.model.js";
import { decode, verify } from "jsonwebtoken";
import { sendVerificationEmail } from "../../common/config/mail.js";


const register = async (name, email, password, role) => {

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError.conflict("email already exists");
    }

    const { rawToken, hashedToken } = generateResetToken();

    const user = await User.create({
        // name: name // is it equivalent to below ones
        name,
        email,
        password,
        role,
        isVerified,
        verificationToken: hashedToken,
    });

    // TODO: send an email to user with Token: rawToken
    try {
        sendVerificationEmail(email, token);
    } catch (error) {
        throw ApiError.notFound("email is not found");
    }

    // in case want to delete the any feilds from user then
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.verificationToken;

    return userObj;
}


const hashedToken = (token) =>
    crypto.createHash("sha256").update(token).digest("hex");

const login = async ({ email, password }) => {
    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new ApiError.unauthorized("unvalide email or password");

    // somehow we will check the password
    const isMatch = await user.comparePasswords(password); // return boolean value
    if (!isMatch) throw ApiError.unauthorized("Invalide email or password");


    if (!user.isVerified) {
        throw ApiError.fobidden("please verify your email before login");
    }

    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id });

    user.verificationToken = hashedToken(refreshToken);
    await user.save({ validateBeforeSave: false });

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    return { user: userObj, accessToken, refreshToken };

}


const refresh = (token) => {
    if (!token) throw ApiError.unauthorized("Refresh token missing");

    const decoded = verifyRefreshToken(token);

    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user) throw ApiError.unauthorized("user not founded by token");

    if (user.refreshToken !== hashedToken(token))
        throw ApiError.unauthorized("Invalide Refresh Token");

    const accessToken = generateAccessToken({ id: user._id, role: user.role });

    return { accessToken };

}


const logout = async (userId) => {
    // const user = await User.findOne(userId);
    // if (!user) throw ApiError.unauthorized("user not found");

    // user.refreshToken = undefined;
    // await user.save({ validateBeforeSave: false });

    await User.findByIdAndUpdate(userId, { refreshToken: undefined }); // done in a single line
}


const forgetPassword = async (email) => {
    const user = await User.findOne({ email });
    if (!user) throw ApiError.notFound("user is not found");

    const { rawToken, hashedToken } = generateResetToken();

    user.resetPasswordToken = hashedToken;
    user.resetPasswordToken = Date.now() + 15 * 60 * 1000;
    await user.save();

}


const verifyEmail = async (token) => {
    const hashedToken = hashedToken(token);
    const user = await User.findOne({ verificationToken: hashedToken }).select("+verificationToken");
    if (!user) throw ApiError.notFound("email not found");
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    return user;
}

// resetPasswords
const resetPasswords = async ({ email, password }, newPassword) => {
    const user = await User.findOne({ email, password });
    if (!user) throw ApiError.unauthorized("email or password is Invalide");

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
}


const getMe = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound("user not found");
    return user;
}

register();

export { register, login, refresh, logout, forgetPassword } 