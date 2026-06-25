import { createHmac, randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";

export const generateHashToken = () => {
  const salt = randomBytes(32).toString("hex");
  const hashedToken = (password: string, salt: string): string => {
    return createHmac("sha256", salt).update(password).digest("hex");
  };

  return { salt, hashedToken };
};
