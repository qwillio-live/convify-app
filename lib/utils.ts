import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import crypto from "crypto"
import { sign } from "jsonwebtoken"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  return new Date(date).toISOString()
}

export function absoluteUrl(url: string) {
  return url
}

export const generateSignInLink = (userEmail) => {
  // Generate a short token (up to 10 characters)
  const shortToken = crypto.randomBytes(5).toString("hex") // Generates a 10-character token

  // Generate a JWT token with the user's email and short token
  const jwtToken = sign(
    { email: userEmail, token: shortToken },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.AUTH_TOKEN_EXPIRATION, // Set token expiration time as needed
    }
  )

  // Create a sign-in link using the JWT token
  const signInLink = `${process.env.NEXT_PUBLIC_DOMAIN_URL}/auth/signin-link?token=${jwtToken}`

  return signInLink
}
