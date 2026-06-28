import type { Request, Response } from "express";
import {
  forgetPasswordModel,
  resetPasswordModel,
  signOutModel,
  signinPayloadModel,
  signupPayloadModel,
} from "./auth.model";
import ApiError from "../../common/utils/api-error";
import { db } from "../../common/db";
import { userTable } from "../../common/db/schema";
import { and, eq, gt } from "drizzle-orm";
import ApiResponse from "../../common/utils/api-response";
import crypto from "crypto";
import {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateHashToken,
} from "../../common/utils/token.utils";

const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

class AuthenticationControllers {
  public async handleSignup(req: Request, res: Response) {
    const validateSignupPayload = await signupPayloadModel.safeParseAsync(
      req.body
    );
    if (validateSignupPayload.error)
      throw ApiError.badRequest(
        `body validation failed errors: ${validateSignupPayload.error.issues}`
      );

    const { email, firstName, lastName, password } = validateSignupPayload.data;

    const usersEmailResult = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email));

    if (usersEmailResult.length > 0)
      throw ApiError.badRequest("duplicate Entry: users email already exists");

    const salt = generateHashToken().salt;
    const hashToken = generateHashToken().hashedToken(password, salt);

    const result = await db
      .insert(userTable)
      .values({
        firstName,
        lastName,
        email,
        password: hashToken,
        salt,
      })
      .returning({ id: userTable.id });

    return ApiResponse.created(
      res,
      "user has been created successfully",
      result
    );
  }

  public async handelSignin(req: Request, res: Response) {
    const verifySigninPayload = await signinPayloadModel.safeParseAsync(
      req.body
    );

    if (verifySigninPayload.error)
      throw ApiError.badRequest(
        `email or password is misssing errors: ${verifySigninPayload.error.issues}`
      );

    const { email, password } = verifySigninPayload.data;

    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email));
    if (!user) throw ApiError.badRequest(`email ${email} do not exists`);

    // somehow we will compare password too
    const salt = user.salt!;
    const hashedToken = generateHashToken().hashedToken(password, salt);
    if (user.password !== hashedToken)
      throw ApiError.badRequest("invalide email or password");

    // TODO: create tokens access and refresh
    const accessToken = generateAccessToken({ id: user.id });
    const refreshToken = generateRefreshToken({ id: user.id });

    await db
      .update(userTable)
      .set({ refreshToken: refreshToken })
      .where(eq(userTable.email, email));

    return ApiResponse.ok(res, "User logged In successfully", {
      accessToken,
      refreshToken,
    });
  }

  public async handleSignOut(req: Request, res: Response) {
    const user = await signOutModel.safeParseAsync(req.body);
    if (user.error) throw ApiError.badRequest("email is missing");

    const { email } = user.data;
    const userEmail = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email));

    if (!userEmail) throw ApiError.unauthorized(`email ${email} not exists`);

    await db
      .update(userTable)
      .set({ refreshToken: null })
      .where(eq(userTable.email, email));

    return ApiResponse.ok(res, "user logged out successfully");
  }

  public async handleForgetPassword(req: Request, res: Response) {
    const verifyForgetPassword = await forgetPasswordModel.safeParseAsync(
      req.body
    );
    if (verifyForgetPassword.error)
      throw ApiError.badRequest("enter valide email");

    const { email } = verifyForgetPassword.data;

    const user = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email));
    if (!user) throw ApiError.unauthorized("user is not authorized");

    const token = generateHashToken().salt;
    const hashedToken: string = hashToken(token);
    const verificationTokenExpiresIn = new Date(Date.now() * 15 * 60 * 1000);
    db.update(userTable)
      .set({
        verificationToken: hashedToken,
        verificationTokenExpiresIn: verificationTokenExpiresIn,
      })
      .where(eq(userTable.email, email));

    // send token in email to user
  }

  public async handleResetPassword(req: Request, res: Response) {
    const user = await resetPasswordModel.safeParseAsync(
      req.query.token,
      req.body
    );
    if (user.error) throw ApiError.badRequest("token or password is missing");
    const { token, newPassword } = user.data;

    const tokenVerification = await db
      .select()
      .from(userTable)
      .where(
        and(
          eq(userTable.verificationToken, token),
          gt(userTable.verificationTokenExpiresIn, new Date()) // checks the date inside the drizzle itself
        )
      );
    if (!tokenVerification) throw ApiError.unauthorized("session time expires");

    const salt = generateHashToken().salt;
    const newHashedPassword = generateHashToken().hashedToken(
      newPassword,
      salt
    );

    db.update(userTable)
      .set({
        password: newHashedPassword,
        verificationToken: null,
        verificationTokenExpiresIn: null,
      })
      .where(eq(userTable.verificationToken, hashToken(token)));

    return ApiResponse.ok(res, "password has changed successfully");
  }
}

export default AuthenticationControllers;
