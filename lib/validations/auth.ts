import * as z from "zod"

export const userSignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const userSignUpSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .nonempty({ message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" }),
  termsAccepted: z
    .boolean()
    .refine(
      (val) => val === true,
      "You must accept the terms and privacy policy"
    ),
})
