import crypto from "crypto"
import jwt from "jsonwebtoken";

const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_ACSESS_SECRET, {
        expiresIn: process.env.JWT_ACSESS_EXPIRES_IN || '15m'
    });
}

const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_ACSESS_SECRET);
}   

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '24h'
    });
}

const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}

// uses this for verifying emails
const generateResetToken = () => {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex")

    return { rawToken, hashedToken }
}

export {
    generateResetToken,
    generateAccessToken,
    verifyAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
}
