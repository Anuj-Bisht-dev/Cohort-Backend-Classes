import { createHmac, randomBytes } from "node:crypto";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../config/config.env.js";

interface UserTokenPayload {
  id: string;
}

const generateAccessToken = (payload: UserTokenPayload) => {
  const secret = env.ACCESS_TOKEN_SECRET as Secret;
  const options: SignOptions = {
    expiresIn: (env.ACCESS_TOKEN_EXPIRES_IN ?? "15m") as NonNullable<
      SignOptions["expiresIn"]
    >,
  };

  const token: string = jwt.sign(payload, secret, options);
  return token;
};

const verifyAccessToken = (token: string) => {
  const secret = env.ACCESS_TOKEN_SECRET as Secret;
  try {
    const payload = jwt.verify(token, secret) as UserTokenPayload;
    return payload;
  } catch (error) {
    return null;
  }
};

const generateRefreshToken = (payload: UserTokenPayload) => {
  const secret = env.REFRESH_TOKEN_SECRET as Secret;
  const option: SignOptions = {
    expiresIn: (env.REFRESH_TOKEN_EXPIRES_IN ?? "24h") as NonNullable<
      SignOptions["expiresIn"]
    >,
  };
  const token: string = jwt.sign(payload, secret, option);
  return token;
};

const verifyRefreshToken = (token: string) => {
  try {
    const secret = env.REFRESH_TOKEN_SECRET as Secret;
    const payload = jwt.verify(token, secret) as UserTokenPayload;

    return payload;
  } catch (error) {
    return null;
  }
};

const generateHashToken = () => {
  const salt = randomBytes(32).toString("hex");
  const hashedToken = (password: string, salt: string): string => {
    return createHmac("sha256", salt).update(password).digest("hex");
  };

  return { salt, hashedToken };
};

export {
  generateHashToken,
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
