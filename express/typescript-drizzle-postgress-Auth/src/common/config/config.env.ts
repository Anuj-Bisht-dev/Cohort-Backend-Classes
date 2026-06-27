// validate all env private keys
import "dotenv/config";
import ApiError from "../utils/api-error";

export function getEnv(name: string): string {
  const value = process.env[name];

  if (!value)
    throw ApiError.unauthorized(`misssing enviornment token: ${name}`);

  return value;
}

export const env = {
  PORT: getEnv("PORT"),
  PROCESS: getEnv("PROCESS"),

  DATABASE_URL: getEnv("DATABASE_URL"),

  ACCESS_TOKEN_SECRET: getEnv("ACCESS_TOKEN_SECRET"),
  ACCESS_TOKEN_EXPIRES_IN: getEnv("ACCESS_TOKEN_EXPIRES_IN"),

  REFRESH_TOKEN_SECRET: getEnv("REFRESH_TOKEN_SECRET"),
  REFRESH_TOKEN_EXPIRES_IN: getEnv("REFRESH_TOKEN_EXPIRES_IN"),
};
