import { ApiError } from "../../common/utils/api-error.js"
import {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    generateResetToken,
    verifyRefreshToken
} from "../../common/utils/jwt.utils.js";
import User from "./auth.model.js"; 
import { decode } from "jsonwebtoken";
import { sendVerificationEmail } from "../../common/config/mail.js";


const hashedToken = (token) =>
    crypto.createHash("sha256").update(token).digest("hex");

const register = async ({ name, email, password, role }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw ApiError.conflict("email already exists");

    const { rawToken, hashedToken } = generateResetToken();

    const user = await User.create({
        // name: name // is it equivalent to below ones
        name,
        email,
        password,
        role,
        // isVerified,
        verificationToken: hashedToken,
    });

    // TODO: send an email to user with Token: rawToken
    // Don't let email failure crash registration — user is already created
    try {
        sendVerificationEmail(email, rawToken);
    } catch (error) {
        throw ApiError.notFound("email sending failed");
    }

    // In case want to delete any feilds from user then.
    const userObj = user.toObject();    
    delete userObj.password;
    delete userObj.verificationToken;

    return userObj;
}


const login = async ({ email, password }) => {
    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new ApiError.unauthorized("Invalide email or password");

    // somehow we will check the password
    const isMatch = await user.comparePasswords(password); // return boolean value
    if (!isMatch) throw ApiError.unauthorized("Invalide email or password");


    if (!user.isVerified) {
        throw ApiError.fobidden("please verify your email before login");
    }

    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id });

    // Store hashed refresh token in DB so it can be invalidated on logout
    user.refreshToken = hashedToken(refreshToken);
    await user.save({ validateBeforeSave: false });

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    return { user: userObj, accessToken, refreshToken };
}


const refresh = async (token) => {
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

    // Clear stored refresh token so it can't be reused
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
    const trimmed = String(token).trim();
    if (!trimmed) throw ApiError.unauthorized("Invalid or expired verification token");

    // DB stores SHA256(raw). Links / email use the raw token — we hash for lookup.
    // If you paste the hash from MongoDB into Postman, hashing again would not match;
    // so we also try a direct match on the stored value.
    const hashToken = hashedToken(trimmed);
    const user = await User.findOne({ verificationToken: hashToken }).select("+verificationToken");
    if (!user) user = await User.findOne({ verificationToken: trimmed }).select("+verificationToken");

    if (!user) throw ApiError.badRequest("Invalid or expired verification token");

    await User.findByIdAndUpdate(user._id, { isVerified: true, verificationToken: undefined });
    return user;
}

// resetPasswords
const resetPasswords = async (token, newPassword) => {
    const hashToken = hashedToken(token);

    const user = await User.findOne({ resetPasswordToken: hashToken, resetTokenExpires: { $gt: Date.now() } }).select("+resetPasswordToken +resetPasswordTokenExpires");

    if (!user) throw ApiError.badRequest("Invalid or expired reset password token");

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save();

    return { message: "Password reset successfully" };
}


const getMe = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound("user not found");
    return user;
}


export {
    register,
    login,
    refresh,
    logout,
    forgetPassword,
    resetPasswords,
    verifyEmail,
    getMe
} 
