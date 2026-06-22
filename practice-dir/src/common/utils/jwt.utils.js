import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const generateAccessToken = (payload) => {
    jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m'
    });
}

const verifyAccessToken = (rawToken) => {
    jwt.verify(rawToken, process.env.JWT_ACCESS_TOKEN);
}

const generateRefreshToken = (payload) => {
    jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '1d'
    });
}

const verifyRefreshToken = (rawToken) => {
    jwt.verify(rawToken, process.env.JWT_REFRESH_TOKEN);
}

// use to verify email
const generateVerifyToken = () => {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    return { rawToken, hashedToken };
}

export { generateVerifyToken, generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken }