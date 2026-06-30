import { email, z } from "zod";

export const signupPayloadModel = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().nullable().optional(),
  email: z.email().lowercase().max(322),
  password: z.string().min(8).max(66),
});

export const emailVerifiedModel = z.object({
  token: z.string().trim(),
});

export const signinPayloadModel = z.object({
  email: email().max(322).lowercase(),
  password: z.string().min(8).max(66),
});

export const forgetPasswordModel = z.object({
  email: email().max(322).lowercase().trim(),
});

export const resetPasswordModel = z.object({
  token: z.string(),
  newPassword: z.string().min(8).max(66),
});

export const signOutModel = z.object({
  email: email().max(322).lowercase().trim(),
});
