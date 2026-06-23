import { z } from "zod";

export const signupPayloadModel = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().nullable().optional(),
  email: z.email().lowercase().max(322),
  password: z.string().min(8).max(66),
});
