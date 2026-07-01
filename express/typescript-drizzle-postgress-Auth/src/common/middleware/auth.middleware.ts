import ApiError from "../utils/api-error";
import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/token.utils";

// this authencation middleware always checks every request it donot restrict any request (only for checking and validation) 
export function authencation() {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) next();

    if (!authHeader?.startsWith("bearer"))
      throw ApiError.badRequest("authorization token must starts with bearer");

    const token = authHeader.split(" ")[1];
    if (!token)
      throw ApiError.badRequest(
        "authorization token must starts with bearer and followed by token"
      );

    const user = verifyAccessToken(token!);

    // @ts-ignore
    req.user = user;

    next();
  };
}

// this will restricts the unauthenticated users
export function restrictToAuthenticatedUser() {
  return (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    if (!req.user) throw ApiError.unauthorized("unauthentication Required");
    next();
  };
}
