import type { Request, Response } from "express";
import { createHmac, hash, randomBytes } from "node:crypto";
import { signupPayloadModel } from "./auth.model";
import ApiError from "../../common/utils/api-error";
import { db } from "../../common/db";
import { userTable } from "../../common/db/schema";
import { eq } from "drizzle-orm";
import ApiResponse from "../../common/utils/api-response";

class AuthenticationControllers {
  public async handleSignup(req: Request, res: Response) {
    const validateSignupPayload = await signupPayloadModel.safeParseAsync(
      req.body
    );
    if (validateSignupPayload.error)
      throw ApiError.badRequest(`body validation failed errors: ${validateSignupPayload.error.issues}`);

    const { email, firstName, lastName, password } = validateSignupPayload.data;

    const usersEmailResult = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email));

    if (usersEmailResult.length > 0)
      throw ApiError.badRequest("duplicate Entry: users email already exists");

    const salt = randomBytes(32).toString("hex");
    const hash = createHmac("sha256", salt).update(password).digest("hex");

    const result = await db
      .insert(userTable)
      .values({
        firstName,
        lastName,
        email,
        password: hash,
        salt,
      })
      .returning({ id: userTable.id });

    return ApiResponse.created(
      res,
      "user has been created successfully",
      result
    );
  }
}

export default AuthenticationControllers;
