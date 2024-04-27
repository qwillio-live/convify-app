import * as z from "zod"

export const userSignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const userSignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
})
