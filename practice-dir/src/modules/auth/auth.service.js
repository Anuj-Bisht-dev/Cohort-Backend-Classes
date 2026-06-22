import ApiError from '../../common/utils/api-error.js';
import crypto from 'crypto';
import { generateAccessToken, generateRefreshToken, generateVerifyToken, verifyRefreshToken } from '../../common/utils/jwt.utils.js';
import User from './auth.model.js'
import { Resend } from 'resend';
import { sendEmail } from '../../common/config/email.js';

// register user for the first time.
// take data from user like :- name, password, email and role
// then check user in db if user exists then return error
// else proceed:- first hash the password then store data in db 
// send email to verify the user

const register = async ({name, email, password, role}) => {
    const userExists = await User.findOne({ email });
    if (userExists) throw ApiError.conflict("email already exists");

    const { rawToken, hashedToken } = generateVerifyToken();

    const user = User.create({
        name,
        email,
        password, // hash krana hai db(model.js) mei
        role,
        verifyToken: hashedToken,
        verifyTokenExpires: Date.now() + 15 * 60 * 1000
    });

    // email send karke verify karenge baad main
    try {
        sendEmail(email, rawToken);
    } catch (error) {
        throw ApiError.unauthorized(error.message);
    }

    const userObj = (await user).toObject();
    delete userObj.password;
    delete userObj.verifyToken;
    delete userObj.verifyTokenExpires;

    return userObj;
}

// login service
// user gives data : email and password
// check email and password from db
// if wrong email or password throw error
// else send verification message on users email

const hashToken = (token) => { crypto.createHash('sha256').update(token).digest('hex') };

const login = async ({ email, password }) => {
    const user = await User.findOne({ email }).select('+password');
    if (!user) throw ApiError.unauthorized('Email or Password is invalid');

    // somehow we will check the password
    const userPassword = user.comparePassword(password);
    if (!userPassword) throw ApiError.unauthorized("Invalid email or password");

    const accessToken = await generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = await generateRefreshToken({ id: user._id });

    user.refreshToken = hashToken(refreshToken);
    user.save({ validateBeforeSave: false });

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    return { user: userObj, accessToken, refreshToken };

}

// maan le accessToken expires ho gya tab client refreshToken route pe req karega
// take token from client
// match token from db stored token
// if error throw unathorized invalide token
// else generate new accessToken and return it
const refresh = async (token) => {
    if (!token) throw ApiError.unauthorized('Refresh Token missing');

    const decodedToken = verifyRefreshToken(token);
    if (!decodedToken) throw ApiError.unauthorized('invalid Refresh Token');

    const user = await User.findById(decodedToken.id).select('+refreshToken');
    if (!user) throw ApiError.unauthorized('user not Found');

    if (user.refreshToken !== hashToken(token)) throw ApiError.unauthorized('Invalid refresh token');

    const accessToken = await generateAccessToken({ user: user._id, role: user.role });
    const refreshToken = await generateRefreshToken({ user: user._id });

    const hashedRefreshToken = hashToken(refreshToken);
    user.refreshToken = hashedRefreshToken;
    user.save({
        validateBeforeSave: false
    });

    const userObj = user.toObject();
    delete userObj.refreshToken;

    return { user: userObj, accessToken, hashedRefreshToken }

}

const logOut = async (userId) => {

    // const user = await User.findById(userId);
    // if (!user) throw ApiError.unauthorized('userId is invalide');

    // user.refreshToken = undefined;
    // await user.save({
    //     validateBeforeSave: false
    // });

    await User.findByIdAndUpdate(userId, { refreshToken: undefined })
}

// ask user for email
// check if email exist in db or not
// generate verification token and also store it in db in hashed format
// also set expired time for verification
// send verification token to check whether user have that email at that time or not
// then redirect resetPassword

const forgotPassword = async (email) => {
    if (!email) throw ApiError.unauthorized("Email input is missing");

    const user = await User.findOne({ email }).select("+verifyToken").select("+verifyTokenExpires");
    if (!user) throw ApiError.unauthorized("user not found");

    const { rawToken, hashedToken } = generateVerifyToken();
    user.verifyToken = hashedToken;
    user.verifyTokenExpires = Date.now() + (15 * 60 * 1000);
    user.save({ validateBeforeSave: false })

    // somehow we will send rawToken to user through email
    try {
        sendEmail(email, rawToken);
    } catch (error) {
        throw ApiError.unauthorized(error.message);
    }

    const userObj = user;
    delete userObj.verifyToken;
    delete userObj.verifyTokenExpires;

    return userObj;
}

// in resetPassword route:- it takes token, newPassword
// check token from db if valide proceed or if not throw err
// check is verficationToken has expires or not (in this case 15m & stored in db)
// if true then save new password in db

const resetPassword = async ({ token, newPassword }) => {
    if (!token || !newPassword) throw ApiError.unauthorized("token or password is missing");

    const decodedToken = hashToken(token);
    const user = await User.findOne({ verifyToken: decodedToken }).select("+password").select("+verifyTokenExpires");
    if (!user) throw ApiError.unauthorized("verification token is not valide");

    const verificationTime = await user.verifyTokenExpires;
    if (verificationTime <= Date.now()) throw ApiError.unauthorized("verification time expires");

    user.password = newPassword;
    await user.save({
        validateBeforeSave: false
    });

    const userObj = user;
    delete userObj.verifyToken;
    delete userObj.verifyTokenExpires;

    return { message: "password reset successfully" };
}


// client req on verifyEmail route
// already sent verification token while registration
// ask client for token
// check token is empty or not
// then check token in databases
// if true then turn isVerfied true else return error

const verifyEmail = async (token) => {
    if (!token) throw ApiError.unauthorized('Invalid or Expired verification Token');

    const user = await User.findOne({ verifyToken: hashToken(token) }).select('+verifyToken').select('+verifyTokenExpires');
    if (!user) throw ApiError.badRequest('Invalid or Expired verification token');

    const verificationTime = await user.verifyTokenExpires;
    if (verificationTime <= Date.now()) throw ApiError.unauthorized('Expires verification Token');

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpires = undefined;
    await user.save({
        validateBeforeSave: false
    })

    const userObj = user.toObject();
    delete userObj.verifyToken;
    delete userObj.verifyTokenExpires;

    return userObj;

}

export { register, login, logOut, verifyEmail, refresh, forgotPassword, resetPassword };
