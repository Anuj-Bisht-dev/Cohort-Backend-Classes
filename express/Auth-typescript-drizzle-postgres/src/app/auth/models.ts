import { string, z } from "zod";

export const signupPayloadModel = z.object({
  firstName: z.string().min(2).max(45),
  lastName: z.string().nullable().optional(),
  email: z.email().max(266),
  password: z.string().min(6).max(200),
});
